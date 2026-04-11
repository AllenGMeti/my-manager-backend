const sql = require('mssql')
require('dotenv').config()

const config = {
    server: 'localhost',
    port: 1433,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
        trustServerCertificate: true,
        encrypt: false,
        enableArithAbort: true
    },
    connectionTimeout: 30000
}

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to SQL Server')
        return pool
    })
    .catch(err => {
        console.log('Database connection failed:', err.message)
    })

module.exports = { sql, poolPromise }