import { useState, useEffect } from 'react';

interface CurrencyData {
  code: string;
  symbol: string;
  rate: number;
}

export const useCurrency = () => {
  const [currency, setCurrency] = useState<CurrencyData>({
    code: 'USD',
    symbol: '$',
    rate: 1,
  });

  useEffect(() => {
    // Load saved currency preference
    const savedCurrency = localStorage.getItem('preferred-currency') || 'USD';
    const savedRates = localStorage.getItem('exchange-rates');
    
    let rates = {};
    if (savedRates) {
      try {
        rates = JSON.parse(savedRates);
      } catch (error) {
        console.error('Failed to parse saved exchange rates:', error);
      }
    }

    const currencySymbols: Record<string, string> = {
      USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥', INR: '₹',
      CAD: 'C$', AUD: 'A$', CHF: 'Fr', KRW: '₩', BRL: 'R$', MXN: 'MX$',
      SGD: 'S$', NZD: 'NZ$', SEK: 'kr', NOK: 'kr', DKK: 'kr', PLN: 'zł',
      CZK: 'Kč', HUF: 'Ft',
    };

    setCurrency({
      code: savedCurrency,
      symbol: currencySymbols[savedCurrency] || '$',
      rate: (rates as any)[savedCurrency] || 1,
    });

    // Listen for currency changes
    const handleCurrencyChange = (event: CustomEvent) => {
      const { currency: newCurrency, rates: newRates } = event.detail;
      setCurrency({
        code: newCurrency,
        symbol: currencySymbols[newCurrency] || '$',
        rate: newRates[newCurrency] || 1,
      });
    };

    window.addEventListener('currency-changed', handleCurrencyChange as EventListener);
    
    return () => {
      window.removeEventListener('currency-changed', handleCurrencyChange as EventListener);
    };
  }, []);

  const formatPrice = (usdPrice: number): string => {
    const convertedPrice = usdPrice * currency.rate;
    
    // Format based on currency
    if (currency.code === 'JPY' || currency.code === 'KRW') {
      return `${currency.symbol}${Math.round(convertedPrice).toLocaleString()}`;
    }
    
    return `${currency.symbol}${convertedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return {
    currency,
    formatPrice,
  };
};