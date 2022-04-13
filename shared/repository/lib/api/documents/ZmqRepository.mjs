import RepoBase from '../RepoBase.mjs';
import { RepoError } from '../models/index.mjs';

export class ZmqRepository extends RepoBase {
    /**
     * @typedef {Class} ZmqRepository
     */

    /**
     * @param {Object} options - repository options
     * @param {Object} options.db - databse connection
     */
    constructor(options) {
        const { db } = options;

        super(db);
    }

    /**
     * @method
     * @param {Number} msg - user message
     * @returns {Promise<Object>}
     */
    async save({ msg }) {
        const result = await this.db
            .queryAsync(
                'INSERT INTO zmq_messages (msg) VALUES (?)',
                [msg]
            )
            .catch((err) => {
                throw new RepoError(err);
            });
        return result;
    }

    /**
     * @method
     * @returns {Promise<Object>}
     */
     async read() {
        const result = await this.db
            .queryAsync('SELECT * FROM zmq_messages')
            .catch((err) => {
                throw new RepoError(err);
            });
        return result;
    }

    /**
     * @method
     * @returns {Promise<Object>}
     */
     async clear() {
        const result = await this.db
            .queryAsync('TRUNCATE TABLE zmq_messages')
            .catch((err) => {
                throw new RepoError(err);
            });
        return result;
    }    
}
