-- 月子小家 v2.0 数据库迁移
-- 新增多角色系统 + 点餐 + 生活记录 + 成长日记 + 留言板 + 趣味功能

USE paipai;

-- 1. 更新 users 表，增加角色字段
ALTER TABLE `users` ADD COLUMN `family_role` VARCHAR(20) DEFAULT 'family' COMMENT 'mom/family/admin';
ALTER TABLE `users` ADD COLUMN `avatar` VARCHAR(255) DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `nickname` VARCHAR(50) DEFAULT NULL;

-- 2. 点餐订单表
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL COMMENT '点餐人（妈妈）',
  `meal_id` INT DEFAULT NULL COMMENT '关联菜品ID（null表示自定义）',
  `custom_name` VARCHAR(100) DEFAULT NULL COMMENT '自定义菜品名',
  `meal_date` DATE NOT NULL COMMENT '用餐日期',
  `meal_type` VARCHAR(20) NOT NULL COMMENT '早餐/加餐/午餐/晚餐/汤水',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '特殊要求',
  `status` VARCHAR(20) DEFAULT 'pending' COMMENT 'pending/accepted/done',
  `accepted_by` INT DEFAULT NULL COMMENT '接单人ID',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX idx_date (`meal_date`),
  INDEX idx_status (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. 哺乳记录表
CREATE TABLE IF NOT EXISTS `feeding_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `feed_time` DATETIME NOT NULL COMMENT '喂奶时间',
  `duration` INT DEFAULT NULL COMMENT '时长（分钟）',
  `side` VARCHAR(10) DEFAULT NULL COMMENT 'left/right/both',
  `note` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX idx_feed_time (`feed_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. 睡眠记录表
CREATE TABLE IF NOT EXISTS `sleep_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `sleep_start` DATETIME NOT NULL COMMENT '入睡时间',
  `sleep_end` DATETIME DEFAULT NULL COMMENT '醒来时间',
  `quality` VARCHAR(20) DEFAULT NULL COMMENT 'good/normal/bad',
  `note` VARCHAR(255) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX idx_sleep_start (`sleep_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. 心情打卡表
CREATE TABLE IF NOT EXISTS `mood_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `mood` VARCHAR(10) NOT NULL COMMENT 'happy/normal/sad/crying',
  `note` VARCHAR(500) DEFAULT NULL,
  `record_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  UNIQUE KEY uniq_user_date (`user_id`, `record_date`),
  INDEX idx_record_date (`record_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. 体重记录表
CREATE TABLE IF NOT EXISTS `weight_records` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `weight` DECIMAL(5,2) NOT NULL COMMENT '体重（kg）',
  `record_date` DATE NOT NULL,
  `note` VARCHAR(100) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX idx_record_date (`record_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. 宝宝成长里程碑
CREATE TABLE IF NOT EXISTS `baby_milestones` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL COMMENT '记录人',
  `title` VARCHAR(100) NOT NULL COMMENT '里程碑标题',
  `content` TEXT,
  `milestone_date` DATE NOT NULL,
  `icon` VARCHAR(10) DEFAULT '⭐',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX idx_milestone_date (`milestone_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. 宝宝照片墙
CREATE TABLE IF NOT EXISTS `baby_photos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `photo_url` VARCHAR(500) NOT NULL,
  `caption` VARCHAR(200) DEFAULT NULL,
  `photo_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX idx_photo_date (`photo_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. 妈妈日记
CREATE TABLE IF NOT EXISTS `diary_entries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(100) DEFAULT NULL,
  `content` TEXT NOT NULL,
  `mood` VARCHAR(10) DEFAULT NULL,
  `entry_date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX idx_entry_date (`entry_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. 家人留言板
CREATE TABLE IF NOT EXISTS `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `from_user_id` INT NOT NULL,
  `content` TEXT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`from_user_id`) REFERENCES `users`(`id`),
  INDEX idx_created_at (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. 成就徽章
CREATE TABLE IF NOT EXISTS `achievements` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `badge_key` VARCHAR(50) NOT NULL COMMENT 'badge标识',
  `badge_name` VARCHAR(50) NOT NULL,
  `badge_icon` VARCHAR(10) DEFAULT '🏅',
  `earned_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  UNIQUE KEY uniq_user_badge (`user_id`, `badge_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. 给未来的信
CREATE TABLE IF NOT EXISTS `future_letters` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `title` VARCHAR(100) NOT NULL,
  `content` TEXT NOT NULL,
  `unlock_date` DATE NOT NULL COMMENT '解锁日期',
  `is_unlocked` TINYINT(1) DEFAULT 0,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`),
  INDEX idx_unlock_date (`unlock_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. 本周小报（缓存）
CREATE TABLE IF NOT EXISTS `weekly_reports` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `week_start` DATE NOT NULL COMMENT '周一开始日期',
  `report_data` JSON NOT NULL COMMENT '统计数据',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_week (`week_start`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
