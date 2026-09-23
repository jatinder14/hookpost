# Reply to Razorpay — ticket 21027315

**Status:** they marked it resolved on 20 Sep. Replying reopens it, which is what we want.
**Send from:** jatinder1901243@gmail.com, in the existing thread so the ticket number stays attached.

---

## Verified against the live Razorpay API on 2026-09-22

Do not send numbers that have not been re-checked here — an earlier version of
this draft said "ten subscriptions across four separate people", and four of
those ten are our own email addresses. Razorpay can see that, and it would have
cost us the argument.

| | INR | USD |
|---|---|---|
| Subscriptions created | 83 | 10 |
| Ever reached `active` | 2 | **0** |
| `paid_count > 0` | 2 | **0** |

The ten USD subscriptions break down as:

- **4 our own accounts** — `jatinder.mahajan@certifyos.com` (3), `jatinder1901243@gmail.com` (1)
- **3 with no customer record attached at all** — all cancelled
- **2** `joanccarrero@gmail.com` — created in the *same minute*, 12 Sep 07:43
- **1** `talha.sayyed1997@gmail.com` — 17 Sep, still `created`

So there are **two genuine external prospects**, not ten customers. Say so
plainly: our own failed attempts are better evidence than a padded count,
because we can describe exactly what we saw.

---

## Draft reply

> Subject: Re: [Merchant] International activation — ticket 21027315
>
> Thank you — the confirmation that international subscription mandates are
> enabled, with all major networks and no non-3DS restriction, closes the
> account-configuration question.
>
> We would like to reopen this with a narrower one, because the explanation for
> the expiry does not fit what we can see.
>
> **The same code path completes in INR and has never once completed in USD.**
>
> Our checkout uses Checkout.js and passes `subscription_id` — the standard
> mandate authentication flow. Against your API as of today:
>
> - INR: 83 subscriptions created, 2 reached `active`, 2 collected payment.
> - USD: 10 subscriptions created, **0 ever reached `active`, 0 collected payment.**
>
> I want to be straightforward about the size of that second number rather than
> have you find it yourselves: four of those ten USD subscriptions are our own
> accounts, three have no customer record attached, and only two are genuine
> external prospects. So this is not ten disappointed customers.
>
> It is something better for diagnosis. **We attempted it ourselves, on our own
> account, with the same code that works in INR, and it failed in exactly the
> same way.** Ten out of ten ending in `created` or `expired`, with our own
> attempts among them, is not customers changing their minds.
>
> **On the timeline you gave for `sub_Tb2zBD2ngEpvgW`:**
>
> You reported it was created 12 Sep, reached its charge date 19 Sep at 13:13,
> and expired at 13:18 — a five-minute window — because the customer did not
> authenticate.
>
> The customer was present on **12 September**, not 19 September. They completed
> our checkout that day; that is when the subscription was created and when
> Checkout.js was opened for them. Nobody was going to be at a browser at 13:13
> on 19 September.
>
> Our questions:
>
> 1. For `sub_Tb2zBD2ngEpvgW` and `sub_Tb2z7nzI8jznw0` (same customer,
>    `joanccarrero@gmail.com`, both created 12 Sep 07:43), **was the Checkout
>    modal ever loaded on your side on 12 September**, and if so, what payment
>    methods were rendered to a customer with a non-Indian card?
> 2. If it loaded and offered no usable method, that is the answer — and we need
>    to know which methods a USD subscription should offer.
> 3. **When is an international customer expected to authenticate a USD
>    subscription mandate — at creation, or at first charge?** If at creation,
>    why did this one sit seven days in `created` before expiring? If at first
>    charge, how is a customer meant to be present for a five-minute window a
>    week later?
> 4. Does `subscription_id` behave differently in Checkout.js when the plan
>    currency is USD rather than INR?
> 5. Separately: three of our USD subscriptions have **no customer record
>    attached** (`sub_TaiNGMLdVoEAZg`, `sub_TaiXHHMymHOBt8`,
>    `sub_Te9namKVpBI214`). Is that expected for a subscription that never
>    authenticated?
>
> **What would settle this fastest:** tell us what your logs show the customer
> was actually shown on 12 September for either of those two subscription ids.
> We have the client-side code and it is identical for both currencies.
>
> Merchant: JR Consulting Co.
> Ticket: 21027315

---

## What to fix on our side regardless of their answer

**Duplicate mandates in the same minute — ours, and it happened twice.**
`joanccarrero@gmail.com` (12 Sep 07:43) and `jatinder.mahajan@certifyos.com`
(11 Sep 16:57) each produced two subscriptions in the same minute: the user
toggled MONTHLY/YEARLY and we issued a second mandate instead of replacing the
first. `retireSupersededSubscriptions` exists for this in `razorpay.service.ts`
but only runs from the **activation webhook** — which never fires for these,
because they never authenticate. So the cleanup never runs for exactly the
subscriptions that need it.

**A USD payment has still never been tested end to end.** Every claim on both
sides is inference until a real card issued outside India goes through the live
checkout once. Worth asking `talha.sayyed1997@gmail.com` or
`joanccarrero@gmail.com` whether they will retry while we watch the logs.
