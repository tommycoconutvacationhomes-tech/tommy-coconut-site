# Google Business Profile Review Automation
## Tommy Coconut Vacation Rentals

---

## Goal

Get your 648+ Airbnb reviews working for your SEO by systematically collecting Google reviews from every guest.

**Target:** 100+ Google reviews in 6 months

---

## Phase 1: Google Business Profile Setup

### Step 1: Verify Your Listing (If Not Already Done)

1. Go to: https://business.google.com
2. Search for "Tommy Coconut" or claim your listing
3. Verify ownership (usually by postcard or phone)
4. Complete your profile:
   - Business name: Tommy Coconut Private Resorts
   - Category: Vacation Home Rental Agency
   - Address: [Your Curaçao address]
   - Phone: [Your WhatsApp/phone number]
   - Website: https://tommycoconutvacations.com
   - Hours: 24/7 (vacation rentals)

### Step 2: Optimize Your Profile

**Photos:**
- Add 20+ high-quality photos from each villa
- Hero photos from Cloudinary
- Guest experience photos
- Team photos (Boy, Raymonde, Kim, Ray)

**Description:**
```
Tommy Coconut Private Resorts offers all-inclusive luxury villa rentals in Curaçao. Each stay includes a private EV-SUV, boat excursions with Captain Mike, and zero hidden fees. We're not just a rental company—we're family. Rated 4.99★ across 530+ stays, we engineer the "Dushi Life" experience that makes your Caribbean vacation effortless.

Amenities Included:
✅ Private villa with pool
✅ EV-SUV for your entire stay
✅ Private boat trip with Captain Mike
✅ Concierge service
✅ All utilities and cleaning
✅ No surprise fees ever

Properties: Happy Hideaway, Castaway Beach, Palm Breeze, Bayside Hill, Dushi Hideaway, Sunshine Bay, Sailaway Beach, Tropical Haven
```

**Attributes:**
- Wheelchair accessible (if applicable)
- Free parking
- Free Wi-Fi
- Family-friendly
- Outdoor space

### Step 3: Get Your Review Link

1. In Google Business Profile dashboard
2. Go to "Get more reviews"
3. Copy your short review link
4. **Your Review Link:** `https://g.page/r/CZLeACxdzFq3EBM/review`
5. **This URL is now configured** - ready to use everywhere

---

## Phase 2: Automated Review Collection

### Method 1: Email Automation (via Mailchimp)

**Email Sequence: 2 Days After Checkout**

**Subject:** Quick favor? (60 seconds) 🙏

**Body:**
```
Hi {{first_name}},

Hope you're recovering from those post-vacation blues!

Would you mind leaving a quick Google review about your {{villa_name}} experience?

It takes 60 seconds and helps future guests find us.

👉 [Leave Review on Google](https://g.page/r/CZLeACxdzFq3EBM/review)

Your honest feedback helps us get better—and helps families discover the Dushi Life.

Thank you!

Dushi,
Boy & The Tommy Coconut Family

---

P.S. Already left a review? You're awesome. Thank you! 🙏
```

**Follow-up: 5 Days Later (if no review)**

**Subject:** Last reminder about that review 😊

**Body:**
```
Hi {{first_name}},

Just one last gentle nudge about leaving a Google review.

If you've already done it—thank you! ❤️

If not, here's that link again:
👉 [Leave Review (60 sec)](https://g.page/r/CZLeACxdzFq3EBM/review)

Either way, thanks for staying with us.

Dushi,
Boy
```

### Method 2: Zapier Automation

**Zap: Auto-Send Review Request**

**Trigger:**
- App: Airtable
- Event: Record Enters View
- View: "Checked Out - Needs Review"
- Filter: Checkout date = 2 days ago

**Action 1: Send Email via Gmail**
- To: {{guest_email}}
- Subject: "Quick favor? Leave us a Google review 🙏"
- Body: [Use template above]
- Insert link: Your Google review URL

**Action 2: Add Tag in Mailchimp**
- Tag: "Review - Requested"

**Action 3: Wait 5 Days**
- Delay: 5 days

**Action 4: Check if Review Received**
- Look up Airtable record
- If "Google Review" field is still empty...

