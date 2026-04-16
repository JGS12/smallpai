'use strict'

const { query } = require('../utils/db')

/**
 * 获取月子餐列表，支持按周、餐次筛选
 */
const getList = async ({ week, mealType } = {}) => {
    let sql = 'SELECT * FROM meals WHERE 1=1'
    const params = []

    if (week) {
        sql += ' AND week = ?'
        params.push(Number(week))
    }

    if (mealType) {
        sql += ' AND meal_type = ?'
        params.push(mealType)
    }

    return await query(sql, params)
}

/**
 * 获取单个菜品
 */
const getDetail = async (id) => {
    const results = await query('SELECT * FROM meals WHERE id = ?', [Number(id)])
    return results[0] || null
}

module.exports = { getList, getDetail }
