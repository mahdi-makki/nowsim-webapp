# nowsim — what's left

Phases 1 and 2 are done: the codebase is consistent and the catalog is live from Yesim.
Everything below is outstanding.

---

## Reference

**Base:** `https://partners-api.yesim.biz/<endpoint>?token=<YESIM_API_TOKEN>`

| Endpoint | Phase | Use |
|---|---|---|
| `GET /plans` | done | The whole catalog |
| `GET /supported_devices` | done | Device compatibility list |
| `POST /new_user` | 3 | Email → `user_id`. Called **after** we verify the email |
| `GET /user` | 3 | Account page |
| `GET /new_esim` | 4 | Issue the eSIM. **Only from the Stripe webhook** |
| `GET /orders` | 4 | Order history |
| `GET /sim_info` | 5 | eSIM status and data remaining |
| `GET /balance` | 4 | Partner float — see the balance guard |
| `POST /set_notification_url` | 5 | Yesim pushes eSIM status changes to us |

**Pricing — use `retail_price`, never `price`.** `price` is the partner rate we are
billed; `retail_price` is what the customer pays. They are identical across all 1520
plans today, so charging `price` would look correct right up until the day it isn't.
`planPrice()` in `lib/api/mappers.ts` is the single place this is read, and the schema
makes `retail_price` required so a missing one fails loudly instead of undercharging.

**Settled:** payments via Stripe. Fulfillment calls `/new_esim` after payment; Yesim
emails the customer the QR code.

`Plan.id` is the API's 32-char hex id, carried verbatim — **this is the value the eSIM
activation call needs.** It must survive into the order.

### To confirm before Phase 4

- [ ] `/new_esim` vs `/issue_esim` — which provisions, and what does each return?
- [ ] Does Yesim email the QR itself, or must we? Decides whether we need a
      transactional email provider for fulfillment as well as for OTP.
- [ ] Does `POST /new_user` return the existing `user_id` for a known email, or error?
      Sign-in and sign-up both go through it.
- [ ] Is `/balance` a prepaid float that can run dry, or post-paid invoicing?

---

## Phase 2 leftovers

- [ ] **Stale-on-error.** A failure after the cache expires currently renders
      `error.tsx`. Decide whether to serve the last good copy instead.
- [ ] **Upstream naming is inconsistent** — `MIDDLE EAST` is uppercase, `LATAM` / `SEA` /
      `CIS` are abbreviations. They render as Yesim writes them. Add an override map?
- [ ] **`LATAM` and `Latin America` are separate destinations** with overlapping
      coverage. Confirm that is intentional.

---

## Phase 3 — Auth: email OTP, Google, Apple

Yesim has no login. `POST /new_user` takes an email and returns a `user_id` — that is an
**identifier, not a credential**. Proving the person owns the email is entirely our job,
and it is the same job for all three buttons:

```
prove the user owns an email  →  POST /new_user  →  user_id in our session cookie
```

> **The rule that keeps this safe:** only accept an email a provider says is *verified*.
> Reject a Google ID token with `email_verified !== true`, or someone signs in with an
> unverified account carrying your customer's address and receives their eSIMs.

### Step 1 — Infrastructure (unblocks the rest)

- [ ] **Transactional email** — Resend, Postmark or SES. Yesim doesn't send OTP codes.
      Verify the sending domain (SPF/DKIM) or codes land in spam.
- [ ] **Key-value store** — Upstash Redis. OTP codes, attempt counters, rate limits, and
      Stripe webhook dedup in Phase 4. The only infrastructure this project adds.

### Step 2 — Session

- [ ] Cookie: `httpOnly`, `Secure`, `SameSite=Lax`, `__Host-` prefix, encrypted with
      `jose` (JWE). `SESSION_SECRET` from env — `openssl rand -base64 32`.
- [ ] Payload: `{ email, yesimUserId, provider, issuedAt }`.
- [ ] `lib/auth/session.ts` — encrypt/decrypt + cookie set/clear, `server-only`.
- [ ] `lib/auth/dal.ts` — `verifySession()` wrapped in React `cache()`; `getAccount()`
      returns a DTO (`name`, `email`, `provider`) — **never** `yesimUserId` to the client.
