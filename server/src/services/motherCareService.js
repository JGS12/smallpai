'use strict'

const { query } = require('../utils/db')

const getList = async () => {
    return await query('SELECT * FROM mother_care')
}

const getByWeek = async (week) => {
    const results = await query('SELECT * FROM mother_care WHERE week = ?', [Number(week)])
    return results[0] || null
}

module.exports = { getList, getByWeek }
