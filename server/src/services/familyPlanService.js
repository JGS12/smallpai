'use strict'

const { query } = require('../utils/db')

const getList = async () => {
    // 目前默认为第一周
    const tasks = await query('SELECT id, time, task, assignee, status FROM family_plan_tasks WHERE week = 1')
    const configs = await query('SELECT * FROM family_plan_config')

    return {
        week: '第一周',
        todayTasks: tasks,
        memberDuties: configs.find(c => c.config_key === 'member_duties')?.config_value || [],
        weeklyPlan: configs.find(c => c.config_key === 'weekly_plan')?.config_value || [],
        tips: configs.find(c => c.config_key === 'tips')?.config_value || []
    }
}

module.exports = { getList }
