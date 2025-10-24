// Zekta SDK - Cryptocurrency Swaps

export interface Currency {
  symbol: string;
  name: string;
  network: string;
  hasExtraId: boolean;
}

export interface SwapEstimate {
  estimatedAmount: string;
  rate: string;
  networkFee: string;
}

export interface SwapRange {
  min: number;
  max: number;
}

export interface SwapOrder {
  ok: boolean;
  exchange: {
    id: string;
    addressFrom: string;
    addressTo: string;
    amountFrom: string;
    expectedAmount: string;
    currencyFrom: string;
    currencyTo: string;
    status: string;
  };
}

export interface SwapStatus {
  ok: boolean;
  exchange: {
    id: string;
    status: string;
    amountFrom: string;
    expectedAmount: string;
    currencyFrom: string;
    currencyTo: string;
    addressFrom: string;
    addressTo: string;
    txFrom?: string;
    txTo?: string;
  };
}

/**
 * Get all supported cryptocurrencies for swaps
 */
export async function getCurrencies(apiUrl: string): Promise<Currency[]> {
  const response = await fetch(`${apiUrl}/api/swap/currencies`);
  if (!response.ok) {
    throw new Error(`Failed to get currencies: ${response.statusText}`);
  }
  const data = await response.json();
  return data.currencies;
}

/**
 * Get estimated swap amount
 */
export async function getEstimate(
  apiUrl: string,
  currencyFrom: string,
  currencyTo: string,
  amount: number,
  fixed: boolean = true
): Promise<SwapEstimate> {
  const response = await fetch(`${apiUrl}/api/swap/estimate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currencyFrom, currencyTo, amount, fixed })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to get estimate: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Get min/max swap amounts for a currency pair
 */
export async function getRange(
  apiUrl: string,
  currencyFrom: string,
  currencyTo: string
): Promise<SwapRange> {
  const response = await fetch(
    `${apiUrl}/api/swap/range?currencyFrom=${currencyFrom}&currencyTo=${currencyTo}`
  );
  
  if (!response.ok) {
    throw new Error(`Failed to get range: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Create anonymous swap order
 */
export async function createSwap(
  apiUrl: string,
  fromChain: string,
  toChain: string,
  currencyFrom: string,
  currencyTo: string,
  amountFrom: number,
  addressTo: string,
  userRefundAddress?: string,
  extraIdTo?: string
): Promise<SwapOrder> {
  const response = await fetch(`${apiUrl}/api/swap/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fromChain,
      toChain,
      currencyFrom,
      currencyTo,
      amountFrom,
      addressTo,
      userRefundAddress,
      extraIdTo
    })
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create swap: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Check swap order status
 */
export async function getSwapStatus(
  apiUrl: string,
  exchangeId: string
): Promise<SwapStatus> {
  const response = await fetch(`${apiUrl}/api/swap/exchange/${exchangeId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get swap status: ${response.statusText}`);
  }
  
  return response.json();
}
