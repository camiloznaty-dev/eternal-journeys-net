/**
 * Valida el formato y dígito verificador de un RUT chileno
 */
export const validateRut = (rut: string): boolean => {
  // Remove spaces and convert to uppercase
  const cleanRut = rut.replace(/\s/g, '').toUpperCase();
  
  // Check basic format: XX.XXX.XXX-X or XXXXXXXX-X
  const rutRegex = /^(\d{1,2}\.?\d{3}\.?\d{3})-?([0-9K])$/;
  if (!rutRegex.test(cleanRut)) {
    return false;
  }
  
  // Extract number and verifier
  const parts = cleanRut.replace(/\./g, '').split('-');
  const number = parseInt(parts[0], 10);
  const verifier = parts[1];
  
  // Calculate verifier digit
  const calculatedVerifier = calculateVerifier(number);
  
  return calculatedVerifier === verifier;
};

/**
 * Calculate the verifier digit for a RUT number
 */
const calculateVerifier = (rut: number): string => {
  let sum = 0;
  let multiplier = 2;
  
  // Convert to string and reverse
  const rutStr = rut.toString().split('').reverse().join('');
  
  // Calculate sum
  for (let i = 0; i < rutStr.length; i++) {
    sum += parseInt(rutStr[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  // Calculate verifier
  const remainder = sum % 11;
  const verifier = 11 - remainder;
  
  if (verifier === 11) return '0';
  if (verifier === 10) return 'K';
  return verifier.toString();
};

/**
 * Format a RUT with dots and dash
 */
export const formatRut = (rut: string): string => {
  // Remove all non-alphanumeric characters
  const cleanRut = rut.replace(/[^0-9K]/gi, '').toUpperCase();
  
  if (cleanRut.length < 2) return cleanRut;
  
  // Split number and verifier
  const verifier = cleanRut.slice(-1);
  const number = cleanRut.slice(0, -1);
  
  // Format with dots
  const formattedNumber = number
    .split('')
    .reverse()
    .reduce((acc, digit, index) => {
      if (index > 0 && index % 3 === 0) {
        return digit + '.' + acc;
      }
      return digit + acc;
    }, '');
  
  return `${formattedNumber}-${verifier}`;
};

/**
 * Clean RUT format for storage
 */
export const cleanRut = (rut: string): string => {
  return rut.replace(/[^0-9K]/gi, '').toUpperCase();
};
