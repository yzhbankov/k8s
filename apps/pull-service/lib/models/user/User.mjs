import ModelBase from '../ModelBase.mjs';

export class User extends ModelBase {
    /**
     * @typedef {Class} User
     * @property save
     */

    /**
     * @method
     * @param {Number} id - identifier
     * @returns {Promise<Object>}
     */
    async save(params) {
        return this.repository.user.save(params);
    }

    /**
     * @method
     * @param {Number} msg - identifier
     * @returns {Promise<Object>}
     */
     async saveZmq(params) {
        return this.repository.user.saveZmq(params);
    }

    /**
     * @method
     * @returns {Promise<Object>}
     */
    async read() {
        return this.repository.user.read();
    }

    /**
     * @method
     * @returns {Promise<Object>}
     */
     async clear() {
        return this.repository.user.clear();
    }    
}
