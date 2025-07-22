import { useState, useEffect } from 'react';
import { Send, Download, ArrowUpDown, Plus, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAccount, usePublicClient } from 'wagmi';
import { useCurrency } from '@/hooks/useCurrency';

interface Transaction {
  hash: string;
  type: 'Received' | 'Sent' | 'Swapped' | 'Staking';
  asset: string;
  amount: string;
  value: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  from?: string;
  to?: string;
}

export const RecentTransactions = () => {
  const { address, chain } = useAccount();
  const { formatPrice } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch recent transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address || !chain) return;
      
      setIsLoading(true);
      try {
        // In production, you would fetch from blockchain explorer APIs
        // For now, using mock data with realistic transaction patterns
        const mockTransactions: Transaction[] = [
          {
            hash: '0x1234...5678',
            type: 'Received',
            asset: 'ETH',
            amount: '+0.025',
            value: `+${formatPrice(1089.23)}`,
            time: '2 min ago',
            status: 'completed',
            from: '0xabc...def',
            to: address
          },
          {
            hash: '0x2345...6789',
            type: 'Swapped',
            asset: 'ETH → USDT',
            amount: '2.1 → 5,678',
            value: formatPrice(5678.00),
            time: '1 hour ago',
            status: 'completed'
          },
          {
            hash: '0x3456...789a',
            type: 'Sent',
            asset: 'USDC',
            amount: '-500',
            value: `-${formatPrice(500.00)}`,
            time: '3 hours ago',
            status: 'completed',
            from: address,
            to: '0x123...456'
          },
          {
            hash: '0x4567...89ab',
            type: 'Staking',
            asset: 'ETH',
            amount: '+0.15',
            value: `+${formatPrice(401.70)}`,
            time: '1 day ago',
            status: 'completed'
          },
          {
            hash: '0x5678...9abc',
            type: 'Received',
            asset: 'POL',
            amount: '+1,250',
            value: `+${formatPrice(867.50)}`,
            time: '2 days ago',
            status: 'completed',
            from: '0xdef...ghi',
            to: address
          },
          {
            hash: '0x6789...abcd',
            type: 'Swapped',
            asset: 'BNB → USDC',
            amount: '5.2 → 1,248',
            value: formatPrice(1248.00),
            time: '3 days ago',
            status: 'completed'
          }
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
        // Fallback to empty array on error
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [address, chain, formatPrice]);

  const getExplorerUrl = (hash: string) => {
    if (!chain) return '#';
    
    // Chain explorer URLs
    const explorers: Record<number, string> = {
      1: 'https://etherscan.io',
      137: 'https://polygonscan.com',
      56: 'https://bscscan.com',
      42161: 'https://arbiscan.io',
      10: 'https://optimistic.etherscan.io'
    };
    
    const baseUrl = explorers[chain.id] || 'https://etherscan.io';
    return `${baseUrl}/tx/${hash}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-0">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 border-b border-border last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
              <div className="space-y-2">
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                <div className="h-3 w-16 bg-muted animate-pulse rounded" />
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="h-4 w-16 bg-muted animate-pulse rounded" />
              <div className="h-3 w-12 bg-muted animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!address) {
    return (
      <div className="p-8 text-center">
        <div className="text-muted-foreground">
          Connect your wallet to view transaction history
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-muted-foreground">
          No transactions found for this wallet
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {transactions.map((tx) => (
        <div
          key={tx.hash}
          className="flex items-center justify-between p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              tx.type === "Received" ? "bg-success/20" :
              tx.type === "Sent" ? "bg-destructive/20" :
              tx.type === "Swapped" ? "bg-accent/20" :
              "bg-primary/20"
            }`}>
              {tx.type === "Received" && <Download className="w-5 h-5 text-success" />}
              {tx.type === "Sent" && <Send className="w-5 h-5 text-destructive" />}
              {tx.type === "Swapped" && <ArrowUpDown className="w-5 h-5 text-accent" />}
              {tx.type === "Staking" && <Plus className="w-5 h-5 text-primary" />}
            </div>
            <div>
              <div className="font-semibold text-foreground flex items-center gap-2">
                {tx.type}
                <a
                  href={getExplorerUrl(tx.hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="w-3 h-3 text-muted-foreground hover:text-primary" />
                </a>
              </div>
              <div className="text-sm text-muted-foreground">{tx.asset}</div>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`font-semibold ${
              tx.type === "Received" || tx.type === "Staking" ? "text-success" : 
              tx.type === "Sent" ? "text-destructive" : "text-foreground"
            }`}>
              {tx.amount}
            </div>
            <div className="text-sm text-muted-foreground">{tx.value}</div>
          </div>
          
          <div className="text-right text-sm text-muted-foreground hidden md:block">
            <div>{tx.time}</div>
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                tx.status === 'completed' ? 'text-success' :
                tx.status === 'pending' ? 'text-warning' :
                'text-destructive'
              }`}
            >
              {tx.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};