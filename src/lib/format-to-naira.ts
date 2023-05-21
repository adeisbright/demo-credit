/**
 * @description formats a number as a naira string 
 * @param amount {{number}}
 * @returns 
 */
const formatToNaira = (amount: number) => {
    let formattedAmount = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2
    }).format(amount);
    return formattedAmount;
};

export default formatToNaira
