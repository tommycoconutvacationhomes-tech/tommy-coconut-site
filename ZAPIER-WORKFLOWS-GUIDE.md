# Zapier Automation Workflows
## Tommy Coconut - Complete Setup Guide

---

## Overview: 5 Core Workflows

1. **Lead Capture Flow** - Website → Airtable → Mailchimp → Slack
2. **Booking Confirmation** - CXPay → Airtable → Email → Calendar
3. **Review Collection** - Schedule → Email → Google/TrustPilot
4. **Guest Journey Automation** - Multi-step pre/during/post-stay
5. **Operations Hub** - Team notifications & task management

---

## Workflow 1: Lead Capture Flow
### **Goal:** Capture every website inquiry and distribute to all systems

### Trigger:
- **App:** Webhooks by Zapier
- **Event:** Catch Hook
- **Setup:** Copy webhook URL to your website forms

### Actions:

**Step 1: Create Record in Airtable**
- **App:** Airtable
- **Action:** Create Record
- **Table:** Leads
- **Fields:**
  - Name: `{{name}}`
  - Email: `{{email}}`
  - Phone: `{{phone}}`
  - Status: `New`
  - Source: `{{source}}` or `Website`
  - Notes: `Full form data: {{all_fields}}`
  - Date Added: `{{zap_meta_timestamp}}`

**Step 2: Add/Update Subscriber in Mailchimp**
- **App:** Mailchimp
- **Action:** Add/Update Subscriber
- **Audience:** Tommy Coconut Main List
- **Email:** `{{email}}`
- **First Name:** `{{name_first}}` (use Formatter to split)
- **Last Name:** `{{name_last}}`
- **Tags:** `Website, {{source}}, {{property_interest}}`
- **Status:** Subscribed
- **Merge Fields:**
  - PHONE: `{{phone}}`
  - TRVLDATES: `{{travel_dates}}`
  - GRPSIZE: `{{group_size}}`

**Step 3: Send Notification to Slack**
- **App:** Slack
- **Action:** Send Channel Message
- **Channel:** #new-leads
- **Message:**
```
🎯 NEW LEAD ALERT!

👤 Name: {{name}}
📧 Email: {{email}}
📱 Phone: {{phone}}
🏖️ Interest: {{property_interest}}
📅 Dates: {{travel_dates}}
👥 Group: {{group_size}}
💰 Budget: {{budget_range}}

🔗 View in Airtable: {{airtable_record_url}}
```

**Step 4 (Optional): Create Google Calendar Reminder**
- **App:** Google Calendar
- **Action:** Create Detailed Event
- **Calendar:** Team Follow-ups
- **Event Name:** Follow up: `{{name}}`
- **Start Date:** Tomorrow at 10 AM
- **Description:** Lead details and Airtable link

---

## Workflow 2: Booking Confirmation Flow
### **Goal:** Automate everything after payment is received

### Trigger:
- **App:** CXPay (via Webhook)
- **Event:** Successful Payment
- **Note:** You'll need CXPay webhook URL

### Actions:

**Step 1: Find/Update Airtable Record**
- **App:** Airtable
- **Action:** Find Record (by Email)
- **Then:** Update Record
- **Fields:**
  - Status: `Payment Received`
  - Payment Amount: `{{amount}}`
  - Payment Date: `{{payment_date}}`
  - Payment ID: `{{transaction_id}}`

**Step 2: Send Confirmation Email via Mailchimp**
- **App:** Mailchimp
- **Action:** Add Subscriber to Tag
- **Tag:** `Guest - Paid Deposit`
- **This triggers:** Mailchimp automation for booking confirmation

**Alternative Step 2: Send Email via Gmail**
- **App:** Gmail
- **Action:** Send Email
- **To:** `{{email}}`
- **Subject:** Your Tommy Coconut Booking is Confirmed! 🎉
- **Body:** [See email template below]

**Step 3: Create Google Calendar Event**
- **App:** Google Calendar
- **Action:** Create Detailed Event
- **Calendar:** Guest Reservations
- **Event Name:** `{{guest_name}} - {{villa_name}}`
- **Start Date:** `{{checkin_date}}`
- **End Date:** `{{checkout_date}}`
- **Description:** Full booking details + Airtable link
- **Guests:** `{{guest_email}}`

