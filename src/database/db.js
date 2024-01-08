// const postgres = require('postgres');
const pg = require('pg');
const uuid = require('crypto').randomUUID;
require('dotenv').config();

/* let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
    host: PGHOST,
    database: PGDATABASE,
    username: PGUSER,
    password: PGPASSWORD,
    port: 5432,
    ssl: 'require',
    connection: {
        options: `project=${ENDPOINT_ID}`,
    },
}); */
const pool = new pg.Pool({
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: '5432',
    ssl: {
        rejectUnauthorized: false
    },
    sslmode: 'require'
});

// module.exports = pool;

class Database {
    async list(search) {
        if (search) {
            const response = await pool.query(`
                SELECT * FROM users
                WHERE name ILIKE '%${search}%';`);

            return {
                rows: response.rows,
                rowCount: response.rowCount
            }
        }
        else {
            const response = await pool.query(`
                SELECT * FROM users;`)
            return {
                rows: response.rows,
                rowCount: response.rowCount
            }
        }
    }
    /**Get the value with precise value and type, case-senssitive
     * @param {{value: String, type: String}} search
     */
    preciseList(search) {
        return new Promise(async (resolve, reject) => {
            if (!search || !(search instanceof Object)) {
                throw new TypeError(
                    'search must have compatible {value} and {type}');
            }
            const { value, type } = search;
            const response = await pool.query(`
                SELECT * FROM users
                WHERE ${type} = '${value}';`)

            resolve({
                users: response.rows,
                rowCount: response.rowCount
            })

        })
    }

    /**Create user in PostgreSql
     * @param {Object} user
     * @param {String} user.name - name of user
     * @param {String} user.email - email of user
     * @param {String} user.socialmedia - socialmedia of user
     * @param {String} user.socialmediaUser - socialmedia username
     * @param {String} user.img_url - a URL that points to the user's profile photo
    */
    async create(user) {
        if (!user || !(user instanceof Object)) {
            throw new TypeError('user is not valid. Check if is an object.');
        };
        const wishList = ['name', 'email', 'socialmedia', 'socialmediaUser', 'img_url'];

        console.log(user);
        for (let property of wishList) {
            if (!user.hasOwnProperty(property)) {
                throw new TypeError('missing properties');
            }
        }
        const { name, email, socialmedia, img_url, socialmediaUser } = user;
        const id = uuid();
        await pool.query(`
                    INSERT INTO users
                    VALUES('${id}', '${name}', '${email}', '${socialmedia}', '${img_url}', '${socialmediaUser}');`)
        console.log('created');
    }


    async update(user, id) {
        if (!user || !(user instanceof Object)) {
            throw new TypeError('user is not valid. Check if is an object.');
        };
        if (!id) {
            throw new TypeError('Invalid id.');
        }

        let userKeys = Object.keys(user);
        if (userKeys.length == 0) {
            throw new TypeError('Can not update an empty object.');
        }
        // check if has multiple data to update
        if (userKeys.length > 1) {
            for (let key of userKeys) {
                await pool.query(`
                    UPDATE users
                    SET ${key} = '${user[key]}'
                    WHERE _id = '${id}';`)

            }
            console.log('updated!');

        }
        else {
            let value = userKeys[0];

            await pool.query(`
                        UPDATE users
                        SET ${value} = '${user[value]}'
                        WHERE _id = '${id}';`)

            console.log('updated!');
        }

    }

    async delete(id) {
        if (!id) {
            throw new TypeError('Invalid id');
        }
        await pool.query(`
                DELETE FROM users
                WHERE _id = '${id}'`)

        console.log('deleted');

    }
}


module.exports = { pool, Database };