**Action 5: Send Reminder Email**
- Same as Action 1 but reminder version

**Action 6: Update Airtable**
- Mark as "Review - Reminded"

### Method 3: WhatsApp Automation (Advanced)

**Via Twilio WhatsApp API:**

**Message 1: Day After Checkout**
```
Hi {{first_name}}! 👋

Thanks for choosing Tommy Coconut.

Hope you made it home safely! ✈️

- Boy & Team
```

**Message 2: Day 2**
```
Quick favor?

Would you mind leaving a Google review?

Takes 60 seconds:
https://g.page/r/CZLeACxdzFq3EBM/review

Helps future guests find us 🙏

- Boy
```

---

## Phase 3: Review Monitoring & Response

### Set Up Google Business Profile Notifications

1. Enable email notifications for new reviews
2. Or: Use Zapier to monitor reviews

**Zap: New Google Review Alert**

**Trigger:**
- App: Google My Business (via Zapier)
- Event: New Review

**Actions:**
1. Post to Slack channel #reviews
2. Update Airtable (match guest email)
3. If 5-star: Post to social media
4. If <5-star: Alert team for immediate response

### Response Templates

**5-Star Review Response:**
```
Thank you, {{reviewer_name}}! 🙏

So glad you experienced the Dushi Life at {{villa_name}}. It was our pleasure hosting you and your family.

Can't wait to welcome you back!

Dushi,
Boy & The Tommy Coconut Family
```

**4-Star Review Response:**
```
Thanks for the feedback, {{reviewer_name}}!

Glad you enjoyed {{positive_aspect}}.

We're always looking to improve—{{mention_any_issue_addressed}}.

Hope to welcome you back soon!

Dushi,
Boy
```

**3-Star or Below Response:**
```
{{reviewer_name}}, we're so sorry we fell short.

{{specific_acknowledgment_of_issue}}

We'd love to make this right. Could you email us at [your email] or call [your number]?

Your feedback helps us improve for every guest.

Thank you for giving us a chance to do better.

- Boy & Team
Tommy Coconut
```

**Response SLA:**
- 5-star reviews: Within 24 hours
- 4-star reviews: Within 12 hours
- 3-star or below: Within 2 hours (urgent)

---

## Phase 4: Make It Easy to Review

### Add Review Buttons to Website

**Location 1: Thank You Page (After Booking)**
```html
<div class="review-request" style="text-align: center; padding: 40px; background: #f8f8f8; border-radius: 12px; margin: 40px 0;">
  <h3>Love Tommy Coconut? Tell Google! 🙏</h3>
  <p>Your review helps future guests discover the Dushi Life</p>
  <a href="https://g.page/r/CZLeACxdzFq3EBM/review"
     class="btn btn-primary"
     target="_blank">
     Leave a Google Review
  </a>
</div>
```

**Location 2: Email Signatures**
```
---
Boy "Little Boss"
Director of Relations
Tommy Coconut Private Resorts

⭐ Love your stay? Leave us a Google review!
👉 https://g.page/r/CZLeACxdzFq3EBM/review
```

**Location 3: Footer of Website**
```html
<div class="footer-review">
  <a href="https://g.page/r/CZLeACxdzFq3EBM/review" target="_blank">
    Leave us a Google Review ⭐
  </a>
</div>
```

**Location 4: QR Code at Villa**
- Generate QR code for Google review link
- Print and frame at villa
- Place on checkout table

---

## Phase 5: Incentivize Reviews (Carefully)

**Google's Policy:** You can NOT offer incentives in exchange for positive reviews.

**What You CAN Do:**
- ✅ Ask every guest to leave a review
- ✅ Remind them multiple times
- ✅ Make it easy with direct links
- ✅ Thank reviewers publicly

**What You CANNOT Do:**
- ❌ Offer discounts for 5-star reviews
- ❌ Enter reviewers into a prize drawing
- ❌ Give gift cards for reviews

**Gray Area (Allowed):**
- ✅ "Leave a review and we'll feature your story!"
- ✅ "Share your experience and help us improve"
- ✅ "Reviews help us welcome more guests like you"

---

## Phase 6: Leverage Existing Reviews

### Convert Airbnb Reviews to Social Proof

