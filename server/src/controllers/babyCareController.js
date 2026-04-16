'use strict'

const { success } = require('../utils/response')
const babyCareService = require('../services/babyCareService')

const getList = async (ctx) => {
    const data = await babyCareService.getList()
    ctx.body = success(data)
}

module.exports = { getList }
