# Mailchimp Integration Setup Guide
## Tommy Coconut Vacation Rentals

---

## Phase 1: Mailchimp Configuration

### Step 1: Get Your Mailchimp API Credentials

1. **Log into Mailchimp** → Go to Account → Extras → API Keys
2. **Create a new API key** (or use existing)
3. **Note your server prefix** - it's in your Mailchimp account URL
   - Example: If your URL is `https://us21.admin.mailchimp.com/`, your prefix is `us21`

4. **Get your Audience ID**:
   - Go to Audience → All contacts → Settings → Audience name and defaults
   - Copy the "Audience ID" (looks like: `a1b2c3d4e5`)

### Step 2: Add Environment Variables to Netlify

1. Go to **Netlify Dashboard** → Your Site → Site settings → Environment variables
2. Add these variables:

```
MAILCHIMP_API_KEY = your_api_key_here
MAILCHIMP_SERVER_PREFIX = us21 (or your prefix)
MAILCHIMP_AUDIENCE_ID = your_audience_id_here
```

3. **Redeploy** your site after adding variables

---

## Phase 2: Mailchimp Audience Setup

### Create Segments for Automation

1. **Go to Audience → Manage Audience → Segments**
2. Create these segments:

#### Segment 1: Website Leads
- Condition: Tag = "Website"
- Use for: Welcome sequence

#### Segment 2: Hot Leads
- Condition: Tag = "Hot Lead"
- Use for: Priority follow-up

#### Segment 3: Property-Specific Interests
- Condition: Tag starts with "Interest:"
- Use for: Property-specific campaigns

#### Segment 4: Research Phase
- Condition: Tag = "Research Phase"
- Use for: Educational nurture sequence

---

## Phase 3: Email Sequence Templates

### Sequence 1: Welcome Series (Treasure Map Funnel)

**Email 1: Immediate Welcome** (Trigger: Form submission)

**Subject:** Your Tommy Coconut Treasure Map 🏝️

**Content:**
```
Hi [FNAME],

Thanks for diving into the Treasure Map! You're officially on your way to discovering your perfect Curaçao hideaway.

Here's what happens next:
✅ We've saved your preferences
✅ Our villa matchmaker is reviewing your answers
✅ You'll hear from us within 24 hours with personalized recommendations

While you wait, here's a sneak peek at what makes Tommy Coconut different:

[Button: Watch Our Story (2 min)]

Questions? Hit reply—this goes straight to our team, not a robot.

Dushi,
The Tommy Coconut Family

P.S. Your perfect villa is out there. We'll help you find it.
```

---

**Email 2: Villa Recommendations** (Delay: 2 hours)

**Subject:** Your perfect villa match (+ secret pricing) 🗝️

**Content:**
```
Hi [FNAME],

Based on your treasure map:
- Travel vibe: [TRAVEL_VIBE]
- Group size: [GROUP_SIZE]
- Must-have: [MUST_HAVE]

Here are your top 3 villa matches:

[VILLA 1 - Dynamic based on preferences]
✨ Why it fits: [Personalized reasoning]
[Button: See Full Details]

[VILLA 2]
✨ Why it fits: [Personalized reasoning]
[Button: See Full Details]

[VILLA 3]
✨ Why it fits: [Personalized reasoning]
[Button: See Full Details]

📅 For your dates ([TRAVEL_DATES]), here's what's available...

Want to talk it through? [Button: Book 15-Min Discovery Call]

Dushi,
Boy "Little Boss"
Director of Relations
```

---

**Email 3: Social Proof** (Delay: 2 days if no response)

**Subject:** Why 648 guests gave us 4.99 stars ⭐

**Content:**
```
Hi [FNAME],

Still deciding?

Here's what recent guests say about [Recommended Villa]:

"This wasn't a vacation. It was a reset." - Sarah M., March 2024

"The private boat trip was incredible, but the real magic was how everything just... worked." - James T., January 2024

"We've rented 20+ properties. This is the only one we're rebooking." - Linda & Tom K., November 2023

[Button: Read 648+ Reviews]

The difference? We don't just rent villas.
We engineer experiences.

Ready to see what 4.99 stars feels like?
[Button: Choose Your Villa]

Dushi,
The Tommy Coconut Family
```

---

**Email 4: Objection Handler** (Delay: 4 days if no response)

**Subject:** Not sure yet? Here's why guests choose us

**Content:**
```
Hi [FNAME],

I noticed you haven't chosen your villa yet.

That's totally fine—this is a big decision.

Here are the 3 questions we hear most:

❓ "How is this different from Airbnb?"
✅ All-inclusive: SUV, boat trips, pool, concierge (worth $3,000+) included

❓ "What if something goes wrong?"
✅ 🛡️ Logistics Guarantee: We handle it fast; you stay relaxed

❓ "Is it worth the price?"
✅ Compare: Resort = $500/night + fees + stress. Us = $400/night, zero add-ons, pure relaxation

Want the full comparison? [Button: See What's Included]

Or... want to just talk it through?
[Button: Call Me (Boy - Director of Relations)]

No pressure. Just here to help.

Dushi,
Boy
```

