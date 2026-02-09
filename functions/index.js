const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");

admin.initializeApp();
const db = admin.firestore();

// Pairs to track
const CURRENCY_PAIRS = [
  { base: "USD", quote: "EUR" },
  { base: "GBP", quote: "USD" },
  { base: "USD", quote: "CAD" },
  { base: "USD", quote: "JPY" },
  { base: "AUD", quote: "USD" },
  { base: "USD", quote: "ZAR" },
  { base: "USD", quote: "TRY" },
  { base: "USD", quote: "MYR" }
];

const SERPAPI_KEY = process.env.SERPAPI_API_KEY;

/**
 * Scheduled Function: Runs 7 times a day
 * Cron: 0 0,3,7,10,14,17,21 * * *
 */
exports.syncCurrencyRates = functions.pubsub
  .schedule("0 0,3,7,10,14,17,21 * * *")
  .timeZone("UTC")
  .onRun(async (context) => {
    const batch = db.batch();
    const timestamp = admin.firestore.FieldValue.serverTimestamp();

    try {
      const promises = CURRENCY_PAIRS.map(async (pair) => {
        const query = `${pair.base}-${pair.quote}`;
        const docId = `${pair.base}_${pair.quote}`;
        
        try {
          // Fetch from SerpApi (Google Finance Engine)
          const response = await axios.get("https://serpapi.com/search", {
            params: {
              engine: "google_finance",
              q: query,
              api_key: SERPAPI_KEY
            }
          });

          // Extract Rate
          // Google Finance result structure varies, checking markets graph or summary
          let rate = 0;
          if (response.data.summary && response.data.summary.price) {
             rate = parseFloat(response.data.summary.price);
          } else if (response.data.markets && response.data.markets[query]) {
             rate = response.data.markets[query].price;
          }

          if (!rate || isNaN(rate)) {
            console.error(`Failed to fetch rate for ${query}`);
            return;
          }

          // Calculations
          // Bank Spread: Base Rate + 2.5% markup
          const bankSpread = rate * 1.025;
          // Leakage: Difference between bank rate and mid-market
          const leakage = bankSpread - rate;

          const docRef = db.collection("rates").doc(docId);
          batch.set(docRef, {
            rate: rate,
            bank_spread: parseFloat(bankSpread.toFixed(4)),
            leakage: parseFloat(leakage.toFixed(4)),
            date_time: timestamp
          }, { merge: true });

        } catch (err) {
          console.error(`Error processing ${query}:`, err.message);
        }
      });

      await Promise.all(promises);
      await batch.commit();
      console.log("Successfully synced currency rates.");
    } catch (error) {
      console.error("Critical error in syncCurrencyRates:", error);
    }
  });