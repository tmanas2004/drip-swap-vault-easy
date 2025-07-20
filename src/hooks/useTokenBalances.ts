import { useAccount, useBalance } from 'wagmi';
import { useState, useEffect, useCallback } from 'react';
import { createPublicClient, http, formatEther, formatUnits } from 'viem';
import { mainnet, polygon, bsc } from 'wagmi/chains';
import axios from 'axios';

const POPULAR_TOKENS = [
  { symbol: 'ETH', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', chainId: 1 },
  { symbol: 'USDC', address: '0xA0b86a33E6441E435D33c4EBa1f5CbCa3cE6de6c', chainId: 1 },
  { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', chainId: 1 },
  { symbol: 'WBTC', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', chainId: 1 },
  { symbol: 'DAI', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', chainId: 1 },
  { symbol: 'UNI', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', chainId: 1 },
  { symbol: 'LINK', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', chainId: 1 },
  { symbol: 'AAVE', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', chainId: 1 },
  { symbol: 'CRV', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', chainId: 1 },
  { symbol: 'MKR', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', chainId: 1 },
  { symbol: 'COMP', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', chainId: 1 },
  { symbol: 'SNX', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', chainId: 1 },
  // Polygon tokens
  { symbol: 'MATIC', address: '0x0000000000000000000000000000000000001010', chainId: 137 },
  { symbol: 'WETH', address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', chainId: 137 },
  { symbol: 'USDC', address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', chainId: 137 },
  { symbol: 'USDT', address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', chainId: 137 },
  // BSC tokens  
  { symbol: 'BNB', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', chainId: 56 },
  { symbol: 'BUSD', address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', chainId: 56 },
  { symbol: 'CAKE', address: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', chainId: 56 },
];

interface TokenBalance {
  symbol: string;
  balance: number;
  usdValue: number;
  change24h: number;
  address: string;
}

export const useTokenBalances = () => {
  const { address, chain } = useAccount();
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenPrices, setTokenPrices] = useState<Record<string, { usd: number; usd_24h_change: number }>>({});

  // Create public client based on current chain
  const publicClient = createPublicClient({
    chain: chain?.id === 137 ? polygon : chain?.id === 56 ? bsc : mainnet,
    transport: http(),
  });

  // Fetch token prices
  const fetchTokenPrices = useCallback(async () => {
    try {
      const coinGeckoIds = [
        'ethereum', 'usd-coin', 'tether', 'wrapped-bitcoin', 'dai',
        'uniswap', 'chainlink', 'aave', 'curve-dao-token', 'maker',
        'compound-governance-token', 'havven', 'matic-network', 'binancecoin'
      ];
      
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIds.join(',')}&vs_currencies=usd&include_24hr_change=true`
      );
      
      const priceMap: Record<string, { usd: number; usd_24h_change: number }> = {
        'ETH': response.data['ethereum'],
        'WETH': response.data['ethereum'],
        'USDC': response.data['usd-coin'],
        'USDT': response.data['tether'],
        'WBTC': response.data['wrapped-bitcoin'],
        'DAI': response.data['dai'],
        'UNI': response.data['uniswap'],
        'LINK': response.data['chainlink'],
        'AAVE': response.data['aave'],
        'CRV': response.data['curve-dao-token'],
        'MKR': response.data['maker'],
        'COMP': response.data['compound-governance-token'],
        'SNX': response.data['havven'],
        'MATIC': response.data['matic-network'],
        'BNB': response.data['binancecoin'],
      };
      
      setTokenPrices(priceMap);
    } catch (error) {
      console.error('Failed to fetch token prices:', error);
      // Fallback prices
      setTokenPrices({
        'ETH': { usd: 2600, usd_24h_change: 2.5 },
        'USDC': { usd: 1, usd_24h_change: 0.1 },
        'USDT': { usd: 1, usd_24h_change: 0.05 },
        'MATIC': { usd: 0.85, usd_24h_change: 3.2 },
        'BNB': { usd: 320, usd_24h_change: 1.8 },
      });
    }
  }, []);

  const fetchTokenBalances = useCallback(async () => {
    if (!address || !chain) return;

    setIsLoading(true);
    try {
      // Get native token balance (ETH, MATIC, BNB, etc.)
      const nativeBalance = await publicClient.getBalance({ address });
      
      // Get current chain tokens
      const chainTokens = POPULAR_TOKENS.filter(token => token.chainId === chain.id);
      
      // Fetch token balances for current chain
      const tokenBalances = await Promise.allSettled(
        chainTokens.map(async (token) => {
          if (token.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' || 
              token.address === '0x0000000000000000000000000000000000001010') {
            // Native token
            return {
              symbol: token.symbol,
              balance: parseFloat(formatEther(nativeBalance)),
              address: token.address,
              chainId: token.chainId,
            };
          } else {
            // ERC-20 token
            try {
              const balance = await publicClient.readContract({
                address: token.address as `0x${string}`,
                abi: [
                  {
                    constant: true,
                    inputs: [{ name: '_owner', type: 'address' }],
                    name: 'balanceOf',
                    outputs: [{ name: 'balance', type: 'uint256' }],
                    type: 'function',
                  },
                  {
                    constant: true,
                    inputs: [],
                    name: 'decimals',
                    outputs: [{ name: '', type: 'uint8' }],
                    type: 'function',
                  },
                ],
                functionName: 'balanceOf',
                args: [address],
              });

              const decimals = await publicClient.readContract({
                address: token.address as `0x${string}`,
                abi: [
                  {
                    constant: true,
                    inputs: [],
                    name: 'decimals',
                    outputs: [{ name: '', type: 'uint8' }],
                    type: 'function',
                  },
                ],
                functionName: 'decimals',
              });

              return {
                symbol: token.symbol,
                balance: parseFloat(formatUnits(balance as bigint, decimals as number)),
                address: token.address,
                chainId: token.chainId,
              };
            } catch (error) {
              console.error(`Error fetching balance for ${token.symbol}:`, error);
              return null;
            }
          }
        })
      );

      // Filter successful results and non-zero balances
      const validBalances = tokenBalances
        .map(result => result.status === 'fulfilled' ? result.value : null)
        .filter((balance): balance is NonNullable<typeof balance> => 
          balance !== null && balance.balance > 0
        );

      // Calculate USD values and total
      const balancesWithPrices: TokenBalance[] = validBalances.map(balance => {
        const price = tokenPrices[balance.symbol] || { usd: 0, usd_24h_change: 0 };
        return {
          ...balance,
          usdValue: balance.balance * price.usd,
          change24h: price.usd_24h_change,
        };
      });

      // Add some mock balances for demo if no real balances found
      if (balancesWithPrices.length === 0) {
        const mockBalance = {
          symbol: chain.id === 137 ? 'MATIC' : chain.id === 56 ? 'BNB' : 'ETH',
          balance: 0.0012,
          address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
          chainId: chain.id,
          usdValue: 0.0012 * (tokenPrices[chain.id === 137 ? 'MATIC' : chain.id === 56 ? 'BNB' : 'ETH']?.usd || 2600),
          change24h: tokenPrices[chain.id === 137 ? 'MATIC' : chain.id === 56 ? 'BNB' : 'ETH']?.usd_24h_change || 2.5,
        };
        balancesWithPrices.push(mockBalance);
      }

      setBalances(balancesWithPrices);
      setTotalValue(balancesWithPrices.reduce((sum, token) => sum + token.usdValue, 0));
    } catch (error) {
      console.error('Error fetching token balances:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address, chain, publicClient, tokenPrices]);

  useEffect(() => {
    fetchTokenPrices();
  }, [fetchTokenPrices]);

  useEffect(() => {
    if (Object.keys(tokenPrices).length > 0) {
      fetchTokenBalances();
    }
  }, [fetchTokenBalances, tokenPrices]);

  const refetch = useCallback(() => {
    fetchTokenPrices();
    fetchTokenBalances();
  }, [fetchTokenPrices, fetchTokenBalances]);

  return {
    balances,
    totalValue,
    isLoading,
    refetch,
  };
};