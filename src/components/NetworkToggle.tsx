import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Network, TestTube2 } from 'lucide-react';

interface NetworkToggleProps {
  onToggle: (isTestnet: boolean) => void;
}

export const NetworkToggle = ({ onToggle }: NetworkToggleProps) => {
  const [isTestnet, setIsTestnet] = useState(false);

  const handleToggle = (testnet: boolean) => {
    setIsTestnet(testnet);
    onToggle(testnet);
  };

  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Network Mode</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant={!isTestnet ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggle(false)}
              className="gap-1"
            >
              <div className="w-2 h-2 bg-success rounded-full"></div>
              Mainnet
            </Button>
            <Button
              variant={isTestnet ? "default" : "outline"}
              size="sm"
              onClick={() => handleToggle(true)}
              className="gap-1"
            >
              <TestTube2 className="w-3 h-3" />
              Testnet
            </Button>
          </div>
        </div>
        {isTestnet && (
          <div className="mt-2">
            <Badge variant="secondary" className="text-xs bg-warning/20 text-warning">
              Testnet tokens have no real value
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};