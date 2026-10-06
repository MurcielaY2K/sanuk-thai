#!/usr/bin/env node
// Injects a Content-Security-Policy <meta> into every exported HTML page.
// GitHub Pages cannot send response headers, so the policy has to live in the
// document. Inline <script> blocks (app/+html.tsx) are allowed by SHA-256 hash
// rather than 'unsafe-inline', so an injected script would still be blocked.
//
// style-src keeps 'unsafe-inline': react-native-web injects its styles at
// runtime, and inline styles are a far smaller risk than inline script.
// frame-ancestors cannot be set from a meta tag (browsers ignore it there).

import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';

const DIST = process.argv[2] ?? 'dist';
const SUPABASE = 'utshlbvqwlojovnlnhxd.supabase.co';

function htmlFiles(dir) {
  return readdirSync(dir).flatMap(name => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === '_expo' || name === 'audio' ? [] : htmlFiles(p);
    return p.endsWith('.html') ? [p] : [];
  });
}

let count = 0;
for (const file of htmlFiles(DIST)) {
  let html = readFileSync(file, 'utf8');
  // Expo's export emits a minimal policy (object-src/base-uri only); replace
  // it with the complete one below, which keeps both of its directives.
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/g, '');

  const hashes = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => m[1])
    .filter(body => body.trim())
    .map(body => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);

  const policy = [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(' ')}`.trim(),
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "media-src 'self' data: blob:",
    `connect-src 'self' https://${SUPABASE} wss://${SUPABASE} https://*.ingest.sentry.io https://*.ingest.us.sentry.io https://*.ingest.de.sentry.io`,
    "worker-src 'self'",
    "manifest-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join('; ');

  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy}">`;
  // Must precede any script, so place it straight after <head>.
  html = html.replace(/<head([^>]*)>/, `<head$1>${meta}`);
  writeFileSync(file, html);
  count++;
}
console.log(`CSP injected into ${count} page(s)`);
