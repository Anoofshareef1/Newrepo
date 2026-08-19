# Background Push Notifications

1. Generate a VAPID key pair from the project directory:

   `npx web-push generate-vapid-keys`

2. Add these variables to the Netlify site environment:

   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VAPID_CONTACT_EMAIL`
   - `PUSH_TEST_TOKEN` (a long random secret used only for the test endpoint)

3. Deploy the site over HTTPS. On iOS, open the deployed site in Safari, add it to the Home Screen, open the installed app, and grant notifications. Android users can install the PWA from Chrome and grant notifications.

The app registers a push subscription when a flight is followed. Netlify Blobs stores subscriptions, and `flight-notifications.ts` runs every minute to compare the flights API with the previous snapshot and send updates to matching subscriptions.

To test delivery independently of the flight API, obtain the subscription endpoint from the browser push subscription and call the protected test function:

`curl -X POST https://YOUR_SITE/.netlify/functions/push-test -H "Authorization: Bearer YOUR_PUSH_TEST_TOKEN" -H "content-type: application/json" -d '{"endpoint":"SUBSCRIPTION_ENDPOINT"}'`

The function records attempt, success, and failure details in the subscription record. Never expose `PUSH_TEST_TOKEN` or `VAPID_PRIVATE_KEY` in client code.
