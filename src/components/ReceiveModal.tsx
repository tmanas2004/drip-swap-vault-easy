import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, Share } from 'lucide-react';
import { useAccount } from 'wagmi';
import { useToast } from '@/components/ui/use-toast';
import QRCode from 'qrcode';
import { useEffect, useRef } from 'react';

interface ReceiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NETWORKS = [
  { name: 'Ethereum', symbol: 'ETH', chainId: 1 },
  { name: 'Polygon', symbol: 'MATIC', chainId: 137 },
  { name: 'BSC', symbol: 'BNB', chainId: 56 },
  { name: 'Arbitrum', symbol: 'ARB', chainId: 42161 },
];

export const ReceiveModal = ({ isOpen, onClose }: ReceiveModalProps) => {
  const { address } = useAccount();
  const { toast } = useToast();
  const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');
  const [amount, setAmount] = useState('');
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && address && qrCanvasRef.current) {
      generateQRCode();
    }
  }, [isOpen, address, selectedNetwork, amount]);

  const generateQRCode = async () => {
    if (!address || !qrCanvasRef.current) return;

    try {
      const qrData = amount 
        ? `ethereum:${address}?value=${amount}`
        : address;
      
      await QRCode.toCanvas(qrCanvasRef.current, qrData, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const copyAddress = async () => {
    if (!address) return;
    
    try {
      await navigator.clipboard.writeText(address);
      toast({
        title: "Address copied!",
        description: "Wallet address has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please copy the address manually",
        variant: "destructive",
      });
    }
  };

  const shareAddress = async () => {
    if (!address) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wallet Address',
          text: `Send crypto to this address: ${address}`,
        });
      } catch (error) {
        copyAddress();
      }
    } else {
      copyAddress();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Receive Crypto
          </DialogTitle>
          <DialogDescription>
            Share your wallet address to receive cryptocurrency
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="network">Network</Label>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger>
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {NETWORKS.map((network) => (
                  <SelectItem key={network.name} value={network.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs">
                        {network.symbol.slice(0, 2)}
                      </div>
                      {network.name} ({network.symbol})
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Optional)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0 ETH"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="text-xs text-muted-foreground">
              Specify an amount to include in the QR code
            </div>
          </div>

          {address && (
            <>
              <div className="flex justify-center py-4">
                <canvas 
                  ref={qrCanvasRef}
                  className="border border-border rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label>Your Wallet Address</Label>
                <div className="flex gap-2">
                  <Input
                    value={address}
                    readOnly
                    className="flex-1 text-xs"
                  />
                  <Button variant="outline" size="icon" onClick={copyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={shareAddress}>
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="bg-muted/30 rounded-lg p-3 text-center">
                <div className="text-sm text-muted-foreground">
                  ⚠️ Only send {selectedNetwork} network tokens to this address
                </div>
              </div>
            </>
          )}

          <Button onClick={onClose} variant="outline" className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};