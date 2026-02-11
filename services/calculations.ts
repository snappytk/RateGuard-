
import { QuoteData, FeeItem } from '../types';

/**
 * Main calculation function - call this after extracting data
 */
export function calculateAllCosts(
  extractedData: any, 
  midMarketRate: number
) {
  const amount = parseFloat(extractedData.original_amount) || 0;
  const bankRate = parseFloat(extractedData.exchange_rate_bank) || 1.0;
  
  // Step 1: Categorize and sum all fees
  const feeBreakdown = categorizeFees(extractedData.fees?.items || []);
  const totalFees = feeBreakdown.wireFee + feeBreakdown.fxFee + 
                    feeBreakdown.correspondentFee + feeBreakdown.otherFees;
  
  // Step 2: Calculate exchange rate spread
  // Formula: ((midMarket - bankRate) / bankRate) for inversion or absolute difference depending on quote type
  // Standard logic: Difference between Mid and Bank, scaled to volume
  const spreadDecimal = Math.abs(midMarketRate - bankRate) / midMarketRate; // Using Mid as denominator for true spread
  const spreadPercentage = spreadDecimal * 100;
  const spreadCost = amount * spreadDecimal;
  
  // Step 3: Calculate total hidden cost
  const totalHiddenCost = totalFees + spreadCost;
  const totalHiddenPercentage = (totalHiddenCost / amount) * 100;
  
  // Step 4: Build cost breakdown for charts
  const costBreakdown = {
    fees: {
      amount: totalFees,
      percentage: (totalFees / amount) * 100,
      label: "Bank Fees"
    },
    spread: {
      amount: spreadCost,
      percentage: (spreadCost / amount) * 100,
      label: "Exchange Rate Markup"
    },
    total: {
      amount: totalHiddenCost,
      percentage: totalHiddenPercentage,
      label: "Total Hidden Cost"
    }
  };
  
  // Step 5: Annualized projections (assume monthly)
  const annualTransactionCount = 12;
  const annualizedHiddenCost = totalHiddenCost * annualTransactionCount;
  const monthlyAverageCost = annualizedHiddenCost / 12;
  
  // Step 6: Industry comparison
  const industryComparison = compareToIndustry(
    totalHiddenCost,
    totalHiddenPercentage,
    extractedData.currency_pair || 'USD/EUR'
  );
  
  // Step 7: Dispute recommendation
  const disputeRec = generateDisputeRecommendation(
    spreadPercentage,
    totalFees,
    totalHiddenCost,
    bankRate,
    amount,
    spreadCost
  );
  
  return {
    fees: feeBreakdown.items,
    wireFee: feeBreakdown.wireFee,
    fxFee: feeBreakdown.fxFee,
    correspondentFee: feeBreakdown.correspondentFee,
    otherFees: feeBreakdown.otherFees,
    totalFees,
    spreadDecimal,
    spreadPercentage,
    markupCost: spreadCost,
    totalHiddenCost,
    totalHiddenPercentage,
    costBreakdown,
    annualTransactionCount,
    annualizedHiddenCost,
    monthlyAverageCost,
    ...industryComparison,
    dispute: disputeRec
  };
}

/**
 * Categorize fee line items by type
 */
function categorizeFees(feeItems: any[]) {
  const result = {
    wireFee: 0,
    fxFee: 0,
    correspondentFee: 0,
    otherFees: 0,
    items: [] as FeeItem[]
  };
  
  for (const fee of feeItems || []) {
    const amount = parseFloat(fee.amount) || 0;
    const type = (fee.name || fee.type || '').toLowerCase();
    let category: 'wire' | 'fx' | 'correspondent' | 'other' = 'other';
    
    if (type.includes('wire') || type.includes('transfer') || type.includes('outgoing')) {
      result.wireFee += amount;
      category = 'wire';
    } 
    else if (type.includes('fx') || type.includes('exchange') || 
             type.includes('conversion') || type.includes('foreign')) {
      result.fxFee += amount;
      category = 'fx';
    }
    else if (type.includes('correspondent') || type.includes('intermediary') || 
             type.includes('receiving')) {
      result.correspondentFee += amount;
      category = 'correspondent';
    }
    else {
      result.otherFees += amount;
    }

    result.items.push({ 
        type: fee.name || 'Fee',
        amount, 
        currency: 'USD', // Default for now
        description: type,
        category
    });
  }
  
  return result;
}

