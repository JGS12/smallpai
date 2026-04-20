// 认证相关接口
import { request } from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - { username, password }
 */
export const login = (data) => {
  return request({
    url: '/auth/login',
    method: 'POST',
    data
  })
}

/**
 * 用户注册
 * @param {Object} data - { username, password, invitationCode, role }
 */
export const register = (data) => {
  return request({
    url: '/auth/register',
    method: 'POST',
    data
  })
}