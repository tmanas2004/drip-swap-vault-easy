import { ArrowUpRight, ArrowDownRight, TrendingUp, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export const PortfolioDashboard = () => {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const portfolioData = {
    totalBalance: 45672.89,
    totalChangePercent: 5.67,
    totalChangeAmount: 2456.78,
    assets: [
      { symbol: "BTC", name: "Bitcoin", amount: 0.75, value: 28945.67, change: 3.45, icon: "₿" },
      { symbol: "ETH", name: "Ethereum", amount: 8.2, value: 12567.45, change: -1.23, icon: "Ξ" },
      { symbol: "USDT", name: "Tether", amount: 3456.78, value: 3456.78, change: 0.01, icon: "₮" },
      { symbol: "BNB", name: "BNB", amount: 15.6, value: 892.34, change: 8.92, icon: "◆" },
    ]
  };

  const formatCurrency = (amount: number) => {
    if (isBalanceHidden) return "****";
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-6">
      {/* Total Portfolio Value */}
      <Card className="bg-gradient-secondary border-border shadow-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Portfolio Value
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsBalanceHidden(!isBalanceHidden)}
              className="h-6 w-6"
            >
              {isBalanceHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(portfolioData.totalBalance)}
            </div>
            <div className="flex items-center gap-2">
              <div className={`flex items-center gap-1 ${portfolioData.totalChangePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                {portfolioData.totalChangePercent >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {portfolioData.totalChangePercent >= 0 ? '+' : ''}{portfolioData.totalChangePercent}%
                </span>
              </div>
              <span className={`text-sm ${portfolioData.totalChangeAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(Math.abs(portfolioData.totalChangeAmount))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets List */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Your Assets
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {portfolioData.assets.length} Assets
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {portfolioData.assets.map((asset) => (
              <div
                key={asset.symbol}
                className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {asset.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{asset.symbol}</div>
                    <div className="text-sm text-muted-foreground">{asset.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-foreground">
                    {formatCurrency(asset.value)}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">
                      {isBalanceHidden ? "****" : asset.amount.toLocaleString()} {asset.symbol}
                    </span>
                    <div className={`flex items-center gap-1 ml-2 ${asset.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {asset.change >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      <span>
                        {asset.change >= 0 ? '+' : ''}{asset.change}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};