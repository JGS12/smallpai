import dayjs from 'dayjs'

/**
 * 获取今天是产后第几天（从宝宝出生日期算起）
 * @param {string} birthDate - 出生日期，格式 YYYY-MM-DD
 * @returns {number}
 */
export const getDaysSinceBirth = (birthDate) => {
    const birth = dayjs(birthDate)
    const today = dayjs()
    return today.diff(birth, 'day') + 1
}

/**
 * 根据产后天数获取所在周次
 * @param {number} days - 产后天数
 * @returns {number} 1|2|3|4
 */
export const getWeekByDays = (days) => {
    if (days <= 7) return 1
    if (days <= 14) return 2
    if (days <= 21) return 3
    return 4
}

/**
 * 格式化日期
 * @param {string|Date} date
 * @param {string} [fmt='YYYY-MM-DD']
 */
export const formatDate = (date, fmt = 'YYYY-MM-DD') => {
    return dayjs(date).format(fmt)
}

/**
 * 获取今天星期几
 * @returns {string} 如 '周一'
 */
export const getTodayWeekday = () => {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[new Date().getDay()]
}