**Step 4: Notify Team**
- **App:** Slack
- **Action:** Send Channel Message
- **Channel:** #bookings
- **Message:**
```
💰 BOOKING CONFIRMED!

Guest: {{name}}
Villa: {{villa_name}}
Dates: {{checkin}} to {{checkout}}
Amount: ${{amount}}

✅ Confirmation sent
✅ Calendar updated
✅ Airtable synced

🔗 Manage booking: {{airtable_url}}
```

---

## Workflow 3: Review Collection Automation
### **Goal:** Systematically collect reviews from every guest

### Trigger:
- **App:** Airtable
- **Event:** New Record in View
- **View:** "Checked Out - No Review" (you create this)
- **Filter:** Checkout date is 2 days ago

### Actions:

**Step 1: Check if Review Already Received**
- **App:** Airtable
- **Action:** Find Record
- **Search Field:** Email
- **Condition:** If "Review Received" field is empty, continue

**Step 2: Send Review Request via Email**
- **App:** Gmail or Mailchimp
- **Action:** Send Email
- **To:** `{{guest_email}}`
- **Subject:** Quick favor? Share your {{villa_name}} experience 🙏
- **Body:** [See email template in Mailchimp guide]

**Step 3: Add Mailchimp Tag**
- **App:** Mailchimp
- **Action:** Add Subscriber to Tag
- **Tag:** `Review - Requested`

**Step 4: Create Follow-up Task**
- **App:** Airtable
- **Action:** Create Record
- **Table:** Tasks
- **Fields:**
  - Task: `Follow up on review - {{guest_name}}`
  - Due Date: 5 days from now
  - Assigned To: Boy
  - Status: Pending

---

## Workflow 4: Guest Journey Automation
### **Goal:** Touchpoints throughout the entire stay

### Trigger:
- **App:** Schedule by Zapier
- **Event:** Every Day at 9:00 AM

### Path A: Pre-Arrival (7 days before checkin)

**Filter:**
- Check Airtable for guests with checkin date = 7 days from now
- Status = "Confirmed"

**Actions:**
1. Send pre-arrival email (packing list, arrival instructions)
2. Add tag in Mailchimp: `Guest - Pre-Arrival`
3. Create task in Airtable: "Prepare villa for {{guest_name}}"

### Path B: Day-Of Checkin

**Filter:**
- Checkin date = today

**Actions:**
1. Send welcome SMS/WhatsApp (villa code, contact info)
2. Notify property manager via Slack
3. Update Airtable status: "Currently Staying"

### Path C: Mid-Stay Check-in (Day 2 of stay)

**Filter:**
- Currently staying
- Checkin was 2 days ago

**Actions:**
1. Send "how's it going?" email
2. Offer concierge assistance
3. Log touchpoint in Airtable

### Path D: Pre-Checkout (1 day before)

**Filter:**
- Checkout date = tomorrow

**Actions:**
1. Send checkout instructions email
2. Request final balance if outstanding
3. Create cleaning task in Airtable

### Path E: Post-Checkout (Day of)

**Filter:**
- Checkout date = today

**Actions:**
1. Update Airtable status: "Checked Out"
2. Add to "Review Request" queue
3. Remove from "Currently Staying" tag

---

## Workflow 5: Operations Hub
### **Goal:** Team coordination and task management

### Trigger A: New Booking
- Notify all stakeholders
- Create cleaning schedule
- Assign concierge

### Trigger B: Guest Question/Request
- From: Contact form, WhatsApp, email
- To: Right team member via Slack
- Log in Airtable for tracking

### Trigger C: Maintenance Issue
- Create urgent task
- Notify maintenance team
- Track resolution time

---

## Zapier Setup Instructions

### Step 1: Connect Your Apps

1. Log into Zapier
2. Go to "My Apps"
3. Connect:
   - [ ] Airtable (Personal Access Token)
   - [ ] Mailchimp (OAuth)
   - [ ] Slack (OAuth)
   - [ ] Gmail (OAuth)
   - [ ] Google Calendar (OAuth)
   - [ ] CXPay (API Key or Webhook)

### Step 2: Import Workflows

1. For each workflow above:
   - Click "Create Zap"
   - Set up trigger as described
   - Add actions step by step
   - Test each step
   - Turn on when working

