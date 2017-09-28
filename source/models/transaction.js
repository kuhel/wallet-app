const FileModel = require('./common/file-model');
const ApplicationError = require('../../libs/application-error');

const transactionNumber = (data) => {
    let ids = data.map((item) => item.id);
    return ids.reduce((a, b) => {
        return Math.max(a, b);
    });
}

class TransactionModel extends FileModel {
    constructor () {
        super('transactions.json');
        this.Cards = new FileModel('cards.json');
        this._cardId = null;
    }

    async getTransactions(cardId) {
        console.dir(cardId);
        const data = this._dataSource.filter((item) => cardId === item.cardId);
        return data;
    };

    get card() {
        return this.Cards.getAll().filter((card) => card.cardId === this._cardId)[0];
    }

    set cardId(cardId) {
        this._cardId = cardId;
    }

    /**
     * Добавляет транзакцию
     *
     * @param {Object} transactionData Данные о транзакции
     * @returns {Object}
     */
    async create (cardId, transaction) {
        this.cardId = cardId;
        const isDataValid = transaction && transaction.hasOwnProperty('cardId') && transaction.hasOwnProperty('type');
        if (isDataValid) {
            transaction.id = this._dataSource && this._dataSource.length >= 0 ? transactionNumber(this._dataSource) + 1 : 1;
            this._dataSource.push(transaction);
            await this._saveUpdates();
            return transaction;
        } else {
            throw new ApplicationError('Card data is invalid', 400);
        }
    }

    async remove() {
        throw new Error('Transaction can not be removed');
    };
}

module.exports = TransactionModel;