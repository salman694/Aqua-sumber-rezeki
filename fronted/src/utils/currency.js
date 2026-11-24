/**
 * Format number into Indonesian Rupiah (IDR)
 * Example: 185000 -> "Rp 185.000"
 */
export const formatRupiah = (number) => {
  if (number === undefined || number === null || isNaN(number)) return 'Rp 0';
  return 'Rp ' + Math.round(number).toLocaleString('id-ID');
};