2. Naming convention:
   - `TC - Lead Capture Flow`
   - `TC - Booking Confirmation`
   - `TC - Review Collection`
   - `TC - Guest Journey`
   - `TC - Operations Hub`

### Step 3: Test Thoroughly

**Test Checklist:**
- [ ] Submit test lead through website
- [ ] Verify all systems receive data
- [ ] Check email deliverability
- [ ] Confirm Slack notifications work
- [ ] Test with real email addresses
- [ ] Verify Airtable updates correctly

### Step 4: Monitor & Optimize

**First Week:**
- Check Zap history daily
- Look for failed steps
- Adjust filters as needed
- Get team feedback

**Ongoing:**
- Review Zap task usage monthly
- Look for bottlenecks
- Add new automations as needed

---

## Webhook URLs You'll Need

### For Website Forms:
```
https://hooks.zapier.com/hooks/catch/YOUR_ID_HERE/WEBHOOK_1/
```

Add this to your website form submission code.

### For CXPay:
```
https://hooks.zapier.com/hooks/catch/YOUR_ID_HERE/WEBHOOK_2/
```

Give this to CXPay to send payment notifications.

---

## Email Templates

### Booking Confirmation Email

**Subject:** Your Tommy Coconut Booking is Confirmed! 🎉

**Body:**
```
Hi {{first_name}},

Great news—your booking is confirmed!

📍 Villa: {{villa_name}}
📅 Check-in: {{checkin_date}} at 3:00 PM
📅 Check-out: {{checkout_date}} by 11:00 AM
💰 Paid: ${{deposit_amount}}
💰 Balance Due: ${{balance_amount}} (due {{balance_due_date}})

WHAT HAPPENS NEXT:

✅ We've received your deposit
✅ Your villa is reserved
✅ You'll get arrival instructions 7 days before checkin
✅ Our concierge will reach out to plan your boat trip

HAVE QUESTIONS?

Just hit reply—this email goes straight to our team.

Or text/call us: [Your WhatsApp Number]

Can't wait to welcome you to the Dushi Life!

Dushi,
Boy "Little Boss"
Tommy Coconut Private Resorts

---

P.S. Want to add anything special? Let us know:
- Restaurant reservations
- Grocery pre-stocking
- Special occasion surprises
- Custom experiences

We've got you covered. 🛡️
```

---

## Advanced: Multi-Step Zap Filters

### Example: Route Leads by Budget

**Path 1: Premium Leads** (Budget > $5,000)
- Send to: sales@tommycoconut.com
- Notify: Slack #premium-leads
- Priority: High

**Path 2: Standard Leads** (Budget $3,000-$5,000)
- Send to: Regular inquiry queue
- Notify: Slack #leads
- Priority: Normal

**Path 3: Budget Leads** (Budget < $3,000)
- Send automated email: "Here are our best value options"
- Add to: Nurture sequence
- Priority: Low

---

## Zapier Plan Recommendations

**Starter Plan ($19.99/mo):**
- 750 tasks/month
- Good for: Just starting out

**Professional Plan ($49/mo):**
- 2,000 tasks/month
- Multi-step Zaps
- Good for: Full automation setup

**Team Plan ($299/mo):**
- 50,000 tasks/month
- Unlimited users
- Good for: High volume business

### Task Estimation:
- Each form submission = 4-5 tasks (Airtable + Mailchimp + Slack + Calendar)
- With 50 leads/month = ~250 tasks
- Add booking confirmations, reviews, etc. = ~500-750 tasks/month

**Recommendation:** Start with Professional plan

---

## Troubleshooting Common Issues

### Issue 1: Zap Not Triggering
- Check if trigger app has new data
- Verify webhook URL is correct
- Test trigger manually

### Issue 2: Action Failing
- Check API permissions
- Verify required fields are populated
- Review error logs in Zap history

### Issue 3: Data Mapping Wrong
- Use Formatter to transform data
- Check field names match exactly
- Test with sample data first

---

## Next Steps After Setup

1. **Week 1:** Monitor all Zaps daily
2. **Week 2:** Collect team feedback
3. **Week 3:** Add conditional paths
4. **Week 4:** Build reporting dashboard
5. **Month 2:** Add advanced automations (SMS, WhatsApp, etc.)

---

**Ready to build?**

Start with Workflow #1 (Lead Capture), get it working perfectly, then add the others one by one.

Questions? Check Zapier's help docs or contact support.

