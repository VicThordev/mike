# Google AdSense Integration Guide

## 🚀 Quick Setup Steps

### Step 1: Get Your AdSense Account Ready
1. Go to [Google AdSense](https://www.google.com/adsense/)
2. Sign up or log in to your account
3. Add your website URL and get approved
4. Get your Publisher ID (format: ca-pub-XXXXXXXXXXXXXXXXX)

### Step 2: Create Ad Units
1. In AdSense dashboard, go to "Ads" > "By ad unit"
2. Create these ad units:
   - **Banner Ad** (728x90 or responsive)
   - **Mobile Banner** (320x50 or responsive)
   - **Square Ad** (300x300 or responsive)
   - **Sidebar Ad** (160x600 or responsive)

3. Copy the ad slot IDs for each unit

### Step 3: Update Your App Configuration
1. In `nfl-pickem-app.tsx`, replace:
   \`\`\`tsx
   const ADSENSE_PUBLISHER_ID = "ca-pub-YOUR_PUBLISHER_ID"
   \`\`\`
   With your actual publisher ID

2. Update the AD_SLOTS object with your actual slot IDs:
   \`\`\`tsx
   const AD_SLOTS = {
     banner: "1234567890", // Your banner ad slot ID
     sidebar: "0987654321", // Your sidebar ad slot ID
     mobile: "1122334455", // Your mobile ad slot ID
     interstitial: "5566778899" // Your interstitial ad slot ID
   }
   \`\`\`

### Step 4: AdSense Policy Compliance
✅ **Content Requirements:**
- Original, high-quality content
- Clear navigation and user experience
- Privacy policy and terms of service
- No prohibited content (gambling, adult, etc.)

✅ **Technical Requirements:**
- Fast loading times
- Mobile-friendly design
- HTTPS enabled
- Valid HTML/CSS

### Step 5: Optimize Ad Placement
The app includes strategic ad placements:
- **Login Screen**: Banner ad below login form
- **Entry Screen**: Banner ad in "How It Works" section
- **Game Picking**: Banner ad below game selection
- **Summary Screen**: Banner ad after picks summary

### Step 6: Monitor Performance
1. Check AdSense dashboard for:
   - Impressions and clicks
   - Revenue and RPM
   - Ad performance by placement

2. Use Google Analytics to track:
   - User engagement
   - Page views
   - Bounce rate

## 💰 Revenue Optimization Tips

### Best Practices:
1. **Ad Placement**: Above the fold and within content
2. **Ad Sizes**: Use responsive ads for better performance
3. **User Experience**: Don't overwhelm users with too many ads
4. **A/B Testing**: Test different ad placements and sizes

### Expected Revenue:
- **RPM**: $1-5 per 1000 page views (varies by niche)
- **CTR**: 1-3% average click-through rate
- **Sports Niche**: Generally higher paying ads

### Mobile Optimization:
- Responsive ad units automatically adjust
- Mobile users typically have higher engagement
- Consider mobile-specific ad placements

## 🔧 Troubleshooting

### Common Issues:
1. **Ads not showing**: Check publisher ID and ad slot IDs
2. **Policy violations**: Review AdSense policies
3. **Low revenue**: Optimize ad placement and content quality

### Testing:
1. Use AdSense test mode during development
2. Check browser console for AdSense errors
3. Verify ads load on different devices

## 📊 Analytics Integration

Add Google Analytics to track ad performance:
\`\`\`html
<!-- Add to your app's head section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
\`\`\`

## 🚀 Go Live Checklist

- [ ] AdSense account approved
- [ ] Publisher ID updated in code
- [ ] Ad slot IDs configured
- [ ] Privacy policy added to website
- [ ] Terms of service created
- [ ] HTTPS enabled
- [ ] Mobile-responsive design tested
- [ ] Page load speed optimized
- [ ] Content quality reviewed
- [ ] AdSense policies compliance verified

Your app is now ready to generate revenue through Google AdSense! 💰
\`\`\`

Let me also create a privacy policy component since it's required for AdSense:
