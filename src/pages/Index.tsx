import { useState } from "react";
import { WalletHeader } from "@/components/WalletHeader";
import { WalletNavigation } from "@/components/WalletNavigation";
import { PortfolioDashboard } from "@/components/PortfolioDashboard";
import { MarketInsights } from "@/components/MarketInsights";
import { WalletActions } from "@/components/WalletActions";
import walletHero from "@/assets/wallet-hero.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("portfolio");

  const renderContent = () => {
    switch (activeTab) {
      case "portfolio":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PortfolioDashboard />
            </div>
            <div>
              <WalletActions />
            </div>
          </div>
        );
      case "market":
        return <MarketInsights />;
      case "defi":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-lg bg-gradient-primary p-8 text-center">
                  <img 
                    src={walletHero} 
                    alt="DeFi Vault" 
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                  />
                  <div className="relative z-10">
                    <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                      DeFi Vault
                    </h2>
                    <p className="text-primary-foreground/90 mb-6">
                      Maximize your crypto earnings with our advanced DeFi strategies
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-primary-foreground">
                      <div>
                        <div className="text-2xl font-bold">15.7%</div>
                        <div className="text-sm opacity-90">Average APY</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">$2.4M</div>
                        <div className="text-sm opacity-90">Total Locked</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm opacity-90">Protocols</div>
                      </div>
                    </div>
                  </div>
                </div>
                <PortfolioDashboard />
              </div>
            </div>
            <div>
              <WalletActions />
            </div>
          </div>
        );
      case "analytics":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PortfolioDashboard />
            <MarketInsights />
          </div>
        );
      default:
        return <PortfolioDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <WalletHeader />
      <WalletNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto p-4 pb-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
