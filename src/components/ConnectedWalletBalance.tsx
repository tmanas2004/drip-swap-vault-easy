import { useAccount, useBalance } from 'wagmi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ConnectedWalletBalance = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: balance, isLoading } = useBalance({ address });

  if (!isConnected || !address) {
    return null;
  }

  const formatBalance = (bal: any) => {
    if (!bal) return '0.00';
    return parseFloat(bal.formatted).toFixed(6);
  };

  const getExplorerUrl = () => {
    if (!chain || !address) return '#';
    
    const explorers: { [key: number]: string } = {
      1: 'https://etherscan.io/address/',
      137: 'https://polygonscan.com/address/',
      56: 'https://bscscan.com/address/',
      42161: 'https://arbiscan.io/address/',
    };
    
    return explorers[chain.id] ? `${explorers[chain.id]}${address}` : '#';
  };

  return (
    <Card className="shadow-card border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wallet2 className="w-5 h-5 text-primary" />
            Connected Wallet
          </CardTitle>
          <Badge variant="secondary" className="bg-success/20 text-success">
            Live Balance
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Chain</div>
            <div className="font-semibold text-foreground">{chain?.name || 'Unknown'}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Native Balance</div>
            <div className="font-bold text-foreground">
              {isLoading ? (
                <div className="animate-pulse bg-muted h-6 w-20 rounded"></div>
              ) : (
                `${formatBalance(balance)} ${balance?.symbol || 'ETH'}`
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-sm text-muted-foreground">
            {address?.slice(0, 8)}...{address?.slice(-6)}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.open(getExplorerUrl(), '_blank')}
            className="gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Explorer
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};