---

**Email 5: Last Call** (Delay: 7 days if no response)

**Subject:** We'll keep your treasure map for 30 days

**Content:**
```
Hi [FNAME],

Just checking in one last time.

Your treasure map results will stay saved for 30 days in case you need them.

If now's not the right time, that's cool—just hit reply and let me know when to check back in.

But if you're ready to book your perfect villa, we're here:
[Button: Let's Make This Happen]

Dushi,
Boy

P.S. Our most popular dates book 3-6 months out. If you're eyeing peak season, now's the time.
```

---

### Sequence 2: Post-Stay Review Request

**Email 1: Thank You** (Trigger: Checkout date + 1 day)

**Subject:** Hope you made it home safely ✈️

**Content:**
```
Hi [FNAME],

Just wanted to make sure you made it home safely from [VILLA NAME].

Thanks for trusting us with your vacation. It was our honor hosting you.

We hope [specific detail from stay, e.g., "the sunset cruise was everything you hoped for"].

Talk soon?

Dushi,
[Property Manager Name]
```

---

**Email 2: Review Request** (Trigger: Checkout date + 2 days)

**Subject:** Quick favor? (Takes 60 seconds) 🙏

**Content:**
```
Hi [FNAME],

Hope the post-vacation blues aren't hitting too hard. 😅

Would you mind sharing your experience? It takes 60 seconds and helps future guests know what to expect.

[Button: Leave a Review (60 sec)]

Your feedback helps us get better—and helps other families find their perfect villa.

Thank you!

Dushi,
The Tommy Coconut Family

P.S. Brutally honest feedback is welcome. We want to know what worked (and what didn't).
```

---

**Email 3: Review Reminder** (Trigger: +5 days if no review)

**Subject:** Last call for review (then we'll stop bugging you) 😊

**Content:**
```
Hi [FNAME],

Last gentle reminder about leaving a review.

We totally get it—you're busy getting back to real life.

But if you have 60 seconds, it would mean the world:
[Button: Leave Review]

Thanks again for staying with us.

Dushi,
Boy

P.S. Already left a review? Sorry for the reminder—and THANK YOU!
```

---

## Phase 4: Mailchimp Automation Setup

### Automation 1: Welcome Series

1. **Go to Automations → Create → Custom**
2. **Trigger:** Tag is added = "Website"
3. **Workflow:**
   - Wait: 0 minutes → Send Email 1
   - Wait: 2 hours → Send Email 2 (if Email 1 opened)
   - Wait: 2 days → Send Email 3 (if no booking)
   - Wait: 2 days → Send Email 4 (if no booking)
   - Wait: 3 days → Send Email 5 (if no booking)

### Automation 2: Hot Lead Priority

1. **Trigger:** Tag is added = "Hot Lead"
2. **Action:** Send to Zapier webhook (notify team immediately)
3. **Action:** Send priority email within 2 hours

### Automation 3: Post-Stay Review Collection

1. **Trigger:** Tag is added = "Guest - Checked Out"
2. **Workflow:**
   - Wait: 1 day → Send Thank You email
   - Wait: 1 day → Send Review Request
   - Wait: 5 days → Send Review Reminder (if no review detected)

---

## Phase 5: Testing Checklist

### Test 1: Form Submission
- [ ] Fill out website form
- [ ] Check Airtable for new record
- [ ] Check Mailchimp for new subscriber
- [ ] Verify correct tags applied
- [ ] Confirm welcome email received

### Test 2: Existing Subscriber
- [ ] Submit form with existing email
- [ ] Verify tags updated (not duplicate)
- [ ] Confirm no error messages

### Test 3: Missing Email
- [ ] Submit form without email
- [ ] Verify Airtable still captures lead
- [ ] Confirm graceful handling (no error)

### Test 4: Email Sequence
- [ ] Trigger welcome sequence
- [ ] Verify all 5 emails deliver on schedule
- [ ] Check links work
- [ ] Confirm personalization fields populate

---

## Phase 6: Zapier Workflows (Next Step)

Once Mailchimp is working, we'll connect:
1. Mailchimp → Slack (new subscriber notifications)
2. Mailchimp → Airtable (sync engagement data)
3. Mailchimp → CXPay (trigger booking confirmations)
4. Mailchimp → Google Sheets (analytics dashboard)

---

## Support & Troubleshooting

### Common Issues:

**Issue 1: "Mailchimp API Error 401"**
- Solution: Check API key is correct and active

**Issue 2: "Member already exists"**
- Solution: This is normal—we update their tags instead

**Issue 3: "Tags not applying"**
- Solution: Tags may take 5-10 minutes to show in Mailchimp dashboard

**Issue 4: "Welcome email not sending"**
- Solution: Check automation is active and not paused

---

## Need Help?

1. Check Netlify Function logs for errors
2. Review Mailchimp Activity feed for API calls
3. Test with a personal email first
4. Contact: [Your support method]

---

**Next Steps:**
1. Add environment variables to Netlify
2. Deploy new function code
3. Set up Mailchimp segments
4. Create email templates
5. Configure automations
6. Test thoroughly
7. Go live!

