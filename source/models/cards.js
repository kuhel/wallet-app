'use strict';

const ApplicationError = require('libs/application-error');

const FileModel = require('./common/fileModel');

const BankUtils = require('libs/utils');

class Cards extends FileModel {
	constructor() {
		super('cards.json');
	}

	/**
	 * Добавляет карту
	 *
	 * @param {Object} card описание карты
	 * @returns {Promise.<Object>}
	 */
	async create(card) {
		const isDataValid = card
			&& Object.prototype.hasOwnProperty.call(card, 'cardNumber')
			&& BankUtils.Moon(card.cardNumber)
			&& Object.prototype.hasOwnProperty.call(card, 'balance');

		if (isDataValid) {
			const newCard = Object.assign({}, card, {
				id: this._generateId()
			});

			this._dataSource.push(newCard);
			await this._saveUpdates();
			return newCard;
		}
		throw new ApplicationError('💳 Card data is invalid', 400);
	}

	/**
	 * Удалет карту
	 * @param {Number} id идентификатор карты
	 */
	async remove(id) {
		const card = await this.get(id);
		if (!card) {
			throw new ApplicationError(`💳 Card with ID=${id} not found`, 404);
		}
		const cardIndex = this._dataSource.indexOf(card);
		this._dataSource.splice(cardIndex, 1);
		await this._saveUpdates();
	}

	/**
	 * Получение карты
	 * @param {Number} id идентификатор карты
	 * @returns {Promise.<T|*|{}>}
	 */
	async get(id) {
		return this._dataSource.find((item) => item.id === Number(id));
	}

	/**
	 * Списание средств с карты
	 * @param {Number} id идентификатор карты
	 * @param {Number} sum сумма
	 */
	async withdraw(id, sum) {
		const card = await this.get(id);
		card.balance = Number(card.balance) - Number(sum);

		await this._saveUpdates();
	}

	/**
	 * Пополнение карты
	 * @param {Number} id идентификатор карты
	 * @param {Number} sum сумма
	 */
	async refill(id, sum) {
		const card = await this.get(id);
		card.balance = Number(card.balance) + Number(sum);

		await this._saveUpdates();
	}
}

module.exports = Cards;
