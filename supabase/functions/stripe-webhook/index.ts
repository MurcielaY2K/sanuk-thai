// Supabase Edge Function: Stripe webhook → entitlements table.
//
// Deploy:  supabase functions deploy stripe-webhook --no-verify-jwt
// Secrets: supabase secrets set STRIPE_SECRET_KEY=sk_... STRIPE_WEBHOOK_SECRET=whsec_...
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.)
//
// Stripe events handled (enable ALL of these on the webhook endpoint):
//   checkout.session.completed               → activate, if already paid
//   checkout.session.async_payment_succeeded → activate a delayed payment
//   customer.subscription.updated     → sync status + period end
//   customer.subscription.deleted     → canceled
//   invoice.payment_failed            → past_due
//
// The buyer's Supabase auth uuid arrives as `client_reference_id` on the
// Checkout Session (appended to the Payment Link URL by the app).

import Stripe from 'npm:stripe@17';
import { createClient } from 'npm:@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2024-06-20',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

const WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? '';

// A paid checkout we could not attach to a user. Throws if even this write
// fails, so the handler returns 500 and Stripe retries the event.
async function parkUnlinked(session: Stripe.Checkout.Session, reason: string) {
  console.error('UNLINKED PAYMENT', session.id, reason);
  const { error } = await supabase.from('unlinked_payments').upsert({
    stripe_session_id: session.id,
    stripe_customer_id:
      typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
    stripe_subscription_id:
      typeof session.subscription === 'string' ? session.subscription : session.subscription?.id ?? null,
    customer_email: session.customer_details?.email ?? null,
    amount_total: session.amount_total,
    currency: session.currency,
    reason,
  }, { onConflict: 'stripe_session_id' });
  if (error) throw new Error(`could not park unlinked payment ${session.id}: ${error.message}`);
}

function subscriptionStatusToEntitlement(s: Stripe.Subscription.Status): string {
  if (s === 'active' || s === 'trialing') return 'active';
  if (s === 'past_due' || s === 'unpaid') return 'past_due';
  return 'canceled';
}

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object as Stripe.Checkout.Session;
        // For delayed payment methods, `completed` fires BEFORE the money
        // arrives (payment_status 'unpaid'); access is granted on the later
        // async_payment_succeeded event instead.
        if (session.payment_status === 'unpaid') break;

        let authId = session.client_reference_id;
        if (!authId) {
          // The app could not attach its user id. Try the buyer's Stripe
          // email against accounts with a confirmed linked email.
          const email = session.customer_details?.email;
          if (email) {
            const { data } = await supabase.rpc('auth_id_for_email', { p_email: email });
            if (data) authId = data as string;
          }
        }
        if (!authId) {
          await parkUnlinked(session, 'no client_reference_id and no email match');
          break;
        }
        const subscriptionId =
          typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
        let periodEnd: string | null = null;
        let status = 'active';
        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          periodEnd = new Date(sub.current_period_end * 1000).toISOString();
          status = subscriptionStatusToEntitlement(sub.status);
        }
        const { error } = await supabase.from('entitlements').upsert({
          auth_id: authId,
          status,
          stripe_customer_id:
            typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null,
          stripe_subscription_id: subscriptionId ?? null,
          current_period_end: periodEnd,
          updated_at: new Date().toISOString(),
        });
        if (error) {
          // e.g. client_reference_id is not a real user (FK violation).
          // Never ack a paid purchase we failed to record: park it for review.
          console.error('entitlement upsert failed', session.id, error);
          await parkUnlinked(session, `upsert failed: ${error.message}`);
        }
        break;
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const status =
          event.type === 'customer.subscription.deleted'
            ? 'canceled'
            : subscriptionStatusToEntitlement(sub.status);
        const { error } = await supabase
          .from('entitlements')
          .update({
            status,
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', sub.id);
        if (error) throw error; // 500 → Stripe retries
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subId =
          typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription?.id;
        if (subId) {
          const { error } = await supabase
            .from('entitlements')
            .update({ status: 'past_due', updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', subId);
          if (error) throw error; // 500 → Stripe retries
        }
        break;
      }

      default:
        // Unhandled event types are acknowledged so Stripe stops retrying.
        break;
    }
  } catch (err) {
    console.error('Webhook handler error:', err);
    return new Response('Handler error', { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
