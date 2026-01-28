
import { LiveRate } from '../types';

// CONFIGURATION
const MASSIVE_API_URL = "https://api.massive-fx.com/v1/rates"; // Placeholder for production endpoint
const API_KEY = process.env.NEXT_PUBLIC_MASSIVE_API_KEY;

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

/**
 * High-Fidelity Simulation Generator
 * Used when API is unreachable or keys are missing.
 * Creates organic-looking market noise.
 * Supports generating multiple entries for seeding/dev tools.
 */
export const generateLiveRates = (count: number = 8): LiveRate[] => {
  const now = Date.now();
  const rates: LiveRate[] = [];

  for (let i = 0; i < count; i++) {
    const pair = TRACKED_PAIRS[i % TRACKED_PAIRS.length];
    
    // 1. Organic Volatility (Random Walk)
    // Add offset if generating more than base pairs to avoid duplicates
    const noise = Math.random() * (i >= TRACKED_PAIRS.length ? 0.005 : 0);
    const volatility = (Math.random() - 0.5) * 0.002; // +/- 0.1% swing
    const midMarket = pair.base * (1 + volatility + noise);
    
    // 2. Bank Spread Logic (The "Rip-off" Rate)
    // Banks typically add 1.8% - 2.5% spread
    const bankSpreadPct = 0.022; 
    const bankRate = midMarket * (1 + bankSpreadPct);

    // 3. RateGuard Spread Logic (The "Fair" Rate)
    // We target 0.3% spread
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
 * Attempts to hit Massive FX API.
 * Falls back to simulation on error.
 */
export const fetchMarketRates = async (): Promise<{ source: 'live' | 'simulated', rates: LiveRate[] }> => {
  // DEFENSIVE: If no key, skip straight to simulation to save network roundtrip
  if (!API_KEY) {
    // console.warn("Massive FX Key missing. Engaging Simulation Protocol.");
    return { source: 'simulated', rates: generateLiveRates(TRACKED_PAIRS.length) };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s Timeout

    const response = await fetch(`${MASSIVE_API_URL}?pairs=${TRACKED_PAIRS.map(p => p.id).join(',')}`, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    // const data = await response.json();
    // Transform API response to internal type here...
    // For now, assuming API fails or we just return empty, triggering fallback in catch
    return { source: 'live', rates: [] }; 

  } catch (error) {
    // FAIL-SAFE: Return simulation on any network/api error
    return { source: 'simulated', rates: generateLiveRates(TRACKED_PAIRS.length) };
  }
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