- [ ] Absolute expiry 30 days, idle expiry 7 days. New session id on every sign-in.
- [ ] Delete `lib/session.ts` — the `localStorage` account goes away entirely.

### Step 3 — Email OTP

- [ ] Server actions in `app/actions/auth.ts`: `requestOtp`, `verifyOtp`, `signOut`.
- [ ] Redis `otp:<emailHash>` → `{ codeHash, attempts, expiresAt }`, TTL 5 min.
      **Store a hash of the code, not the code.**
- [ ] 6 digits from `crypto.randomInt`. Single use. Max 5 attempts, then invalidate.
- [ ] Compare with `crypto.timingSafeEqual`.
- [ ] Resend cooldown 60s. Rate limit per email and per IP.
- [ ] **Identical response whether or not the email is known.** Never reveal which
      addresses have accounts.
- [ ] On success only: `POST /new_user` → session.

### Step 4 — Google and Apple

- [ ] `app/api/auth/google/route.ts` + `callback/route.ts` — OIDC with PKCE, `state` and
      `nonce` in short-lived httpOnly cookies.
- [ ] `app/api/auth/apple/callback/route.ts` — Apple posts back, so this is a **POST**
      handler. Apple's client secret is a JWT you sign yourself and must regenerate
      (6 month max lifetime) — automate it or set a reminder.
- [ ] Verify `iss`, `aud`, `exp`, `nonce` against the provider's JWKS on every ID token.
      Exact redirect-URI allowlist.
- [ ] **Reject any token whose email is not verified.**
- [ ] Apple's "Hide My Email" gives a `@privaterelay.appleid.com` address. It is real and
      deliverable — treat it as the account email and send the eSIM there.
- [ ] Apple returns the user's name **only on the first authorization**. Persist it then
      or it is gone permanently.

### Step 5 — Wiring

- [ ] `proxy.ts` at the project root for optimistic cookie-presence redirects only.
      (Next 16 renamed Middleware to Proxy.) It is **not** the authorization check — the
      real check is `verifySession()` inside each data function.
- [ ] Replace `useAccount()` with a context provider seeded from the server render, so
      `CheckoutFlow` and `AccountStep` keep working.
- [ ] Account page reads `GET /user` and `GET /orders`.

**Done when:** all three routes reach a signed-in state, `user_id` never appears in the
browser, six wrong OTPs locks out, and sign-out clears the session.

---

## Phase 4 — Payments and fulfillment (Stripe)

```
pick plan → createOrder (server re-prices) → PaymentIntent
         → customer pays → Stripe webhook → GET /new_esim → Yesim emails the QR
```

**The client never sends a price.** It sends a plan id and a quantity; the server looks
the price up again.

### Taking the payment

- [ ] Server action `createOrder({ planId, quantity })` — `verifySession()`, re-read the
      plan from the catalog, compute the total server-side, clamp quantity to `MAX_ESIMS`.
      The re-read price is `retail_price`, same as everywhere else.
- [ ] PaymentIntent with an **idempotency key** so a double-click can't charge twice. Put
      `planId`, `quantity` and `yesimUserId` in the metadata — the webhook fulfills from it.
- [ ] Return only the `client_secret` to the browser.
- [ ] Mount Stripe's Payment Element so card data never touches our DOM (PCI SAQ-A).
- [ ] Rewrite `/checkout` to take an order id, not a query-string bill of goods.
      `resolveOrder` in `lib/order.ts` is replaced.

### Fulfilling the order

- [ ] `app/api/webhooks/stripe/route.ts` — read the **raw** body, verify the signature
      with `constructEvent`, store the event id in Redis to reject replays.
- [ ] **Fulfill in the webhook, never on the browser redirect.** A customer who closes
      the tab after paying must still get their eSIM.
- [ ] Fulfillment = `GET /new_esim` with the session's `user_id` and the plan's hex `id`,
      once per purchased quantity.
- [ ] Success page polls order status, showing pending until the webhook lands.

### The failure mode that will actually bite you

