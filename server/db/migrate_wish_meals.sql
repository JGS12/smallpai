-- 心愿菜单表
-- 注意：需要先确保 users 表和 meals 表已存在
CREATE TABLE IF NOT EXISTS `wish_meals` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `meal_id` INT DEFAULT NULL COMMENT '关联月子餐ID，可为空（自定义菜品）',
  `meal_date` DATE NOT NULL COMMENT '想吃的日期',
  `meal_type` VARCHAR(20) NOT NULL COMMENT '餐次：早餐/午餐/晚餐/加餐',
  `custom_name` VARCHAR(100) DEFAULT NULL COMMENT '自定义菜品名',
  `remark` VARCHAR(200) DEFAULT NULL COMMENT '备注（如少盐、不要姜）',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT '状态：pending待做/done已完成/cancelled已取消',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  FOREIGN KEY (`meal_id`) REFERENCES `meals`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
