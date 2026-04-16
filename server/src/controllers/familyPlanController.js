'use strict'

const { success } = require('../utils/response')
const familyPlanService = require('../services/familyPlanService')

const getList = async (ctx) => {
    const data = await familyPlanService.getList()
    ctx.body = success(data)
}

module.exports = { getList }
