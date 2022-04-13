import { UserRepository, ZmqRepository } from './documents/index.mjs';

export class Repository {
    /**
     * @typedef {Class} Repository
     * @property user
     * @property zmq
     */

    /**
     * @type {UserRepository} returns DB access to user
     */
    user = null;

    /**
     * @type {ZmqRepository} returns DB access to user
     */
    zmq = null;

    /**
     * @type {UserPhonesRepository} returns DB access to user phonnes
     */
    userPhones = null;

    /**
     * @param {Object} options - repository options
     * @param {Object} options.db - postgres connection
     */
    constructor(options) {
        this.user = new UserRepository(options);
        this.zmq = new ZmqRepository(options);
    }
}
