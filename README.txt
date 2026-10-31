DAILY DOSE INDIA — ORIGINAL NEWS STUDIO PACKAGE
================================================

This is a custom-built deployable web application, not a screenshot or mockup.

WHAT IS INCLUDED
- Responsive Hindi news dashboard for Android and desktop
- 15 news categories: India, world, politics, Uttar Pradesh, Bihar, sports, cricket, business, technology, entertainment, education, health, weather, crime and science
- Google News RSS ingestion through a Netlify serverless function; no API key
- Auto-refresh, category filter, headline panel and scrolling ticker
- Hindi text-to-speech using Android/browser speech synthesis; no voice API key
- Overlay page at /?overlay=1 for PRISM Web Widget
- 16:9 / 9:16 layout selector in dashboard
- PWA manifest/service worker for installable web-app behavior

DEPLOYMENT REQUIRED BEFORE LIVE USE
This ZIP is the complete application source. It is not already hosted on your Netlify account.
Because RSS fetching uses a serverless function, deploy it as a Netlify project with Functions enabled:
1. Extract this ZIP.
2. Upload the extracted project to a GitHub repository (all files and folders).
3. In Netlify choose Add new project > Import an existing project, connect that repository, and deploy.
   Build command: leave blank. Publish directory: .
   Functions directory is configured in netlify.toml as netlify/functions.
4. Open the deployed site URL. The News Desk should show RSS results when the feed is reachable.
5. For PRISM, use https://YOUR-SITE.netlify.app/?overlay=1 as the Web Widget URL.
6. To enable spoken headlines, open the dashboard or overlay in Chrome and tap “आवाज़ चालू करें”.
   Browser speech requires a user gesture and an installed Hindi TTS voice on Android.

IMPORTANT REAL-WORLD LIMITS
- No RSS/news system can guarantee that literally no story is missed. Feeds are selected across major categories and are limited by publisher/RSS availability.
- The app does not bypass paywalls or scrape private feeds.
- Verify stories from the linked publisher before broadcasting; RSS titles and summaries can be incomplete or wrong.
- Hindi speech depends on Android/browser TTS voice availability. PRISM may not capture browser-widget audio on every device/version. Test with an unlisted/private stream before public broadcasting.
- Automatic LIVE start is not included; PRISM controls the actual livestream.
- Weather and live cricket scores are news-search feeds, not guaranteed ball-by-ball official score APIs.
