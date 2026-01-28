
import { LiveRate } from '../types';

export const generateLiveRates = (count: number = 100): LiveRate[] => {
  const pairs = [
    { name: 'USD/CAD', base: 1.4150 },
    { name: 'EUR/USD', base: 1.0520 },
    { name: 'GBP/USD', base: 1.2650 }
  ];

  const rates: LiveRate[] = [];
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const pair = pairs[i % pairs.length];
    
    // Mid-Market Rate: Realistically volatile (0.01% - 0.05% fluctuations)
    // We alternate volatility direction based on index to simulate noise
    const volatilityPct = (Math.random() * (0.0005 - 0.0001) + 0.0001); 
    const direction = Math.random() > 0.5 ? 1 : -1;
    const mid = pair.base * (1 + (volatilityPct * direction));

    // Bank 'Typical' Rate: Apply a hidden spread of 1.8% to 2.4% on top of the mid-market
    const bankSpread = Math.random() * (0.024 - 0.018) + 0.018;
    const bankRate = mid * (1 + bankSpread);

    // RateGuard Optimized Rate: Assuming a much tighter 0.3% spread
    const rgSpread = 0.003;
    const rateGuardRate = mid * (1 + rgSpread);

    // RateGuard Savings: Difference in 'pips' (1 pip = 0.0001 usually)
    const savings = bankRate - rateGuardRate;
    const pips = Math.round(savings * 10000);

    rates.push({
      id: `rate_${now}_${i}`,
      pair: pair.name,
      timestamp: now + (i * 60000), // Incremental by 60 seconds
      midMarketRate: parseFloat(mid.toFixed(5)),
      bankRate: parseFloat(bankRate.toFixed(5)),
      rateGuardRate: parseFloat(rateGuardRate.toFixed(5)),
      savingsPips: pips,
      trend: direction > 0 ? 'up' : 'down'
    });
  }

  return rates;
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
