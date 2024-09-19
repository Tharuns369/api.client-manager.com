import numberToWords from 'number-to-words';
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}
export function convertNumberToWords(amount) {
    if (amount < 0) {
        throw new Error('Amount cannot be negative');
    }
    return numberToWords.toWords(amount).replace(/(\d+)/g, (match) => numberToWords.toWords(parseInt(match)));
}
