
const Moon = (cardNumber) => {
    const arr = []
    const _cardNumber = cardNumber.toString();
    for(let i = 0; i < _cardNumber.length; i++) {
        if (i % 2 === 0) {
            const m = parseInt(_cardNumber[i], 10) * 2;
            if (m > 9) {
                arr.push(m - 9);
            } else {
                arr.push(m);
            }
        } else {
            const n = parseInt(_cardNumber[i], 10);
            arr.push(n)
        }
    }
    const summ = arr.reduce((a, b) => a + b);
    return Boolean(!(summ % 10));
}

module.exports = Moon;