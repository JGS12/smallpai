'use strict'

const mysql = require('mysql2/promise')

// 创建连接池
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'paipai',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

/**
 * 通用查询方法
 * @param {string} sql SQL 语句
 * @param {Array} params 参数数组
 */
const query = async (sql, params) => {
    try {
        const [results] = await pool.execute(sql, params)
        return results
    } catch (err) {
        console.error('❌ Database Query Error:', err.message)
        throw err
    }
}

module.exports = {
    query,
    pool
}
