---
name: stripe-api
description: Complete guide for integrating Stripe API, Stripe Connect, Checkout Sessions, Webhooks, Subscriptions, Payment Intents, Idempotency, and Metadata. Use when building payment flows, subscription billing, Connect marketplace accounts, payment methods, or handling Stripe webhook events.
---

# Stripe API Integration & Best Practices

This skill provides comprehensive rules, API patterns, and security best practices for integrating Stripe in web applications, serverless Edge Functions, and frontend applications.

---

## When to use this skill

Activate this skill when:
- Creating or updating Stripe payment flows (Checkout Sessions, PaymentIntents, SetupIntents).
- Managing customer billing subscriptions, add-ons, plan upgrades, or invoices.
- Setting up or troubleshooting Stripe Webhooks (`/supabase/functions/stripe-webhook`).
- Configuring Stripe Connect accounts for multi-tenant payouts or reseller commissions.
- Handling payment errors, card declines, or idempotency keys.

---

## 1. Authentication & API Security

1. **Key Types**:
   - **Publishable Key** (`pk_live_...` or `pk_test_...`): Used only in frontend client applications (`@stripe/stripe-js`). Safe to expose publicly.
   - **Secret Key** (`sk_live_...` or `sk_test_...`): Used strictly in server-side edge functions / backends. **NEVER expose secret keys in client-side code**.
   - **Restricted Keys** (`rk_live_...`): Preferred in production with scoped permissions for specific resources (e.g. `invoices:write`, `customers:read`).
   - **Webhook Signing Secret** (`whsec_...`): Used to verify the signature of incoming webhooks from Stripe.

2. **Environment Configuration**:
   - Always load secret keys from environment variables: `Deno.env.get("STRIPE_SECRET_KEY")` or `process.env.STRIPE_SECRET_KEY`.

---

## 2. Idempotency & Safety Guidelines

1. **Idempotency Keys**:
   - For all mutating operations (creating charges, customers, subscriptions, refunds), pass an `idempotency_key` header:
     ```ts
     const customer = await stripe.customers.create(
       { email, metadata: { tenant_id } },
       { idempotencyKey: `create-cust-${tenantId}-${Date.now()}` }
     );
     ```
   - Prevents duplicate billing charges during network timeouts or retry loops.

2. **Race Condition Prevention**:
   - Webhooks are asynchronous and may arrive out-of-order.
   - Always check current database status before applying state changes from webhooks.
   - Store `stripe_event_id` in a processed events ledger to prevent processing the same webhook twice.

---

## 3. Core Stripe Resources & Workflows

### A. Customers & Payment Methods
- Map internal `tenant_id` or `user_id` inside Stripe `metadata`:
  ```ts
  metadata: {
    tenant_id: tenantId,
    app_environment: "production",
  }
  ```
- Store `stripe_customer_id` and `stripe_subscription_id` in the local `subscriptions` database table.

### B. Checkout Sessions & Subscriptions
- Use **Stripe Checkout Sessions** for hosted, PCI-compliant checkout experiences:
  ```ts
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/owner/billing?success=true`,
    cancel_url: `${origin}/owner/billing?cancelled=true`,
    metadata: { tenant_id: tenantId, plan_slug: planSlug },
  });
  ```

### C. Webhooks (`stripe-webhook`)
- Verify signature before processing payload:
  ```ts
  const signature = req.headers.get("stripe-signature");
  const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  ```
- Handle key events:
  - `checkout.session.completed`: Activate subscription, record initial invoice.
  - `customer.subscription.updated`: Update plan limits and active status.
  - `customer.subscription.deleted`: Update subscription status to `cancelled`.
  - `invoice.paid`: Create HMRC-compliant tax invoice record in `invoices` table.
  - `invoice.payment_failed`: Mark subscription `past_due` and trigger tenant notification.

---

## 4. Error Handling & HTTP Statuses

| Error Type | Description | Handling Strategy |
| :--- | :--- | :--- |
| `card_error` | Card declined, insufficient funds, expired. | Display human-readable `err.message` near form fields. |
| `invalid_request_error` | Missing parameter, invalid ID. | Log payload server-side; check request parameters. |
| `idempotency_error` | Key re-used with different payload. | Generate fresh UUID for idempotency key. |
| `api_error` | Stripe server error (rare). | Retry with exponential backoff. |

---

## 5. Stripe Connect & Marketplace Payouts

- Use **Stripe Connect Custom/Express** for platform-to-merchant payouts.
- Pass `Stripe-Account: acct_...` header when issuing API calls on behalf of a connected restaurant:
  ```ts
  const accountCharge = await stripe.charges.retrieve(
    chargeId,
    {},
    { stripeAccount: connectedAccountId }
  );
  ```

---

## 6. Verification & Checklist

Before deploying any Stripe integration code:
- [ ] Confirm secret keys are stored in secure environment variables.
- [ ] Ensure all webhook endpoints verify the `stripe-signature` header.
- [ ] Verify `metadata: { tenant_id }` is attached to all customers, sessions, and charges.
- [ ] Confirm idempotency keys are passed on charge/subscription creation.
- [ ] Verify error handlers present user-friendly messages for card declines.
