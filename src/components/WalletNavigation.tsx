import { Wallet, TrendingUp, CreditCard, Settings, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const WalletNavigation = ({ activeTab, onTabChange }: WalletNavigationProps) => {
  const tabs = [
    { id: "portfolio", label: "Portfolio", icon: Wallet },
    { id: "market", label: "Market", icon: TrendingUp },
    { id: "defi", label: "DeFi Vault", icon: CreditCard },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};