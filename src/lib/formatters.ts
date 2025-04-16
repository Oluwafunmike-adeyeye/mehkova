/**
 * Formats a card number into groups of 4 digits
 * @param value - Raw card number input
 * @returns Formatted card number (e.g., "4242 4242 4242 4242")
 */
export const formatCardNumber = (value: string): string => {
  if (!value) return '';
  
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length > 16) return v.substring(0, 16).match(/\d{4}/g)?.join(' ') || '';
  
  const matches = v.match(/\d{1,16}/g);
  const match = matches?.[0] || '';
  
  return match.split(/(\d{4})/).filter(Boolean).join(' ').trim();
};

/**
 * Formats an expiry date into MM/YY format
 * @param value - Raw expiry date input
 * @returns Formatted date (e.g., "12/25")
 */
export const formatExpiryDate = (value: string): string => {
  if (!value) return '';
  
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  if (v.length >= 3) {
    return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
  }
  return v;
};

/**
 * Formats a price amount into Nigerian Naira currency format
 * @param amount - Numeric amount to format
 * @param currency - Currency code (default: 'NGN')
 * @returns Formatted currency string (e.g., "₦10,000.00")
 */
export const formatPrice = (amount: number, currency: string = 'NGN'): string => {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol'
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return new Intl.NumberFormat('en-NG').format(amount);
  }
};