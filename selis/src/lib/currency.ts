
export const getCurrencyInfo = () => {
  // Force Indian locale and currency as requested by user
  const locale = 'en-IN';
  const currency = 'INR';
  console.log('Currency Info:', { locale, currency });
  
  // Get symbol using Intl.NumberFormat
  const symbol = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).formatToParts(0).find(part => part.type === 'currency')?.value || '₹';

  return {
    locale,
    currency,
    symbol,
  };
};

export const formatCurrency = (amount: number) => {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return `₹${amount.toLocaleString('en-IN')}`;
  }
};