Stripe can succeed while `/new_esim` fails — bad partner balance, Yesim downtime, a plan
withdrawn between browsing and paying. The customer has been charged and has nothing.

- [ ] **Check `GET /balance` before creating the PaymentIntent.** If the float can't
      cover the order, don't take the money.
- [ ] Alert when the balance drops below a threshold. A drained float fails every order
      silently until someone notices.
- [ ] Retry `/new_esim` with backoff. If it still fails: refund automatically, email the
      customer, alert yourselves.
- [ ] Log every order's state transitions so a support question has an answer.
- [ ] `POST /set_notification_url` so Yesim reports eSIM state changes.

**Done when:** a test card completes end to end and the eSIM arrives; a replayed webhook
issues nothing extra; a hand-edited price changes nothing; and a forced `/new_esim`
failure refunds instead of swallowing the money.

---

## Phase 5 — Security hardening

- [ ] CSP with a per-request nonce, set in `proxy.ts`.
- [ ] Headers: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`,
      `Permissions-Policy`.
- [ ] zod validation on every server action input.
- [ ] `serverActions.allowedOrigins` set for production.
- [ ] Rate limiting on OTP request, order creation, and webhook endpoints.
- [ ] Structured logs with no PII and no tokens. Audit that `redactToken` covers every
      path that can log a Yesim URL, including uncaught error handlers.
- [ ] **Rotate `YESIM_API_TOKEN` before launch** — the dev one has been in terminals,
      shell history, and `.next/cache`.
- [ ] `experimental.taint: true`, taint the account object.
- [ ] Document secret rotation. Confirm no secret is committed (`git log -p` scan).
- [ ] `npm audit` clean, Dependabot on.

---

## Phase 6 — Quality gates

- [ ] CI runs `typecheck`, `lint`, `build` on every PR.
- [ ] Vitest for `lib/`: money formatting, session encrypt/decrypt, and the mappers
      against `lib/api/__fixtures__/plans.json` — 1520 real plans, no network.
      Cover the traps that fixture already exposed: `data: "Unlimited"`, `old_id: null`,
      the `UNLIM_UAE_7D` / `St. Kitts` grouping, and the `japan` / `japan-region` collision.
- [ ] Playwright for the two flows that matter: browse → pick plan → checkout, and
      sign-in → pay.
- [ ] Error monitoring (Sentry or equivalent) for server and client.

---

## Phase 7 — Pre-launch

### Content and legal

- [ ] Terms of Service, Privacy Policy, cardholder-credential page written and linked
      (currently `href="#"` in `lib/auth.ts`).
- [ ] Refund and support policy published.
- [ ] **Replace `heroPlaceholder`** — every destination still shows the same Los Angeles
      photo (`lib/assets.ts`). The API carries no hero image.
- [ ] All remaining `href="#"` resolved or removed.

### SEO

- [ ] Per-page `metadata` with real titles and descriptions.
- [ ] `sitemap.ts` and `robots.ts`.
- [ ] Open Graph images. Canonical URLs.

### Infrastructure

- [ ] Production domain + TLS.
- [ ] Env vars set in the host, separate values per environment.
- [ ] Staging environment mirroring production.
- [ ] Analytics. Uptime monitoring on the site and on the Yesim API.
- [ ] **Balance alerting live before the first real order.**
- [ ] Stripe live keys, webhook endpoint registered, signing secret set.
- [ ] Backup and rollback plan.

### Final pass

- [ ] Lighthouse: performance, accessibility, SEO, best practices.
- [ ] Keyboard and screen reader pass on the dialogs and checkout.
- [ ] Real devices: iOS Safari, Android Chrome.
- [ ] Live payment smoke test with a real card, then refund it.

---

## Order of work

| Phase | Work | Est. | Blocked by |
|---|---|---|---|
| 3 | Auth (+ email provider, Redis) | 5–6 days | — |
| 4 | Payments and fulfillment | 5–6 days | Phase 3 |
| 5 | Security hardening | 2 days | Phase 4 |
| 6 | Quality gates | 1 day | — |
| 7 | Pre-launch | 2–3 days | Phase 5 |

Phase 6 needs nothing from anyone and can start immediately.
