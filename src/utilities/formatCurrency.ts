const CURRENCY_FORMATTER = new Intl.NumberFormat("en-HOSSDDG",{
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
 })

export function formatCurrency(number:number){
    return CURRENCY_FORMATTER.format(number)
}