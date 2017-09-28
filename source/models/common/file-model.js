const fs = require('fs');
const path = require('path');

const Model  = require('./model');

class FileModel extends Model {
    constructor(sourceFile) {
        super();
        this._dataSourceFile = path.join(__dirname, '..', '..', '..', 'db', sourceFile);
        this._dataSource = require(this._dataSourceFile);
    }

    /**
	 * Возвращает все карты
	 * @returns {Object[]}
	 */
	async getAll () {
		return await this._dataSource;
    }
    
    /**
	 * Сохраняет изменения
	 * @private
	 */
	async _saveUpdates () {
        return new Promise(resolve =>
            fs.writeFile(this._dataSourceFile, JSON.stringify(this._dataSource, null, 4),
            resolve));
	}
}

module.exports = FileModel;