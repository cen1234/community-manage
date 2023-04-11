--------------------------------------------------
-------------用户表-----------------------
----------------------------------------------------
DROP TABLE IF EXISTS `user`;

CREATE TABLE

CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `role_id` INT(11) DEFAULT 1 COMMENT '角色身份id',
  `username` VARCHAR(30) NOT NULL COMMENT '用户名',
  `user_real_name` VARCHAR(30) NULL COMMENT '用户真实姓名',
  `password` VARCHAR(15) NOT NULL COMMENT '密码',
  `sex` CHAR(2) DEFAULT NULL COMMENT'性别',
  `age` INT(3) DEFAULT NULL COMMENT '年龄',
  `phone` VARCHAR(50) DEFAULT NULL COMMENT '电话',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
  `user_img` VARCHAR(500) DEFAULT NULL COMMENT '用户头像',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  FOREIGN KEY(role_id) REFERENCES role(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='用户信息'


-- 插入员工数据
INSERT IGNORE INTO `user` VALUES (1,1, 'hhh',   '李哈哈', '123456',   '女', 11, '18709261628', '二次元', '');
INSERT IGNORE INTO `user` VALUES (2,3, 'z',   'sjd', '123456',   '女', 11, '18709261628', '二次元', '');
INSERT IGNORE INTO `user` VALUES (3,2, 'z1',   'sjd1', '123456',   '女', 11, '18709261628', '二次元', '');
INSERT IGNORE INTO `user` VALUES (4,4, 'z2',   'sjd2', '123456',   '女', 11, '18709261628', '二次元', '');
INSERT IGNORE INTO `user` VALUES (5,4, 'z3',   'sjd3', '123456',   '女', 11, '18709261628', '二次元', '');

-------------------------------------------------------
---------------角色身份表----------------------------
-------------------------------------------------------
DROP TABLE IF EXISTS `role`;

CREATE TABLE

CREATE TABLE `role` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `role` VARCHAR(30) NOT NULL COMMENT '用户身份',
  `description` VARCHAR(255) NULL COMMENT '描述',
  `isshow` CHAR(2) DEFAULT NULL COMMENT'是否在前台展示 1->展示  0->不展示',
  PRIMARY KEY (`id`),
  UNIQUE KEY `role` (`role`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='用户身份信息'


-- 插入角色数据
INSERT IGNORE INTO `role` VALUES (1,  '系统管理员','111','1');
INSERT IGNORE INTO `role` VALUES (2,  '社区管理员','111','1');
INSERT IGNORE INTO `role` VALUES (3,  '社区工作人员',NULL,'0');
INSERT IGNORE INTO `role` VALUES (4,  '志愿者',NULL,'0');
INSERT IGNORE INTO `role` VALUES (5,  '普通人员',NULL,'0');


-------------------------------------------------------
----------------菜单表----------------------------
-------------------------------------------------------
DROP TABLE IF EXISTS `menu`;

CREATE TABLE

CREATE TABLE `menu` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `menu_id` INT(11) NOT NULL COMMENT '菜单Id',
  `pid` INT(11) DEFAULT NULL COMMENT '父级Id',
  `role_id` INT(11) NOT NULL COMMENT '角色身份id',
  `name` VARCHAR(30) NOT NULL COMMENT '菜单名字',
  `description` VARCHAR(255) NOT NULL COMMENT '功能描述',
  `path` VARCHAR(30)  NULL COMMENT '路由',
  `icon` VARCHAR(30)  NULL COMMENT 'icon图标',
  PRIMARY KEY (`id`),

  FOREIGN KEY(role_id) REFERENCES role(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='菜单信息'


-- 插入菜单数据
INSERT IGNORE INTO `menu` VALUES (1,1,NULL,1 , '账号与用户','111','','user');
INSERT IGNORE INTO `menu` VALUES (2,2,1,1 , '账号管理','111','/user','');
INSERT IGNORE INTO `menu` VALUES (3,3,1,1, '用户问题追踪','111','/userquestion','');
INSERT IGNORE INTO `menu` VALUES (4,4,NULL ,1, '权限管理','11','/role','key');
INSERT IGNORE INTO `menu` VALUES (5,5,NULL ,1, '社区管理','11','/community','home');
INSERT IGNORE INTO `menu` VALUES (6,6,NULL ,2, '社区工作人员','11','','solution');
INSERT IGNORE INTO `menu` VALUES (7,7,6,2, '工作人员信息管理','11','/staffinfo','');


--------------------------------------------------------------------------------
----------------社区表------------------------------------------
----------------------------------------------------------------------------------
DROP TABLE IF EXISTS `com`;

CREATE TABLE

CREATE TABLE `com` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `com_id` INT(11) NOT NULL  COMMENT '社区Id',
  `name` VARCHAR(30) NOT NULL COMMENT '社区名字',
  `province` VARCHAR(30) NULL COMMENT '所在省',
  `city` VARCHAR(30) NULL COMMENT '所在市',
  `area` VARCHAR(30) NULL COMMENT '所在区',
  `address` VARCHAR(255)  NULL COMMENT '详细地址',
  PRIMARY KEY (`id`),
  UNIQUE KEY `com_id` (`com_id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='社区信息'


-- 插入菜单数据
INSERT IGNORE INTO `com` VALUES (1,1,'西柚小区1','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `com` VALUES (2,2,'西柚小区2','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `com` VALUES (3,3,'西柚小区3','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `com` VALUES (4,4,'西柚小区4','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `com` VALUES (5,5,'西柚小区5','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `com` VALUES (6,6,'西柚小区6','陕西省','西安市', '长安区','111');
