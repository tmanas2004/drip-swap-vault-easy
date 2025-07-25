import { Wallet, Bell, Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletConnector } from "@/components/WalletConnector";
import { NetworkSwitcher } from "@/components/NetworkSwitcher";
import { CurrencySettings } from "@/components/CurrencySettings";
import { useState } from "react";

export const WalletHeader = () => {
  const [showCurrencySettings, setShowCurrencySettings] = useState(false);
  return (
    <header className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DripSwapWallet
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NetworkSwitcher />
          <WalletConnector />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowCurrencySettings(true)}
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <CurrencySettings 
        isOpen={showCurrencySettings} 
        onClose={() => setShowCurrencySettings(false)} 
      />
    </header>
  );
};