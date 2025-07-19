import { TrendingUp, TrendingDown, Activity, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const MarketInsights = () => {
  const marketData = [
    { symbol: "BTC", name: "Bitcoin", price: 43567.89, change: 3.45, volume: "28.5B", cap: "854.2B", trending: true },
    { symbol: "ETH", name: "Ethereum", price: 2678.45, change: -1.23, volume: "15.7B", cap: "321.8B", trending: true },
    { symbol: "SOL", name: "Solana", price: 98.76, change: 8.92, volume: "2.1B", cap: "42.3B", trending: true },
    { symbol: "AVAX", name: "Avalanche", price: 34.21, change: -2.14, volume: "487M", cap: "12.5B", trending: false },
    { symbol: "MATIC", name: "Polygon", price: 0.89, change: 5.67, volume: "356M", cap: "8.2B", trending: false },
  ];

  const topGainers = [
    { symbol: "PEPE", change: 45.67 },
    { symbol: "SHIB", change: 23.45 },
    { symbol: "DOGE", change: 18.92 },
  ];

  const topLosers = [
    { symbol: "FTT", change: -12.34 },
    { symbol: "LUNA", change: -8.76 },
    { symbol: "UST", change: -6.54 },
  ];

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Market Cap</div>
                <div className="text-2xl font-bold text-foreground">$1.67T</div>
                <div className="flex items-center gap-1 text-success text-sm">
                  <TrendingUp className="w-3 h-3" />
                  +2.45%
                </div>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">24h Volume</div>
                <div className="text-2xl font-bold text-foreground">$89.5B</div>
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <TrendingDown className="w-3 h-3" />
                  -1.23%
                </div>
              </div>
              <Activity className="w-8 h-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Fear & Greed</div>
                <div className="text-2xl font-bold text-foreground">72</div>
                <div className="text-sm text-success">Greed</div>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trending Cryptocurrencies */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Trending Cryptocurrencies
            </CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-0">
            {marketData.map((coin) => (
              <div
                key={coin.symbol}
                className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">{coin.symbol.substring(0, 2)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{coin.symbol}</span>
                      {coin.trending && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">{coin.name}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-foreground">
                    ${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className={`text-sm ${coin.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {coin.change >= 0 ? '+' : ''}{coin.change}%
                  </div>
                </div>

                <div className="text-right text-sm text-muted-foreground hidden md:block">
                  <div>Vol: ${coin.volume}</div>
                  <div>Cap: ${coin.cap}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gainers & Losers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-success flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top Gainers 24h
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topGainers.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between">
                <span className="font-medium text-foreground">{coin.symbol}</span>
                <span className="text-success font-semibold">+{coin.change}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-destructive flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Top Losers 24h
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {topLosers.map((coin) => (
              <div key={coin.symbol} className="flex items-center justify-between">
                <span className="font-medium text-foreground">{coin.symbol}</span>
                <span className="text-destructive font-semibold">{coin.change}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};