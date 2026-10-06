import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

// Same source builds for two hosts (see scripts/build-web.sh): GitHub Pages
// at a subpath, or Cloudflare Pages at the domain root. Both env vars are
// inlined at build time by Expo (EXPO_PUBLIC_* are statically replaced), so
// this resolves to plain string literals in the shipped HTML — no runtime cost.
const BASE_PATH   = process.env.EXPO_PUBLIC_BASE_PATH   ?? '/sanuk-thai';
const SITE_ORIGIN = process.env.EXPO_PUBLIC_SITE_ORIGIN ?? 'https://murcielay2k.github.io';
const SITE_URL    = `${SITE_ORIGIN}${BASE_PATH}/`;
const OG_IMAGE    = `${SITE_URL}og.png`;
const SW_PATH     = `${BASE_PATH}/service-worker.js`;
const SW_SCOPE    = `${BASE_PATH}/`;

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="th">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover"
        />
        <meta name="theme-color" content="#f0eee7" />
        {/* GitHub Pages can't send security headers, so ship what meta-CSP
            supports: no plugins, no <base> hijacking, no cross-site referrers.
            (script-src is deliberately omitted — Expo emits inline scripts.) */}
        <meta httpEquiv="Content-Security-Policy" content="object-src 'none'; base-uri 'none'" />
        <meta name="referrer" content="no-referrer" />
        <title>Sanuk Thai — Learn Thai</title>
        <meta name="description" content="Sanuk Thai: learn Thai with 3,100+ words, reading and writing practice, quizzes and a global leaderboard. Free to play, right in your browser." />
        {/* Open Graph / social sharing */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Sanuk Thai" />
        <meta property="og:title" content="Sanuk Thai — Learn Thai" />
        <meta property="og:description" content="Sanuk Thai: learn Thai with 3,100+ words, reading and writing practice, quizzes and a global leaderboard. Free to play, right in your browser." />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sanuk Thai — Learn Thai" />
        <meta name="twitter:description" content="Sanuk Thai: learn Thai with 3,100+ words, reading and writing practice, quizzes and a global leaderboard." />
        <meta name="twitter:image" content={OG_IMAGE} />
        <link rel="apple-touch-icon" href={`${BASE_PATH}/apple-touch-icon.png`} />
        {/* Sanuk Spirit Realm — Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pixelify+Sans:wght@400;500;600;700&family=Silkscreen:wght@400;700&family=Sarabun:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <ScrollViewStyleReset />
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body, #root {
                background-color: #f0eee7;
                font-family: 'Sarabun', system-ui, sans-serif;
              }
              /* viewport-fit=cover lets the page extend under the iPhone
                 status bar / home indicator; pad the app back out of them. */
              #root {
                padding-top: env(safe-area-inset-top);
                padding-bottom: env(safe-area-inset-bottom);
              }
              body { overscroll-behavior: none; }
              img, canvas { image-rendering: pixelated; }
              * { box-sizing: border-box; }
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Error reporting on the device.
              //  * Debug mode — open the app once with ?debug=1 (persists; ?debug=0
              //    turns it off): every error/rejection is shown raw in a red
              //    banner so it can be screenshotted.
              //  * Everyone else: nothing is ever shown for a stray error or a
              //    failed request (offline, etc.). Only if the app genuinely fails
              //    to start — an error while #root is still empty — do they get a
              //    plain "please reload" message instead of a blank screen.
              (function () {
                var DEBUG_KEY = '@thaiapp_debug';
                var debug = false;
                try {
                  var q = new URLSearchParams(location.search).get('debug');
                  if (q === '1') localStorage.setItem(DEBUG_KEY, '1');
                  if (q === '0') localStorage.removeItem(DEBUG_KEY);
                  debug = localStorage.getItem(DEBUG_KEY) === '1';
                } catch (e) {}

                function el(id, css) {
                  var d = document.getElementById(id);
                  if (!d) {
                    d = document.createElement('div');
                    d.id = id;
                    d.style.cssText = css;
                    document.body ? document.body.appendChild(d) : document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(d); });
                  }
                  return d;
                }
                function raw(msg) {
                  if (!debug) return;
                  try {
                    el('err-banner', 'position:fixed;top:0;left:0;right:0;z-index:99999;background:#c0392b;color:#fff;font:12px/1.5 monospace;padding:8px 12px;white-space:pre-wrap;word-break:break-all;max-height:45vh;overflow:auto')
                      .textContent += msg + '\\n';
                  } catch (e) {}
                }
                function appStarted() {
                  var r = document.getElementById('root');
                  return !!(r && r.children.length);
                }
                function startupFailed() {
                  if (debug || appStarted()) return;
                  try {
                    var d = el('load-fail', 'position:fixed;inset:0;z-index:99998;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:24px;background:#f0eee7;color:#17150f;font:16px/1.5 system-ui,sans-serif;text-align:center');
                    d.textContent = '';
                    var p = document.createElement('div');
                    p.textContent = "Sanuk Thai couldn't start. Please check your connection and reload.";
                    var b = document.createElement('button');
                    b.textContent = 'Reload';
                    b.style.cssText = 'font:inherit;padding:10px 22px;border-radius:10px;border:2px solid #17150f;background:#ff5a1f;color:#17150f;cursor:pointer';
                    b.onclick = function () { location.reload(); };
                    d.appendChild(p); d.appendChild(b);
                  } catch (e) {}
                }
                window.addEventListener('error', function (e) {
                  raw('[error] ' + (e.message || '') + ' @ ' + (e.filename || '').split('/').pop() + ':' + e.lineno);
                  startupFailed();
                });
                window.addEventListener('unhandledrejection', function (e) {
                  var r = e.reason || {};
                  raw('[promise] ' + (r.message || String(r)).slice(0, 300));
                });
              })();
              (function () {
                if (!('serviceWorker' in navigator)) return;
                var OUR_SW = '${SW_PATH}';
                // Silently unregister any leftover service worker that isn't
                // ours (e.g. an old root-scope one from a previous deploy), then
                // register the current one. We deliberately do NOT force a
                // page reload here — the correct worker takes over on the next
                // natural navigation. (An earlier version reloaded on every
                // launch, which was jarring on the iOS home-screen app.)
                navigator.serviceWorker.getRegistrations().then(function (rs) {
                  rs.forEach(function (r) {
                    var u = ((r.active || r.waiting || r.installing) || {}).scriptURL || '';
                    if (u && u.indexOf(OUR_SW) === -1) r.unregister();
                  });
                }).catch(function () {});
                // updateViaCache 'none' re-fetches the SW script on every
                // navigation, so new deploys roll out without a hard refresh.
                navigator.serviceWorker
                  .register(OUR_SW, { updateViaCache: 'none', scope: '${SW_SCOPE}' })
                  .catch(function () {});
              })();
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
