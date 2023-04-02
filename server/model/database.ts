import { MysqlError, createPool, PoolConnection, Pool} from 'mysql'

export class Database {
    pool: Pool;
    constructor(host: string, user: string, password: string, dbname: string, dbport: number) {
        this.pool = this.#createPool(host, user, password, dbname, dbport);
    }
 
    // SQL Query
    async query(query: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.#requestConnection()
            .then(conn => {
                conn.query(query, (err: MysqlError, res: any) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(res);
                });
            })
            .catch(err => {
                return reject(err);
            }); 
        });
    }

    // Private methods
    // Creates the connection pool
    #createPool(host: string, user: string, password: string, dbname: string, dbport: number): Pool {
        return createPool({
            host: host,
            user: user,
            password: password,
            database: dbname,
            port: dbport,
            connectionLimit: 10,
        });
    }
    
    // Requests a connection from the pool
    #requestConnection(): Promise<PoolConnection> {
        return new Promise((resolve, reject) => {
            this.pool.getConnection((err: MysqlError, conn: PoolConnection) => {
                if (err) {
                    return reject(err);
                }
                resolve(conn);
            });
        });
    }
}
