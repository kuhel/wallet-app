'use strict';

const fs = require('fs');
const path = require('path');

const ApplicationError = require('../../libs/application-error');
const Moon = require('../../libs/Moon');
const FileModel = require('./common/file-model');

class Cards extends FileModel {
    constructor () {
        super('cards.json');
    }

    /**
     * Добавляет карту
     *
     * @param {Object} card описание карты
     * @returns {Object}
     */
    async create (card) {
        const isDataValid = card && card.hasOwnProperty('cardNumber') && card.hasOwnProperty('balance') && Moon(card.cardNumber);
        if (isDataValid) {
            card.id = this._dataSource && this._dataSource.length >= 0 ? this._dataSource.length + 1 : Math.floor(Math.random() * 10);
            this._dataSource.push(card);
            await this._saveUpdates();
            return card;
        } else {
            throw new ApplicationError('Card data is invalid', 200);
        }
    }

    /**
     * Удалет карту
     * @param {Number} id идентификатор карты
     */
    async remove (id) {
        const card = this._dataSource.find((item) => {
            return item.id === id;
        });

        if (!card) {
            throw new ApplicationError(`Card with ID=${id} not found`, 404);
        }
        const cardIndex = this._dataSource.indexOf(card);
        this._dataSource.splice(cardIndex, 1);
        await this._saveUpdates();
    }
}

module.exports = Cards;
