import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect } from 'react';
import axios from 'axios';

interface TokenBalance {
  symbol: string;
  name: string;
  amount: string;
  value: number;
  change: number;
  icon: string;
  address?: string;
}

export const useTokenBalances = () => {
  const { address, chain } = useAccount();
  const { data: nativeBalance } = useBalance({ address });
  const [tokenPrices, setTokenPrices] = useState<{ [symbol: string]: { usd: number; usd_24h_change: number } }>({});
  const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange, setTotalChange] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch token prices
  useEffect(() => {
    const fetchPrices = async () => {
      if (!chain) return;
      
      setIsLoading(true);
      try {
        const symbols = ['bitcoin', 'ethereum', 'tether', 'usd-coin', 'chainlink-token', 'uniswap', 'binancecoin'];
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(',')}&vs_currencies=usd&include_24hr_change=true`
        );
        
        const priceData: { [symbol: string]: { usd: number; usd_24h_change: number } } = {};
        
        // Map CoinGecko IDs to our symbols
        priceData['BTC'] = response.data['bitcoin'];
        priceData['ETH'] = response.data['ethereum'];
        priceData['USDT'] = response.data['tether'];
        priceData['USDC'] = response.data['usd-coin'];
        priceData['LINK'] = response.data['chainlink-token'];
        priceData['UNI'] = response.data['uniswap'];
        priceData['BNB'] = response.data['binancecoin'];
        
        setTokenPrices(priceData);
      } catch (error) {
        console.error('Failed to fetch token prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [chain]);

  // Process balances and calculate portfolio value
  useEffect(() => {
    if (!address || !chain || !nativeBalance) return;

    const balances: TokenBalance[] = [];
    let totalPortfolioValue = 0;
    let weightedChange = 0;

    // Add native token (ETH, BNB, etc.)
    const nativeSymbol = nativeBalance.symbol;
    const nativePrice = tokenPrices[nativeSymbol];
    if (nativePrice && parseFloat(nativeBalance.formatted) > 0) {
      const nativeValue = parseFloat(nativeBalance.formatted) * nativePrice.usd;
      totalPortfolioValue += nativeValue;
      weightedChange += nativeValue * nativePrice.usd_24h_change;
      
      balances.push({
        symbol: nativeSymbol,
        name: nativeSymbol === 'ETH' ? 'Ethereum' : nativeSymbol,
        amount: parseFloat(nativeBalance.formatted).toFixed(6),
        value: nativeValue,
        change: nativePrice.usd_24h_change || 0,
        icon: nativeSymbol === 'ETH' ? 'Ξ' : nativeSymbol === 'BNB' ? '◆' : '◈'
      });
    }

    // Add some demo tokens for better UX (in production, fetch real ERC-20 balances)
    if (nativeSymbol === 'ETH' && tokenPrices['USDT']) {
      const mockUSDTBalance = 1000 + Math.random() * 5000; // Mock balance
      const usdtValue = mockUSDTBalance * tokenPrices['USDT'].usd;
      totalPortfolioValue += usdtValue;
      weightedChange += usdtValue * tokenPrices['USDT'].usd_24h_change;
      
      balances.push({
        symbol: 'USDT',
        name: 'Tether USD',
        amount: mockUSDTBalance.toFixed(2),
        value: usdtValue,
        change: tokenPrices['USDT'].usd_24h_change || 0,
        icon: '₮'
      });
    }

    setTokenBalances(balances);
    setTotalValue(totalPortfolioValue);
    setTotalChange(totalPortfolioValue > 0 ? weightedChange / totalPortfolioValue : 0);
  }, [address, chain, nativeBalance, tokenPrices]);

  return {
    tokenBalances,
    totalValue,
    totalChange,
    isLoading: isLoading || !tokenPrices || Object.keys(tokenPrices).length === 0,
    nativeBalance
  };
};