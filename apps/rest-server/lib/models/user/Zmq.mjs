import ModelBase from '../ModelBase.mjs';

export class Zmq extends ModelBase {
    /**
     * @typedef {Class} Zmq
     * @property save
     */

    /**
     * @method
     * @param {Number} msg - message
     * @returns {Promise<Object>}
     */
    async save(params) {
        return this.repository.zmq.save(params);
    }

    /**
     * @method
     * @param {Number} msg - identifier
     * @returns {Promise<Object>}
     */
     async saveZmq(params) {
        return this.repository.zmq.save(params);
    }

    /**
     * @method
     * @returns {Promise<Object>}
     */
    async read() {
        return this.repository.zmq.read();
    }

    /**
     * @method
     * @returns {Promise<Object>}
     */
     async clear() {
        return this.repository.zmq.clear();
    }    
}
