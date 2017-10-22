'use strict';

const bankUtils = {
	/**
	 * Типы банковскиx карт
	 * @type {Object}
	 */
	cardTypes: {
		VISA: 'visa',
		MAESTRO: 'maestro',
		MASTERCARD: 'mastercard',
		MIR: 'mir'
	},

	/**
	 * Проверяет тип карты
	 * @param {Number} val номер карты
	 * @returns {String} тип карты
	 */
	getCardType(val) {
		// Бины ПС МИР 220000 - 220499
		const mirBin = /^220[0-4]\s?\d\d/;

		const firstNum = val[0];

		switch (firstNum) {
			case '2': {
				if (mirBin.test(val)) {
					return bankUtils.cardTypes.MIR;
				}

				return '';
			}
			case '4': {
				return bankUtils.cardTypes.VISA;
			}
			case '5': {
				const secondNum = val[1] || '';

				if (secondNum === '0' || secondNum > '5') {
					return bankUtils.cardTypes.MAESTRO;
				}

				return bankUtils.cardTypes.MASTERCARD;
			}
			case '6': {
				return bankUtils.cardTypes.MAESTRO;
			}
			default: {
				return '';
			}
		}
	},

	/**
	 * Форматирует номер карты, используя заданный разделитель
	 *
	 * @param {String} originCardNumber номер карты
	 * @param {String} delimeter = '\u00A0' разделитель
	 * @returns {String} форматированный номер карты
	 */
	formatCardNumber(originCardNumber, delimeter = '\u00A0') {
		const formattedCardNumber = [];
		let cardNumber = originCardNumber;
		if (cardNumber) {
			while (cardNumber && typeof cardNumber === 'string') {
				formattedCardNumber.push(cardNumber.substr(0, 4));
				cardNumber = cardNumber.substr(4);
				if (cardNumber) {
					formattedCardNumber.push(delimeter);
				}
			}
		}
		return formattedCardNumber.join('');
	},

	/**
	 * Проверяет номер карты по алгоритму Луна
	 *
	 * @param {Number} cardNumber Номер карты
	 * @returns {Boolean} Валиден ли номер карты
	 */
	Moon(cardNumber) {
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
};

module.exports = bankUtils;
