# Reply to Razorpay — ticket 21027315

**Status:** they marked it resolved on 20 Sep. Replying reopens it, which is what we want.
**Send from:** jatinder1901243@gmail.com, replying in the existing thread so the ticket number stays attached.

---

## Before sending — two corrections to what we already told them

1. **`sub_Td8l8VFC0zNkhM` is our own test account**, not a customer
   (`jatinder.mahajan@certifyos.com`). We listed it as evidence. Better to drop it
   from the argument than have them find it.
2. **`sub_Tb2zBD2ngEpvgW` and `sub_Tb2z7nzI8jznw0` are the same person**
   (`joanccarrero@gmail.com`), created in the **same minute** on 12 Sep — one
   MONTHLY, one YEARLY. So the "9 subscriptions" number overstates the number of
   distinct customers. Their answer only addressed one of these two.

---

## Draft reply

> Subject: Re: [Merchant] International activation — ticket 21027315
>
> Thank you — the confirmation that international subscription mandates are enabled,
> with all major networks and no non-3DS restriction, is what we needed on the
> account-configuration question. That part is closed.
>
> The explanation for the expiry is not yet consistent with what we can see, so we
> would like to reopen this with a narrower question.
>
> **The same code path works in INR and has never once worked in USD.**
>
> Our checkout uses Checkout.js and passes `subscription_id` — the standard mandate
> authentication flow. On this account that exact flow has authenticated INR
> subscriptions and collected payment against them. In USD it has produced **ten
> subscriptions and zero authentications**. Not one has ever reached
> `authenticated`, across four separate people and three weeks.
>
> Ten out of ten is not customers changing their minds. Something differs between
> the INR and the USD path, and we cannot see it from our side.
>
> **On the timeline you gave for `sub_Tb2zBD2ngEpvgW`:**
>
> You reported the subscription was created on 12 Sep, reached its charge date on
> 19 Sep at 13:13, and expired at 13:18 — a five-minute window — because the
> customer did not authenticate.
>
> The customer was present on **12 September**, not on 19 September. They completed
> our checkout that day; that is when the subscription was created and when
> Checkout.js was opened for them. Nobody was going to be sitting at a browser at
> 13:13 on 19 September.
>
> So the questions are:
>
> 1. For `sub_Tb2zBD2ngEpvgW` and `sub_Tb2z7nzI8jznw0` (same customer,
>    `joanccarrero@gmail.com`, both created 12 Sep 07:43), **was the Checkout modal
>    ever loaded on your side on 12 September**, and if so, what payment methods
>    were rendered to a customer with a non-Indian card?
> 2. If the modal loaded and offered no usable method, that is the answer and we
>    need to know which methods a USD subscription should offer.
> 3. **When is an international customer expected to authenticate a USD subscription
>    mandate — at creation, or at first charge?** If at creation, why did this one
>    survive seven days in `created` before expiring? If at first charge, how is a
>    customer meant to be present for a five-minute window a week later?
> 4. Is there anything different about how `subscription_id` behaves in Checkout.js
>    when the plan currency is USD rather than INR?
>
> **What would settle this fastest:** if you can tell us what your logs show the
> customer was actually shown on 12 September for either of those two subscription
> ids, we can stop guessing. We have the client-side code and it is identical for
> both currencies.
>
> Merchant: JR Consulting Co. · Live key id: rzp_live_… (dashboard se copy karna)
> Ticket: 21027315

---

## What to do on our side regardless of their answer

**Two subscriptions in the same minute for one org is ours to fix.**
`joanccarrero@gmail.com` created a MONTHLY and a YEARLY in the same minute — they
toggled the period and we issued a second mandate instead of replacing the first.
`retireSupersededSubscriptions` already exists for this in `razorpay.service.ts`,
but it only runs from the **activation webhook** — which never fires, because these
never authenticate. So the cleanup never happens for exactly the subscriptions that
need it.

**A USD payment has still never been tested end to end by us.** Every claim on both
sides is currently inference. The one thing that would settle it is a real card
issued outside India going through the live checkout once. That is not something I
can do for you — it needs a real foreign card — but it is worth asking one of the
overseas signups whether they are willing to try while we watch the logs.
