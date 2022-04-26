import * as mysql from 'mariadb';
import logger from '../api/logger';
import { DbError } from '../models';

async function getConnection(pool, reconnectCount = 0) {
    try {
        return await pool.getConnection();
    } catch(err) {
        if (reconnectCount < 4) {
            reconnectCount += 1;
            logger.info('Fail get connection, try reconnect. Attempting ', reconnectCount);
            return getConnection(pool, reconnectCount);
        } else {
            throw err;
        }
    }
}

function QueryAsync(pool) {
    return async function queryAsync(sqlStatement, params) {
        if (!sqlStatement) throw new DbError('WRONG_SQL_STATEMENT');
        let conn;
        let promise;
        try {
            conn = await getConnection(pool);
            if (params) {
                promise = conn.query(sqlStatement, params);
            } else {
                promise = conn.query(sqlStatement);
            }
            return promise;
        } catch (err) {
            logger.error('Get connection error: ', err);
            throw err;
        } finally {
            if (conn) conn.release(); //release to pool
        }
    }
}


/**
 * @function
 * @param {Object} options - database connection options
 * @param {String} options.host - database host name
 * @param {String} options.port - database port number
 * @param {String} options.user - database user
 * @param {String} options.database - database schema name
 * @param {String} options.password - database password
 * @param {Number} options.connectionsLimit - database user
 * @return {Object} - DB API
 */
export function createMariaDbConnection(options) {
    let pool = mysql.createPool({ ...options, 'multipleStatements': true });
    return {
        pool,
        queryAsync: QueryAsync(pool),
    }
}
