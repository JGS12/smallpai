'use strict'

const { query } = require('../utils/db')

const getList = async () => {
    const results = await query('SELECT * FROM baby_care')
    const data = {}
    results.forEach(item => {
        data[item.category_key] = {
            title: item.title,
            points: item.points,
            alerts: item.alerts
        }
    })
    return data
}

module.exports = { getList }