/**
 * Compare to industry benchmarks
 */
function compareToIndustry(totalCost: number, totalPercentage: number, currencyPair: string) {
  // Benchmarks by currency pair (spread %, total cost %)
  const benchmarks: Record<string, { avgSpread: number, avgTotalCost: number }> = {
    'USD/EUR': { avgSpread: 1.2, avgTotalCost: 1.5 },
    'USD/GBP': { avgSpread: 1.3, avgTotalCost: 1.6 },
    'USD/JPY': { avgSpread: 1.4, avgTotalCost: 1.7 },
    'EUR/GBP': { avgSpread: 1.1, avgTotalCost: 1.4 },
    'USD/CAD': { avgSpread: 1.0, avgTotalCost: 1.3 },
    'USD/AUD': { avgSpread: 1.1, avgTotalCost: 1.4 },
    'default': { avgSpread: 1.5, avgTotalCost: 2.0 }
  };
  
  const benchmark = benchmarks[currencyPair] || benchmarks['default'];
  
  const yourCostVsIndustry = totalPercentage - benchmark.avgTotalCost;
  const betterThanIndustry = yourCostVsIndustry < 0;
  
  // Percentile ranking
  let percentileRank;
  if (totalPercentage < 1.0) percentileRank = 'top_10%';
  else if (totalPercentage < 1.5) percentileRank = 'top_25%';
  else if (totalPercentage < 2.0) percentileRank = 'average';
  else if (totalPercentage < 3.0) percentileRank = 'bottom_25%';
  else percentileRank = 'bottom_10%';
  
  return {
    industryAverageSpread: benchmark.avgSpread,
    industryAverageTotalCost: benchmark.avgTotalCost,
    yourCostVsIndustry: parseFloat(yourCostVsIndustry.toFixed(2)),
    betterThanIndustry,
    percentileRank,
    potentialSavingsPercent: parseFloat(Math.max(0, yourCostVsIndustry).toFixed(2))
  };
}

/**
 * Generate dispute recommendation
 */
function generateDisputeRecommendation(
    spreadPercentage: number, 
    totalFees: number, 
    totalHiddenCost: number, 
    bankRate: number,
    amount: number,
    spreadCost: number
) {
  // Dispute triggers
  const highSpread = spreadPercentage > 1.0;
  const highFees = totalFees > 100;
  const highTotalCost = totalHiddenCost > 500;
  
  const recommended = highSpread || highFees || highTotalCost;
  
  // Priority level
  let priority: "high" | "medium" | "low" = 'low';
  if (spreadPercentage > 2.5 || totalHiddenCost > 2000) priority = 'high';
  else if (spreadPercentage > 1.5 || totalHiddenCost > 1000) priority = 'medium';
  
  // Suggested negotiation (target 0.5% spread)
  const targetSpreadPercent = 0.5;
  const suggestedNegotiatedRate = bankRate * (1 + targetSpreadPercent/100);
  
  // Potential savings calculation
  const targetSpreadCost = amount * (targetSpreadPercent / 100);
  const potentialSavingsPerTransaction = Math.max(0, spreadCost - targetSpreadCost);
  const potentialAnnualSavings = potentialSavingsPerTransaction * 12;
  
  // Generate reason text
  const reasons = [];
  if (highSpread) reasons.push(`Exchange rate markup of ${spreadPercentage.toFixed(2)}% is above typical 0.5-1.0%`);
  if (highFees) reasons.push(`Transaction fees of $${totalFees.toFixed(2)} are higher than industry standard`);
  if (highTotalCost) reasons.push(`Total hidden cost exceeds $${totalHiddenCost.toFixed(2)}`);
  
  return {
    recommended,
    priority,
    reason: reasons.join('. ') + '.',
    suggestedNegotiatedRate: parseFloat(suggestedNegotiatedRate.toFixed(4)),
    targetSpreadPercentage: targetSpreadPercent,
    potentialSavingsPerTransaction: parseFloat(potentialSavingsPerTransaction.toFixed(2)),
    potentialAnnualSavings: parseFloat(potentialAnnualSavings.toFixed(2)),
    disputeLetterGenerated: false,
    disputeLetterText: null
  };
}
