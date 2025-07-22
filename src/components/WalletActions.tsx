import { Send, Download, ArrowUpDown, CreditCard, QrCode, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SwapInterface } from "@/components/SwapInterface";
import { SendModal } from "@/components/SendModal";
import { ReceiveModal } from "@/components/ReceiveModal";
import { QRScanner } from "@/components/QRScanner";
import { RecentTransactions } from "@/components/RecentTransactions";
import { useState } from "react";

export const WalletActions = () => {
  const [showSwap, setShowSwap] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [showReceive, setShowReceive] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  if (showSwap) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => setShowSwap(false)}
          className="mb-4"
        >
          ← Back to Actions
        </Button>
        <SwapInterface />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="wallet" 
              className="flex-col h-20 gap-2"
              onClick={() => setShowSend(true)}
            >
              <Send className="w-6 h-6 text-primary" />
              <span className="text-sm">Send</span>
            </Button>
            <Button 
              variant="wallet" 
              className="flex-col h-20 gap-2"
              onClick={() => setShowReceive(true)}
            >
              <Download className="w-6 h-6 text-success" />
              <span className="text-sm">Receive</span>
            </Button>
            <Button 
              variant="wallet" 
              className="flex-col h-20 gap-2"
              onClick={() => setShowSwap(true)}
            >
              <ArrowUpDown className="w-6 h-6 text-accent" />
              <span className="text-sm">Swap</span>
            </Button>
            <Button variant="wallet" className="flex-col h-20 gap-2">
              <CreditCard className="w-6 h-6 text-purple-400" />
              <span className="text-sm">Buy</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* DeFi Features */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              DeFi Vault
              <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">
                New
              </Badge>
            </CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Add Protocol
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Staking Rewards</h3>
                <Badge variant="secondary" className="text-success">Active</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">12.5% APY</div>
              <div className="text-sm text-muted-foreground">Ethereum 2.0 Staking</div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Staked: </span>
                <span className="text-foreground font-medium">8.2 ETH</span>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-foreground">Liquidity Pool</h3>
                <Badge variant="secondary" className="text-primary">Earning</Badge>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">8.7% APR</div>
              <div className="text-sm text-muted-foreground">USDC/ETH LP</div>
              <div className="mt-3 flex justify-between text-sm">
                <span className="text-muted-foreground">Provided: </span>
                <span className="text-foreground font-medium">$12,450</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <RecentTransactions />
        </CardContent>
      </Card>

      {/* QR Code Scanner */}
      <Card className="shadow-card">
        <CardContent className="p-6 text-center">
          <QrCode className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="font-semibold text-foreground mb-2">Quick Payment</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Scan QR codes to send payments instantly
          </p>
          <Button 
            variant="gradient" 
            className="w-full"
            onClick={() => setShowQRScanner(true)}
          >
            <QrCode className="w-4 h-4 mr-2" />
            Scan QR Code
          </Button>
        </CardContent>
      </Card>

      {/* Modals */}
      <SendModal isOpen={showSend} onClose={() => setShowSend(false)} />
      <ReceiveModal isOpen={showReceive} onClose={() => setShowReceive(false)} />
      <QRScanner 
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={(result) => {
          console.log('QR Scanned:', result);
          setShowQRScanner(false);
        }}
      />
    </div>
  );
};