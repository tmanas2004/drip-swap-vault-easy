import { useState } from 'react';
import { Wallet2, ChevronDown, ExternalLink, Copy, LogOut, Check } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useBalance, useEnsName } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export const WalletConnector = () => {
  const { address, isConnected, connector } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });
  const { data: ensName } = useEnsName({ address });
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal: any) => {
    if (!bal) return '0.00';
    return parseFloat(bal.formatted).toFixed(4);
  };

  const copyAddress = async () => {
    if (address) {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getConnectorIcon = (connectorName: string) => {
    switch (connectorName.toLowerCase()) {
      case 'metamask':
        return '🦊';
      case 'walletconnect':
        return '🔗';
      case 'coinbase wallet':
        return '🔵';
      case 'injected':
        return '💼';
      default:
        return '👛';
    }
  };

  if (!isConnected) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="gradient" className="gap-2">
            <Wallet2 className="w-4 h-4" />
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet2 className="w-5 h-5 text-primary" />
              Connect Your Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {connectors.map((connector) => (
              <Card
                key={connector.uid}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  connect({ connector });
                  setIsOpen(false);
                }}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getConnectorIcon(connector.name)}</span>
                    <div>
                      <div className="font-semibold">{connector.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {connector.name === 'MetaMask' && 'Connect using MetaMask browser extension'}
                        {connector.name === 'WalletConnect' && 'Scan with your mobile wallet'}
                        {connector.name === 'Coinbase Wallet' && 'Connect using Coinbase Wallet'}
                        {connector.name === 'Injected' && 'Connect using browser wallet'}
                      </div>
                    </div>
                  </div>
                  {isPending && <div className="animate-spin">⏳</div>}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4 p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              By connecting a wallet, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="wallet" className="gap-2 max-w-48">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-sm">
              {getConnectorIcon(connector?.name || '')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium truncate">
                {ensName || formatAddress(address || '')}
              </div>
              <div className="text-xs text-muted-foreground">
                {formatBalance(balance)} ETH
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              {getConnectorIcon(connector?.name || '')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">
                {ensName || formatAddress(address || '')}
              </div>
              <Badge variant="secondary" className="text-xs">
                Connected via {connector?.name}
              </Badge>
            </div>
          </div>
          <div className="text-lg font-bold text-foreground">
            {formatBalance(balance)} ETH
          </div>
          <div className="text-sm text-muted-foreground">
            ${((parseFloat(balance?.formatted || '0')) * 2450).toFixed(2)} USD
          </div>
        </div>
        
        <DropdownMenuItem onClick={copyAddress} className="gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>
        
        <DropdownMenuItem className="gap-2">
          <ExternalLink className="w-4 h-4" />
          View on Explorer
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={() => disconnect()}
          className="gap-2 text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};