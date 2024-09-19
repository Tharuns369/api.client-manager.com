import numberToWords from 'number-to-words';

export function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

export function convertNumberToWords(amount: number){
    if (amount < 0) {
        throw new Error('Amount cannot be negative');
    }
    return numberToWords.toWords(amount).replace(/(\d+)/g, (match) => numberToWords.toWords(parseInt(match)));
}
