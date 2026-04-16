'use strict'

const { query } = require('../utils/db')

const getList = async ({ category } = {}) => {
    let sql = 'SELECT * FROM knowledge WHERE 1=1'
    const params = []

    if (category) {
        sql += ' AND category = ?'
        params.push(category)
    }

    return await query(sql, params)
}

const getDetail = async (id) => {
    const results = await query('SELECT * FROM knowledge WHERE id = ?', [Number(id)])
    return results[0] || null
}

module.exports = { getList, getDetail }
