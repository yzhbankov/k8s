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
                'INSERT INTO users (id) VALUES (?)',
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
            .queryAsync('SELECT * FROM users')
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
            .queryAsync('TRUNCATE TABLE users')
            .catch((err) => {
                throw new RepoError(err);
            });
        return result;
    }    
}