**Email to Past Airbnb Guests:**

**Subject:** We've moved! Help us build our Google presence 🙏

**Body:**
```
Hi {{guest_name}},

Remember your amazing stay at {{villa_name}}?

We loved hosting you through Airbnb, but we're now focusing on direct bookings through our website.

Would you mind leaving a Google review to help future guests find us?

It's the same great experience—just easier to book!

👉 [Leave Google Review](https://g.page/r/CZLeACxdzFq3EBM/review)

As a thank you, we'd love to offer you 10% off your next stay (booked direct).

Thanks for being part of the Tommy Coconut family!

Dushi,
Boy & Team

---

P.S. Already booking with us direct? You're ahead of the curve! 😎
```

---

## Phase 7: Track & Optimize

### Review Collection Dashboard (Airtable)

**Fields to Track:**
- Guest Name
- Villa
- Checkout Date
- Review Request Sent (Date)
- Reminder Sent (Date)
- Google Review Received (Yes/No)
- Review Date
- Star Rating
- Review URL
- Response Sent (Date)

**KPIs to Monitor:**
- Review request sent rate (should be 100%)
- Review received rate (target: 30-40%)
- Average rating (target: 4.8+)
- Response time to reviews (target: <24 hrs)
- Reviews per month (target: 15-20)

### Monthly Review Meeting

**Agenda:**
1. Review all new reviews
2. Identify common themes (positive & negative)
3. Implement improvements based on feedback
4. Celebrate team members mentioned by name
5. Adjust review request messaging if needed

---

## Integration with Existing Systems

### Airtable View: "Needs Review Request"

**Filter:**
- Status = "Checked Out"
- Checkout Date = 2 days ago
- Google Review = Empty

**Sort:**
- Checkout Date (most recent first)

**Purpose:**
- Zapier checks this view daily
- Automatically sends review requests
- Tracks who needs follow-up

### Mailchimp Segment: "Post-Stay Guests"

**Criteria:**
- Tag = "Guest - Checked Out"
- Subscribed Date = Last 90 days

**Use For:**
- Review request campaigns
- Re-engagement offers
- Seasonal promotions

### Slack Channel: #reviews

**Notifications:**
- New Google review posted
- Review response sent
- Negative review alert (urgent)
- Monthly review summary

---

## Pro Tips for More Reviews

### 1. Ask at the Right Time
- ✅ 2 days after checkout (emotions still fresh)
- ❌ Too soon (still traveling)
- ❌ Too late (forgotten details)

### 2. Make It Personal
- ✅ From a real person (Boy, Raymonde)
- ✅ Reference specific villa/experience
- ❌ Generic automated template

### 3. Show Appreciation
- ✅ Thank reviewers publicly
- ✅ Feature reviews on social media
- ✅ Mention them in newsletters

### 4. Respond to Every Review
- Shows you care
- Helps SEO (more content)
- Builds trust with future guests
- Demonstrates customer service

### 5. Close the Loop
- If guest had an issue, fix it
- Then ask for updated review
- Show you take feedback seriously

---

## Advanced: Review Schema Markup

Add structured data to your website to show review stars in Google search results:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Tommy Coconut Private Resorts",
  "image": "https://tommycoconutvacations.com/logo.jpg",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.99",
    "reviewCount": "648",
    "bestRating": "5",
    "worstRating": "1"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CW",
    "addressRegion": "Curaçao"
  }
}
</script>
```

*(Update ratingValue and reviewCount as Google reviews grow)*

---

## Next Steps Checklist

- [ ] Verify Google Business Profile
- [ ] Get your review link
- [ ] Add link to email signature
- [ ] Set up Mailchimp automation
- [ ] Create Zapier review workflow
- [ ] Add review buttons to website
- [ ] Set up Slack notifications
- [ ] Create Airtable tracking fields
- [ ] Email past Airbnb guests
- [ ] Commit to responding within 24 hours

---

## Monthly Goals

**Month 1:** 10 reviews
**Month 2:** 15 reviews
**Month 3:** 20 reviews
**Month 4-6:** 25+ reviews

**Total after 6 months:** 100+ Google reviews ⭐

---

**Ready to launch?**

Start with the email automation, and we'll build from there.

