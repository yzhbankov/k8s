import RepoBase from '../RepoBase.mjs';
import { RepoError } from '../models/index.mjs';

export class UserRepository extends RepoBase {
    /**
     * @typedef {Class} UserRepository
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
     * @param {Number} id - user identifier
     * @returns {Promise<Object>}
     */
    async save({ id }) {
        const result = await this.db
            .queryAsync(
                'INSERT INTO user_messages (id) VALUES (?)',
                [id]
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
            .queryAsync('SELECT * FROM user_messages')
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
            .queryAsync('TRUNCATE TABLE user_messages')
            .catch((err) => {
                throw new RepoError(err);
            });
        return result;
    }    
}
