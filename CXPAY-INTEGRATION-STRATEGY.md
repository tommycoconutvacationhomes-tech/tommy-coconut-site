# CXPay Payment Integration Strategy
## Tommy Coconut Vacation Rentals

---

## Executive Summary

**Goal:** Enable direct bookings with seamless payment processing on your website

**Current State:** Using CXPay for payments (Caribbean-focused payment processor)

**Recommended Approach:** Phased implementation starting with payment links, progressing to full API integration

---

## Phase 1: Simple Payment Links (Immediate - Week 1)

### Implementation: Add "Pay Deposit" Buttons

**What This Looks Like:**
```html
<a href="https://cxpay.com/pay/tommy-coconut/{{villa-id}}"
   class="btn btn-primary">
   Pay Deposit - Book Now
</a>
```

**Pros:**
- ✅ Can implement in 1 day
- ✅ No API integration needed
- ✅ CXPay handles all payment security
- ✅ Works immediately

**Cons:**
- ❌ Takes user off your site
- ❌ Manual confirmation process
- ❌ No automatic Airtable updates

**Best For:**
- Getting started quickly
- Testing payment flow
- Low booking volume

---

## Phase 2: Embedded Payment Widget (Intermediate - Week 2-3)

### Implementation: CXPay iFrame Integration

**What This Looks Like:**
- Payment form embedded directly on villa pages
- User stays on your site
- Better user experience

**Code Example:**
```html
<div id="cxpay-widget"></div>
<script src="https://cxpay.com/widget.js"></script>
<script>
CXPay.init({
  merchantId: 'your-merchant-id',
  amount: '500.00',
  currency: 'USD',
  description: 'Villa Happy Hideaway - Deposit',
  onSuccess: function(payment) {
    // Send to your webhook
    fetch('/.netlify/functions/payment-success', {
      method: 'POST',
      body: JSON.stringify(payment)
    });
  }
});
</script>
```

**Pros:**
- ✅ User stays on your site
- ✅ Better conversion rates
- ✅ Can trigger automations
- ✅ Still secure (CXPay handles card data)

**Cons:**
- ❌ Requires some JavaScript
- ❌ Need CXPay widget documentation
- ❌ Limited customization

**Best For:**
- Professional booking experience
- Moderate booking volume
- Growing business

---

## Phase 3: Full API Integration (Advanced - Week 4+)

### Implementation: Complete Payment Processing System

**Features:**
1. **Deposit Processing**
   - Take 50% deposit on booking
   - Store payment method for balance
   - Automatic receipt generation

2. **Balance Payment**
   - Automatic reminders 30/15/7 days before
   - One-click balance payment
   - Failed payment retry logic

3. **Payment Plans**
   - Split into multiple payments
   - Auto-charge on schedule
   - Update Airtable at each step

4. **Refunds & Cancellations**
   - Automatic refund processing
   - Partial refunds for cancellations
   - Track refund status

**Architecture:**
```
Website Form
    ↓
Netlify Function (payment-intent)
    ↓
CXPay API (create payment)
    ↓
User Pays
    ↓
CXPay Webhook → Netlify Function
    ↓
├─ Update Airtable
├─ Send Confirmation Email (Mailchimp)
├─ Trigger Zapier Workflows
└─ Update Website Status
```

**Code Structure:**
```
/netlify/functions/
├─ create-payment-intent.js    // Initialize payment
├─ process-payment.js           // Handle payment webhook
├─ payment-status.js            // Check payment status
├─ process-refund.js            // Handle refunds
└─ send-payment-receipt.js      // Email receipts
```

**Pros:**
- ✅ Complete control over UX
- ✅ Fully automated workflow
- ✅ Custom payment flows
- ✅ Professional experience
- ✅ Detailed analytics

**Cons:**
- ❌ Development time (2-4 weeks)
- ❌ Requires CXPay API access
- ❌ Need to handle edge cases
- ❌ Ongoing maintenance

**Best For:**
- High booking volume
- Custom payment requirements
- Scaling business

---

## Recommended Approach for Tommy Coconut

### Timeline & Decision Tree

```
WEEK 1: Research & Simple Links
├─ Get CXPay API documentation
├─ Understand webhook capabilities
├─ Implement simple payment links
└─ Test with real booking

WEEK 2-3: Widget Implementation
├─ Embed CXPay widget on villa pages
├─ Connect to Airtable via webhook
├─ Trigger Mailchimp confirmations
└─ Monitor and refine

WEEK 4+: Full API (if needed)
├─ Build payment intent system
├─ Implement deposit + balance flow
├─ Add payment reminders
└─ Polish UX
```

---

## What I Need From You to Proceed

### Option A: Simple Links (Can Do Now)
- [ ] CXPay payment page URLs for each villa
- [ ] Preferred deposit amounts
- [ ] Confirmation email template

### Option B: Widget Integration (Preferred)
- [ ] CXPay Merchant ID
- [ ] Widget integration documentation
- [ ] API keys for testing
- [ ] Webhook endpoint access

### Option C: Full API
- [ ] Complete CXPay API documentation
- [ ] API credentials (sandbox + production)
- [ ] Webhook authentication details
- [ ] Payment flow requirements document

---

## CXPay Integration Checklist

### Discovery Questions:

1. **What payment methods does CXPay support?**
   - Credit/Debit cards?
   - Bank transfers?
   - Local Caribbean payment methods?

2. **Does CXPay have webhooks?**
   - Can they send payment notifications to our server?
   - What events do they trigger on? (success, failure, refund)
   - How do we verify webhook authenticity?

3. **What's the fee structure?**
   - Per-transaction fees?
   - Monthly fees?
   - Chargeback fees?

