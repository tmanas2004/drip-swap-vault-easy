import { useState } from 'react';
import { ChevronDown, Check, Globe } from 'lucide-react';
import { useAccount, useSwitchChain, useChainId } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

export const NetworkSwitcher = () => {
  const { isConnected } = useAccount();
  const { chains, switchChain } = useSwitchChain();
  const chainId = useChainId();

  const currentChain = chains.find(chain => chain.id === chainId);

  const getChainIcon = (chainName: string) => {
    switch (chainName.toLowerCase()) {
      case 'ethereum':
        return '⟠';
      case 'polygon':
        return '◇';
      case 'bnb smart chain':
        return '●';
      case 'arbitrum one':
        return '🔺';
      default:
        return '🔗';
    }
  };

  const getChainColor = (chainName: string) => {
    switch (chainName.toLowerCase()) {
      case 'ethereum':
        return 'text-blue-400';
      case 'polygon':
        return 'text-purple-400';
      case 'bnb smart chain':
        return 'text-yellow-400';
      case 'arbitrum one':
        return 'text-cyan-400';
      default:
        return 'text-muted-foreground';
    }
  };

  if (!isConnected) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Globe className="w-4 h-4" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <span className={`text-lg ${getChainColor(currentChain?.name || '')}`}>
            {getChainIcon(currentChain?.name || '')}
          </span>
          <span className="hidden sm:inline">{currentChain?.name || 'Unknown'}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {chains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className="flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2">
              <span className={`text-lg ${getChainColor(chain.name)}`}>
                {getChainIcon(chain.name)}
              </span>
              <span>{chain.name}</span>
            </div>
            {chain.id === chainId && (
              <Check className="w-4 h-4 text-success" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};