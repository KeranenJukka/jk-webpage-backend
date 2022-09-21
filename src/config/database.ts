import mysql from 'mysql2'
const dotenv = require('dotenv')

dotenv.config({
    path: '.env'
})

const connection = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.NODE_ENV === 'dev' ? 3307 : 3306,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD
})

export default connection
