'use strict'

const { success } = require('../utils/response')
const knowledgeService = require('../services/knowledgeService')

const getList = async (ctx) => {
    const { category } = ctx.query
    const data = await knowledgeService.getList({ category })
    ctx.body = success(data)
}

const getDetail = async (ctx) => {
    const { id } = ctx.params
    const data = await knowledgeService.getDetail(id)
    ctx.body = success(data)
}

module.exports = { getList, getDetail }
