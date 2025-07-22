import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, RefreshCw, Zap } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { useCurrency } from '@/hooks/useCurrency';
import axios from 'axios';

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI?: string;
}

interface SwapQuote {
  fromTokenAmount: string;
  toTokenAmount: string;
  estimatedGas: string;
  price: string;
}

const POPULAR_TOKENS: Token[] = [
  { symbol: 'ETH', name: 'Ethereum', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', decimals: 18 },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86a33E6441E435D33c4EBa1f5CbCa3cE6de6c', decimals: 6 },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', decimals: 8 },
  { symbol: 'DAI', name: 'Dai Stablecoin', address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', decimals: 18 },
  { symbol: 'UNI', name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', decimals: 18 },
  { symbol: 'LINK', name: 'Chainlink', address: '0x514910771AF9Ca656af840dff83E8264EcF986CA', decimals: 18 },
  { symbol: 'AAVE', name: 'Aave', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', decimals: 18 },
  { symbol: 'CRV', name: 'Curve DAO Token', address: '0xD533a949740bb3306d119CC777fa900bA034cd52', decimals: 18 },
  { symbol: 'MKR', name: 'Maker', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', decimals: 18 },
  { symbol: 'COMP', name: 'Compound', address: '0xc00e94Cb662C3520282E6f5717214004A7f26888', decimals: 18 },
  { symbol: 'SNX', name: 'Synthetix', address: '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F', decimals: 18 },
];

export const SwapInterface = () => {
  const { address, chain } = useAccount();
  const { formatPrice } = useCurrency();
  const [fromToken, setFromToken] = useState<Token>(POPULAR_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(POPULAR_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [showTokenSelector, setShowTokenSelector] = useState<'from' | 'to' | null>(null);
  const [gaslessEnabled, setGaslessEnabled] = useState(true);

  const { data: fromTokenBalance } = useBalance({
    address,
    token: fromToken.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ? undefined : fromToken.address as `0x${string}`
  });

  // Get quote with perfect 1:1 rate (truly free swap)
  const getSwapQuote = async (from: Token, to: Token, amount: string) => {
    if (!amount || !address || !chain) return;

    setIsLoadingQuote(true);
    try {
      // Perfect 1:1 exchange rate - no fees, no slippage
      const perfectQuote: SwapQuote = {
        fromTokenAmount: amount,
        toTokenAmount: amount, // Exact 1:1 exchange
        estimatedGas: '0', // Free with gasless toggle
        price: '1.000' // Perfect 1:1 rate
      };
      
      setQuote(perfectQuote);
      setToAmount(perfectQuote.toTokenAmount);
    } catch (error) {
      console.error('Failed to get swap quote:', error);
    } finally {
      setIsLoadingQuote(false);
    }
  };

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      const debounceTimer = setTimeout(() => {
        getSwapQuote(fromToken, toToken, fromAmount);
      }, 500);
      return () => clearTimeout(debounceTimer);
    } else {
      setToAmount('');
      setQuote(null);
    }
  }, [fromAmount, fromToken, toToken, address, chain]);

  const handleSwapTokens = () => {
    const tempToken = fromToken;
    setFromToken(toToken);
    setToToken(tempToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleTokenSelect = (token: Token) => {
    if (showTokenSelector === 'from') {
      setFromToken(token);
    } else if (showTokenSelector === 'to') {
      setToToken(token);
    }
    setShowTokenSelector(null);
  };

  const executeSwap = async () => {
    if (!quote || !address) return;

    try {
      // Perfect 1:1 swap execution
      console.log('Executing perfect swap:', {
        from: fromToken,
        to: toToken,
        amount: fromAmount,
        quote,
        fee: '0%',
        gasless: gaslessEnabled
      });
      
      // Mock success for perfect swap
      alert(`Perfect swap executed! ${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol} (1:1 rate, no fees!)`);
    } catch (error) {
      console.error('Swap failed:', error);
      alert('Swap failed. Please try again.');
    }
  };

  const formatBalance = (balance: any) => {
    if (!balance) return '0.00';
    return parseFloat(balance.formatted).toFixed(6);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUpDown className="w-5 h-5 text-primary" />
          Swap Tokens
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* From Token */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">From</span>
            <span className="text-xs text-muted-foreground">
              Balance: {formatBalance(fromTokenBalance)} {fromToken.symbol}
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTokenSelector('from')}
              className="min-w-24"
            >
              {fromToken.symbol}
            </Button>
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwapTokens}
            className="rounded-full bg-muted hover:bg-muted/80"
          >
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>

        {/* To Token */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">To</span>
            {quote && (
              <span className="text-xs text-muted-foreground">
                Rate: 1 {fromToken.symbol} = {quote.price} {toToken.symbol}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowTokenSelector('to')}
              className="min-w-24"
            >
              {toToken.symbol}
            </Button>
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="flex-1"
            />
          </div>
        </div>

        {/* Token Selector Modal */}
        {showTokenSelector && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="w-80 max-h-96 overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">Select Token</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTokenSelector(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {POPULAR_TOKENS.map((token) => (
                  <Button
                    key={token.address}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => handleTokenSelect(token)}
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      {token.symbol.slice(0, 2)}
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-muted-foreground">{token.name}</div>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Gasless Toggle */}
        <div className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Gasless Swap</span>
          </div>
          <Button
            variant={gaslessEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setGaslessEnabled(!gaslessEnabled)}
          >
            {gaslessEnabled ? "Enabled" : "Disabled"}
          </Button>
        </div>

        {/* Swap Quote Info */}
        {quote && (
          <div className="bg-muted/30 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimated Gas</span>
              <span className={gaslessEnabled ? "line-through text-muted-foreground" : ""}>
                {gaslessEnabled ? "Free" : quote.estimatedGas}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price Impact</span>
              <span className="text-success">0.0%</span>
            </div>
            {gaslessEnabled && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sponsor</span>
                <span className="text-primary">DripSwap Protocol</span>
              </div>
            )}
          </div>
        )}

        {/* Swap Button */}
        <Button
          onClick={executeSwap}
          disabled={!quote || !address || isLoadingQuote}
          className="w-full"
          variant={gaslessEnabled ? "gradient" : "default"}
        >
          {isLoadingQuote ? (
            <RefreshCw className="w-4 h-4 animate-spin mr-2" />
          ) : gaslessEnabled ? (
            <Zap className="w-4 h-4 mr-2" />
          ) : null}
          {!address ? 'Connect Wallet' : 
           isLoadingQuote ? 'Getting Quote...' : 
           gaslessEnabled ? 'Gasless Swap' : 'Swap Tokens'}
        </Button>
      </CardContent>
    </Card>
  );
};