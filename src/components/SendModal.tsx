import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, QrCode } from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { QRScanner } from './QRScanner';

interface SendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TOKENS = [
  { symbol: 'ETH', name: 'Ethereum', address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' },
  { symbol: 'USDC', name: 'USD Coin', address: '0xA0b86a33E6441E435D33c4EBa1f5CbCa3cE6de6c' },
  { symbol: 'USDT', name: 'Tether USD', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
  { symbol: 'WBTC', name: 'Wrapped Bitcoin', address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599' },
];

export const SendModal = ({ isOpen, onClose }: SendModalProps) => {
  const { address } = useAccount();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState('ETH');
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedTokenData = TOKENS.find(token => token.symbol === selectedToken);
  const { data: balance } = useBalance({
    address,
    token: selectedTokenData?.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' 
      ? undefined 
      : selectedTokenData?.address as `0x${string}`
  });

  const handleQRScan = (result: string) => {
    setRecipient(result);
    setShowQRScanner(false);
  };

  const handleSend = async () => {
    if (!recipient || !amount || !address) return;

    setIsLoading(true);
    try {
      // Mock send functionality - in production, use wagmi's useSendTransaction
      console.log('Sending transaction:', {
        to: recipient,
        amount,
        token: selectedToken,
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert(`Successfully sent ${amount} ${selectedToken} to ${recipient}`);
      onClose();
      setRecipient('');
      setAmount('');
    } catch (error) {
      console.error('Send failed:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatBalance = (balance: any) => {
    if (!balance) return '0.00';
    return parseFloat(balance.formatted).toFixed(6);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Crypto
            </DialogTitle>
            <DialogDescription>
              Send cryptocurrency to another wallet address
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Token</Label>
              <Select value={selectedToken} onValueChange={setSelectedToken}>
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {TOKENS.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                          {token.symbol.slice(0, 2)}
                        </div>
                        {token.name} ({token.symbol})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs text-muted-foreground">
                Balance: {formatBalance(balance)} {selectedToken}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <div className="flex gap-2">
                <Input
                  id="recipient"
                  placeholder="0x..."
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="flex-1"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setShowQRScanner(true)}
                >
                  <QrCode className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleSend} 
                disabled={!recipient || !amount || !address || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QRScanner 
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
    </>
  );
};