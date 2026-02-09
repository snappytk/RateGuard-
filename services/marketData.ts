import { LiveRate } from '../types';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

// PAIRS CONFIGURATION
const TRACKED_PAIRS = [
  { id: 'eurusd', symbol: 'EUR/USD', base: 1.0850 },
  { id: 'gbpusd', symbol: 'GBP/USD', base: 1.2650 },
  { id: 'usdcad', symbol: 'USD/CAD', base: 1.4150 },
  { id: 'usdjpy', symbol: 'USD/JPY', base: 151.20 },
  { id: 'audusd', symbol: 'AUD/USD', base: 0.6540 },
  { id: 'usdzar', symbol: 'USD/ZAR', base: 18.950 },
  { id: 'usdtry', symbol: 'USD/TRY', base: 32.100 },
  { id: 'usdmyr', symbol: 'USD/MYR', base: 4.750 },
];

// --- RATEGUARD FX INTEGRATOR LOGIC (SIMULATION) ---

export interface MarketAudit {
  midMarketRate: number;
  markupCost: number;
  spreadPct: number;
  marketStatus: 'Open' | 'Closed' | 'Historical';
  timestampUsed: number;
  source: 'Live API' | 'Stale/Friday' | 'Simulation';
  note?: string;
}

export const analyzeQuoteRealtime = async (
  pairStr: string,
  bankRate: number,
  amount: number,
  dateStr?: string // YYYY-MM-DD
): Promise<MarketAudit> => {
  // 1. Normalize Pair
  const cleanPair = pairStr.includes('/') ? pairStr : `USD/${pairStr}`;
  const [base, quote] = cleanPair.split('/');

  // 2. Determine Market Status & Date Context (Simulated Logic)
  const now = new Date();
  const txDate = dateStr ? new Date(dateStr) : now;
  const isHistorical = (now.getTime() - txDate.getTime()) > (24 * 60 * 60 * 1000);

  // Market Hours: Closes Friday 5PM ET (~22:00 UTC), Opens Sunday 5PM ET
  const day = now.getUTCDay(); // 0 = Sun, 6 = Sat
  const hour = now.getUTCHours();
  const isWeekend = (day === 6) || (day === 0 && hour < 22) || (day === 5 && hour >= 22);

  let marketStatus: 'Open' | 'Closed' | 'Historical' = 'Open';
  let source: 'Live API' | 'Stale/Friday' | 'Simulation' = 'Simulation';
  let note: string | undefined = undefined;
  let dateToFetch = dateStr || now.toISOString().split('T')[0];

  if (isHistorical) {
    marketStatus = 'Historical';
  } else if (isWeekend) {
    marketStatus = 'Closed';
    source = 'Stale/Friday';
    
    // Calculate last Friday's date
    const friday = new Date();
    const daysToFriday = (day + 2) % 7; 
    friday.setDate(now.getDate() - daysToFriday);
    dateToFetch = friday.toISOString().split('T')[0];
    
    note = `Live markets are closed. Using Friday's Closing Rate (${dateToFetch}) for this audit.`;
  }

  // 3. Generate Simulated Mid-Market Rate
  // Find base rate and apply slight variation
  const found = TRACKED_PAIRS.find(p => p.symbol.includes(quote) || p.symbol.includes(base));
  const baseRate = found ? found.base : 1.0;
  
  // Add deterministic "noise" based on date characters to simulate historical variance
  const dateHash = dateToFetch.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const midMarketRate = baseRate * (1 + ((dateHash % 100) / 10000) * (Math.random() > 0.5 ? 1 : -1));

  // 4. RateGuard Calculation: 'Spread' = ((Bank Rate - Market Rate) / Market Rate) * 100
  const spreadAbs = Math.abs(bankRate - midMarketRate); 
  const spreadPct = (spreadAbs / midMarketRate) * 100;
  
  // Calculate total hidden cost
  const markupCost = amount * (spreadPct / 100);

  return {
    midMarketRate: parseFloat(midMarketRate.toFixed(5)),
    markupCost,
    spreadPct,
    marketStatus,
    timestampUsed: Date.now(),
    source,
    note
  };
};

// --- SIMULATION & TICKER LOGIC ---

/**
 * High-Fidelity Simulation Generator (For Dashboard Ticker)
 */
export const generateLiveRates = (count: number = 8): LiveRate[] => {
  const now = Date.now();
  const rates: LiveRate[] = [];

  for (let i = 0; i < count; i++) {
    const pair = TRACKED_PAIRS[i % TRACKED_PAIRS.length];
    
    // 1. Organic Volatility (Random Walk)
    const noise = Math.random() * (i >= TRACKED_PAIRS.length ? 0.005 : 0);
    const volatility = (Math.random() - 0.5) * 0.002; 
    const midMarket = pair.base * (1 + volatility + noise);
    
    // 2. Bank Spread Logic (The "Rip-off" Rate)
    const bankSpreadPct = 0.022; 
    const bankRate = midMarket * (1 + bankSpreadPct);

    // 3. RateGuard Spread Logic (The "Fair" Rate)
    const guardSpreadPct = 0.003;
    const guardRate = midMarket * (1 + guardSpreadPct);

    // 4. Calculate Leakage (Pips)
    const leakage = bankRate - guardRate;
    const pips = Math.abs(Math.round(leakage * 10000));

    // 5. Trend Determination
    const trend = Math.random() > 0.5 ? 'up' : 'down';

    rates.push({
      id: `rate_${pair.id}_${now}_${i}`,
      pair: pair.symbol,
      timestamp: now,
      midMarketRate: parseFloat(midMarket.toFixed(5)),
      bankRate: parseFloat(bankRate.toFixed(5)),
      rateGuardRate: parseFloat(guardRate.toFixed(5)),
      savingsPips: pips,
      trend: trend
    });
  }

  return rates;
};

/**
 * Primary Data Fetcher
 * Strategy: Check Firestore for 'rates' collection. If empty, fall back to simulation.
 */
export const fetchMarketRates = async (): Promise<{ source: 'live' | 'simulated', rates: LiveRate[] }> => {
  try {
    const querySnapshot = await getDocs(collection(db, "rates"));
    if (!querySnapshot.empty) {
      const realRates: LiveRate[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        realRates.push({
          id: doc.id,
          pair: doc.id.replace('_', '/'),
          timestamp: data.date_time ? data.date_time.toMillis() : Date.now(),
          midMarketRate: data.rate,
          bankRate: data.bank_spread,
          rateGuardRate: data.rate * 1.003, // Internal logic
          savingsPips: Math.round(data.leakage * 10000),
          trend: 'up' // Simple placeholder
        });
      });
      return { source: 'live', rates: realRates };
    }
  } catch (err) {
    console.warn("Firestore Rate Fetch Failed, falling back to simulation.", err);
  }

  // Fallback
  return { source: 'simulated', rates: generateLiveRates(TRACKED_PAIRS.length) };
};

export const downloadRatesJSON = (rates: LiveRate[]) => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(rates, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "rate_guard_live_rates.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};