4. **Do they have a sandbox/test environment?**
   - Can we test without real money?
   - Test API credentials available?

5. **What's their documentation like?**
   - Do they have a developer portal?
   - Code examples?
   - Support team?

6. **Currency support?**
   - USD only?
   - EUR, CAD, ANG (Antillean Guilder)?
   - Exchange rate handling?

7. **Refund capabilities?**
   - Full and partial refunds?
   - How long does processing take?
   - Automatic or manual?

---

## Payment Flow Design

### User Journey: Booking Happy Hideaway

```
Step 1: User Views Villa Page
├─ Sees pricing: $1,200/night, 7 nights = $8,400
├─ Clicks "Check Availability"
└─ Fills out dates and guest count

Step 2: Booking Form
├─ Personal information
├─ Special requests
├─ Payment breakdown shown:
│   ├─ 7 nights × $1,200 = $8,400
│   ├─ Cleaning fee: $150
│   ├─ Total: $8,550
│   ├─ Deposit (50%): $4,275
│   └─ Balance due 30 days before: $4,275
└─ User clicks "Proceed to Payment"

Step 3: Payment (CXPay Widget)
├─ Enter card details (handled by CXPay)
├─ Submit payment
└─ Wait for confirmation...

Step 4: Success!
├─ Confirmation page shows: ✅
├─ Email confirmation sent automatically
├─ Airtable updated
├─ Mailchimp sequence triggered
└─ Zapier notifies team

Step 5: Balance Payment (30 days before)
├─ Automatic reminder email sent
├─ One-click payment link
├─ Same smooth process
└─ Final confirmation sent
```

---

## Code I Can Provide (Once I Have CXPay Details)

### 1. Payment Button Component
```html
<!-- Add to villa pages -->
<div class="booking-cta">
  <div class="price-breakdown">
    <p>Total: $8,550</p>
    <p>Deposit Today (50%): $4,275</p>
    <p>Balance Due (30 days before): $4,275</p>
  </div>
  <button onclick="initCXPayPayment()" class="btn-concierge-primary">
    Secure Your Booking - Pay Deposit
  </button>
</div>
```

### 2. Netlify Function: Payment Webhook Handler
```javascript
// netlify/functions/cxpay-webhook.js
exports.handler = async (event) => {
  const payment = JSON.parse(event.body);

  // 1. Verify webhook signature
  // 2. Update Airtable
  // 3. Trigger Mailchimp
  // 4. Send confirmation

  return { statusCode: 200 };
};
```

### 3. Payment Status Tracker
```javascript
// Check if payment completed
// Update booking status in real-time
// Handle failed payments
```

---

## Security Considerations

### PCI Compliance:
- ✅ CXPay handles all card data (we never touch it)
- ✅ No card numbers stored on our server
- ✅ Webhooks verified with signatures
- ✅ HTTPS only for all transactions

### Data Protection:
- Store only: transaction ID, amount, status
- Never store: full card numbers, CVV, PIN
- Encrypt: customer payment records
- Log: all payment attempts for auditing

---

## Testing Strategy

### Phase 1: Sandbox Testing
1. Create test bookings
2. Use CXPay test cards
3. Verify webhook delivery
4. Check Airtable updates
5. Confirm email sending

### Phase 2: Real-Money Test
1. Small transaction ($1)
2. Full refund immediately
3. Verify all systems work
4. Check fees charged

### Phase 3: Beta Launch
1. One real booking
2. Monitor closely
3. Get user feedback
4. Refine UX

### Phase 4: Full Launch
1. Enable on all villa pages
2. Monitor daily
3. Have support ready
4. Track conversion rates

---

## Next Steps

### Immediate Actions:

1. **Contact CXPay:**
   - Request API documentation
   - Ask about webhook capabilities
   - Get sandbox access
   - Clarify integration options

2. **Gather Requirements:**
   - What payment flow do you want?
   - Deposit percentage?
   - Balance payment timing?
   - Refund policy?

3. **Choose Implementation:**
   - Simple links (fast)
   - Widget embed (recommended)
   - Full API (long-term)

### Once I Have Info:

1. **I'll build:**
   - Payment integration code
   - Webhook handlers
   - Confirmation system
   - Testing suite

2. **You'll provide:**
   - CXPay credentials
   - Test environment access
   - Approval for go-live

3. **We'll test:**
   - Sandbox payments
   - Real-world scenarios
   - Edge cases
   - User experience

---

## Questions for CXPay

**Email this to your CXPay account manager:**

```
Subject: API Integration - Tommy Coconut Vacation Rentals

Hi [Account Manager],

We're looking to integrate CXPay payments directly into our website.

Could you provide:

1. API Documentation (REST API, webhooks)
2. Sandbox/test environment credentials
3. Widget integration guide (if available)
4. Webhook event list and authentication method
5. Code examples (JavaScript/Node.js preferred)
6. Multi-currency support details
7. Refund API capabilities

Our use case:
- Vacation rental bookings
- Deposit (50%) + Balance (30 days before) structure
- Automatic confirmations and receipts
- Integration with Airtable and Mailchimp

Timeline: Aiming to launch within 2-4 weeks

Thanks!
[Your Name]
Tommy Coconut Private Resorts
```

---

## Estimated Costs

**Development Time:**
- Simple Links: 4 hours
- Widget Integration: 20 hours
- Full API: 40-60 hours

**Transaction Fees:**
- CXPay fees: [Ask them]
- Our estimate: 2.5-3.5% per transaction

**Monthly Costs:**
- CXPay account: $[Ask them]
- Netlify Functions: $0 (within free tier)
- Testing: $50-100 in test transactions

---

**Ready to move forward?**

Get me the CXPay documentation and credentials, and I'll build the integration you need.

