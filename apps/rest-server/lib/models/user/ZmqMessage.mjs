import ModelBase from '../ModelBase.mjs';

export class ZmqMessage extends ModelBase {
    /**
     * @typedef {Class} ZmqMessage
     * @property save
     */

    /**
     * @method
     * @param {Number} msg - message
     * @returns {Promise<Object>}
     */
    async save(params) {
        return this.repository.zmqMsg.save(params);
    }

    /**
     * @method
     * @param {Number} msg - identifier
     * @returns {Promise<Object>}
     */
     async saveZmq(params) {
        return this.repository.zmqMsg.save(params);
    }

    /**
     * @method
     * @returns {Promise<Object>}
     */
    async read() {
        return this.repository.zmqMsg.read();
    }

    /**
     * @method
     * @returns {Promise<Object>}
     */
     async clear() {
        return this.repository.zmqMsg.clear();
    }    
}
