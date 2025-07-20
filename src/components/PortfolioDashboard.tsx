import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Eye, EyeOff, RefreshCw } from "lucide-react";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useCurrency } from "@/hooks/useCurrency";
import { useAccount } from "wagmi";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export const PortfolioDashboard = () => {
  const { address } = useAccount();
  const { balances, totalValue, isLoading, refetch } = useTokenBalances();
  const { formatPrice } = useCurrency();
  const [showBalance, setShowBalance] = useState(true);

  const averageChange = balances.length > 0 
    ? balances.reduce((sum, token) => sum + token.change24h, 0) / balances.length 
    : 2.5;

  return (
    <div className="space-y-6">
      {/* Total Portfolio */}
      <Card className="bg-gradient-secondary border-border shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Portfolio Value
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={refetch}
                disabled={isLoading}
                className="h-6 w-6"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="h-6 w-6"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {isLoading ? (
              <div className="animate-pulse bg-muted h-8 w-40 rounded"></div>
            ) : (
              <div className="text-3xl font-bold text-foreground">
                {showBalance ? formatPrice(totalValue) : '••••••'}
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${averageChange >= 0 ? 'text-success' : 'text-destructive'}`}>
                {averageChange >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {averageChange >= 0 ? '+' : ''}{averageChange.toFixed(2)}%
                </span>
              </div>
              <span className="text-sm text-muted-foreground">24h</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Assets
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {balances.length} Assets {address && "• Live Data"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border rounded-lg animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full"></div>
                    <div className="space-y-1">
                      <div className="w-16 h-4 bg-muted rounded"></div>
                      <div className="w-12 h-3 bg-muted rounded"></div>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="w-20 h-4 bg-muted rounded"></div>
                    <div className="w-16 h-3 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : balances.length > 0 ? (
            <div className="space-y-3">
              {balances.map((token, index) => (
                <div
                  key={`${token.symbol}-${token.address}`}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {token.symbol.slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{token.symbol}</div>
                      <div className="text-sm text-muted-foreground">
                        {token.balance.toFixed(6)} {token.symbol}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-foreground">
                      {showBalance ? formatPrice(token.usdValue) : '••••'}
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${
                      token.change24h >= 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {token.change24h >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {Math.abs(token.change24h).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-muted-foreground mb-2">No tokens found</div>
              <div className="text-sm text-muted-foreground">
                {address ? 'Connect to a different network or add tokens' : 'Connect your wallet to see your portfolio'}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Portfolio Allocation */}
      {balances.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {balances.slice(0, 5).map((token) => {
              const percentage = totalValue > 0 ? (token.usdValue / totalValue) * 100 : 0;
              return (
                <div key={token.symbol} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">{token.symbol}</span>
                    <span className="text-muted-foreground">{percentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};