import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Settings, Globe } from 'lucide-react';

interface CurrencySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
  { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
  { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
  { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
];

export const CurrencySettings = ({ isOpen, onClose }: CurrencySettingsProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});

  useEffect(() => {
    // Load saved currency preference
    const savedCurrency = localStorage.getItem('preferred-currency');
    if (savedCurrency) {
      setSelectedCurrency(savedCurrency);
    }

    // Fetch exchange rates
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      // Using a free exchange rate API
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      setExchangeRates(data.rates);
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      // Fallback rates
      setExchangeRates({
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        JPY: 110,
        CNY: 6.4,
        INR: 74,
        CAD: 1.25,
        AUD: 1.35,
      });
    }
  };

  const handleSave = () => {
    localStorage.setItem('preferred-currency', selectedCurrency);
    localStorage.setItem('exchange-rates', JSON.stringify(exchangeRates));
    
    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent('currency-changed', { 
      detail: { currency: selectedCurrency, rates: exchangeRates } 
    }));
    
    onClose();
  };

  const selectedCurrencyData = CURRENCIES.find(c => c.code === selectedCurrency);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Currency Settings
          </DialogTitle>
          <DialogDescription>
            Choose your preferred currency for displaying values
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Display Currency</Label>
            <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>{currency.symbol} {currency.name} ({currency.code})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedCurrencyData && exchangeRates[selectedCurrency] && (
            <div className="bg-muted/30 rounded-lg p-3">
              <div className="text-sm text-muted-foreground mb-1">Exchange Rate</div>
              <div className="font-medium">
                1 USD = {exchangeRates[selectedCurrency].toFixed(4)} {selectedCurrencyData.symbol}
              </div>
            </div>
          )}

          <div className="bg-muted/30 rounded-lg p-3">
            <div className="text-sm text-muted-foreground">
              💡 Currency conversion rates are updated automatically and cached for better performance.
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};