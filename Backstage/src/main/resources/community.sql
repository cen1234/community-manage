--------------------------------------------------
-------------用户表-----------------------
----------------------------------------------------
-- 创建用户表
DROP TABLE IF EXISTS `user`;

CREATE TABLE

CREATE TABLE `user` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `role_id` INT(11) DEFAULT 1 COMMENT '角色身份id',
  `com_id` INT(11) DEFAULT 1 COMMENT '社区Id',
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
  FOREIGN KEY(role_id) REFERENCES role(id),
  FOREIGN KEY(com_id) REFERENCES cum(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='用户信息'


-- 插入员工数据
INSERT IGNORE INTO `user` VALUES (1,1,1, 'hhh',   '李哈哈', '123456',   '女', 11, '18709261628', '二次元', '');
INSERT IGNORE INTO `user` VALUES (2,3,1, 'z',   'sjd', '123456',   '女', 11, '18709261628', '二次元', '');
INSERT IGNORE INTO `user` VALUES (3,2,1, 'z1',   'sjd1', '123456',   '女', 11, '18709261628', '二次元', '');
INSERT IGNORE INTO `user` VALUES (4,4,1, 'z2',   'sjd2', '123456',   '女', 11, '18709261628', '二次元', '');
INSERT IGNORE INTO `user` VALUES (5,4,1, 'z3',   'sjd3', '123456',   '女', 11, '18709261628', '二次元', '');

-------------------------------------------------------
---------------角色身份表----------------------------
-------------------------------------------------------
-- 创建角色表
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
-- 创建菜单表
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
DROP TABLE IF EXISTS `cum`;

CREATE TABLE

CREATE TABLE `cum` (
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
INSERT IGNORE INTO `cum` VALUES (1,1,'西柚小区1','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `cum` VALUES (2,2,'西柚小区2','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `cum` VALUES (3,3,'西柚小区3','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `cum` VALUES (4,4,'西柚小区4','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `cum` VALUES (5,5,'西柚小区5','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `cum` VALUES (6,6,'西柚小区6','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `cum` VALUES (7,7,'西柚小区7','陕西省','西安市', '长安区','111');
INSERT IGNORE INTO `cum` VALUES (8,8,'西柚小区6','山西省','西安市', '长安区','111');


----------------------------------------------------------
----------- 物资表----------------------------
----------------------------------------------------------
DROP TABLE IF EXISTS `materials`;

CREATE TABLE

CREATE TABLE `materials` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `com_id` INT(11) DEFAULT 1 COMMENT '社区Id',
  `name` VARCHAR(30) NOT NULL COMMENT '物资名字',
  `count` INT(11) NULL COMMENT '物资总数',
  `belong_community` VARCHAR(30) NULL COMMENT '所属社区',
  `available` VARCHAR(30) NULL COMMENT '物资是否可用',
  `borrowed_count` INT(11) NULL COMMENT '总借用数量',
  `is_expand` VARCHAR(5) NULL COMMENT '是否展开',
  PRIMARY KEY (`id`),
  FOREIGN KEY(com_id) REFERENCES cum(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='物资信息'


-- 插入菜单数据
INSERT IGNORE INTO `materials` VALUES (1,1,'酒精',100,'西柚小区1', 'true',20,'false');
INSERT IGNORE INTO `materials` VALUES (2,1,'急救药品',100,'西柚小区1', 'true',30,'false');
INSERT IGNORE INTO `materials` VALUES (3,1,'梯子',10,'西柚小区1', 'true',2,'false');
INSERT IGNORE INTO `materials` VALUES (4,1,'创可贴',100,'西柚小区1', 'true',20,'false');


---------------------------------------------------------------
---------- 借用物资-用户关系表--------------
----------------------------------------------------------------
DROP TABLE IF EXISTS `usermaterials`;

CREATE TABLE

CREATE TABLE `usermaterials` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `materials_id` INT(11) DEFAULT 1 COMMENT '物资Id',
  `user_name` VARCHAR(30) NOT NULL COMMENT '用户',
  `materials_name` VARCHAR(30)NOT NULL COMMENT '被借用物资名',
  `count` INT(11) NOT NULL COMMENT '被借用物资数量',
  `back` VARCHAR(5)  NULL COMMENT '被借用物资是否已归还',
  `phone` VARCHAR(50) DEFAULT NULL COMMENT '联系电话',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '用户地址',
  PRIMARY KEY (`id`),
  FOREIGN KEY(materials_id) REFERENCES materials(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='借用物资-用户关系表'


-- 插入菜单数据
INSERT IGNORE INTO `userMaterials` VALUES (1,1,'hhh','酒精',20,'是','18709261628', '二次元');
INSERT IGNORE INTO `userMaterials` VALUES (2,2,'hhh','急救药品',30,'是','18709261628', '二次元');
INSERT IGNORE INTO `userMaterials` VALUES (3,3,'hhh','梯子',2,'否','18709261628', '二次元');
INSERT IGNORE INTO `userMaterials` VALUES (4,4,'hhh','创可贴',20,'否','18709261628', '二次元');


-------------------------------------------------------------------------
------------------志愿者表-----------------------
-----------------------------------------------------------------------------

DROP TABLE IF EXISTS `volunteer`;

CREATE TABLE

CREATE TABLE `volunteer` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `com_id` INT(11) DEFAULT 1 COMMENT '社区Id',
  `name` VARCHAR(30) NOT NULL COMMENT '志愿者名字',
  `age` INT(11) NULL COMMENT '年龄',
  `sex` VARCHAR(5) NULL COMMENT '性别',
  `phone` VARCHAR(50) NULL COMMENT '电话',
  `address` VARCHAR(255)  NULL COMMENT '地址',
  `belong_community` VARCHAR(30) NULL COMMENT '所属社区',
  `available` VARCHAR(30) NULL COMMENT '是否空闲',
  `score` INT(11) NULL COMMENT '总评分',
  `work_count` INT(11) NULL COMMENT '总任务数量',
  `skill` VARCHAR(255) NULL COMMENT '擅长技能',
  `formal` VARCHAR(5) NULL COMMENT '是否正式 两个状态：正式|申请',
  `apply_time` VARCHAR(255) NULL COMMENT '申请开始时间',
  `formal_time` VARCHAR(255)NULL COMMENT '成为正式开始时间',
  `approver` VARCHAR(30) DEFAULT NULL COMMENT '当前审批人',
  PRIMARY KEY (`id`),
  FOREIGN KEY(com_id) REFERENCES cum(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='志愿者信息'


-- 插入菜单数据
INSERT IGNORE INTO `volunteer` VALUES (1,1,'aaa',20,'女', '18709261268','11111','西柚小区1','空闲',10,2,'111','正式','2023-09-28 11:50:36','2023-09-29 11:50:36',NULL);
INSERT IGNORE INTO `volunteer` VALUES (2,1,'aaa2',20,'女', '18709261268','11111','西柚小区1','空闲',10,2,'111','正式','2023-09-28 11:50:36','2023-09-29 11:50:36',NULL);
INSERT IGNORE INTO `volunteer` VALUES (3,1,'aaa3',20,'女', '18709261268','11111','西柚小区1','空闲',10,2,'111','申请','2023-09-28 11:50:36',NULL,'hhh');
INSERT IGNORE INTO `volunteer` VALUES (4,1,'aaa4',20,'女', '18709261268','11111','西柚小区1','空闲',10,2,'111','申请','2023-09-28 11:50:36',NULL,NULL);


-------------------------------------------------------------------------
-------------------审批人-申请者表------------------
---------------------------------------------------------------------------
DROP TABLE IF EXISTS `approver`;

CREATE TABLE

CREATE TABLE `approver` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `apply_id` INT(11) DEFAULT 1 COMMENT '申请人Id',
  `name` VARCHAR(30) NOT NULL COMMENT '审批人名字',
  `advice` VARCHAR(255) NULL COMMENT '审批人意见',
  `approver_time` VARCHAR(30) DEFAULT NULL COMMENT '审批时间',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='审批人-申请者信息'


-- 插入菜单数据
INSERT IGNORE INTO `approver` VALUES (1,1,'李哈哈','审批通过','2023-09-28 11:50:36');
INSERT IGNORE INTO `approver` VALUES (2,2,'李哈哈','审批通过','2023-09-28 11:50:36');
INSERT IGNORE INTO `approver` VALUES (3,1,'sjd','审批通过','2023-09-28 11:50:36');
INSERT IGNORE INTO `approver` VALUES (4,4,'sjd','审批通过','2023-09-28 11:50:36');

----------------------------------------------------------------------------------
--------------------------志愿者任务表---------------
----------------------------------------------------------------------------------
DROP TABLE IF EXISTS `task`;

CREATE TABLE

CREATE TABLE `task` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `implementer_id` INT(11) DEFAULT 1 COMMENT '实施人Id',
  `com_id` INT(11) DEFAULT 1 COMMENT '社区Id',
  `name` VARCHAR(30)  NULL COMMENT '任务名',
  `content` VARCHAR(1000) NULL COMMENT '任务内容',
  `score` INT(11) NULL COMMENT '任务总评分',
  `getscore` INT(11) NULL COMMENT '实际评分',
  `founder` VARCHAR(30) DEFAULT NULL COMMENT '创建人',
  `implementer` VARCHAR(30) DEFAULT NULL COMMENT '实施人',
  `comment` VARCHAR(255) DEFAULT NULL COMMENT '任务评价',
  `creat_time` VARCHAR(30) DEFAULT NULL COMMENT '创建时间',
  `finish_time` VARCHAR(30) DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='任务信息'


-- 插入菜单数据
INSERT IGNORE INTO `task` VALUES (1,1,1,'111','1111111111',5,1,'hhh','aaa','11111','2023-09-28 11:50:36',NULL);
INSERT IGNORE INTO `task` VALUES (2,1,1,'111','1111111111',5,1,'hhh','aaa','11111','2023-09-28 11:50:36',NULL);
INSERT IGNORE INTO `task` VALUES (3,2,1,'111','1111111111',5,1,'hhh','aaa2','11111','2023-09-28 11:50:36',NULL);
INSERT IGNORE INTO `task` VALUES (4,2,1,'111','1111111111',5,1,'hhh','aaa2','11111','2023-09-28 11:50:36',NULL);
INSERT IGNORE INTO `task` VALUES (5,2,2,'222','1111111111',5,1,'hhh','aaa2','11111','2023-09-28 11:50:36',NULL);


----------------------------------------------------------------------
---------------社区工作人员表-----------------
-----------------------------------------------------------------------
DROP TABLE IF EXISTS `staff`;

CREATE TABLE

CREATE TABLE `staff` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `com_id` INT(11) DEFAULT 1 COMMENT '社区Id',
  `name` VARCHAR(30) NOT NULL COMMENT '社区工作人员名字',
  `age` INT(11) NULL COMMENT '年龄',
  `sex` VARCHAR(5) NULL COMMENT '性别',
  `phone` VARCHAR(50) NULL COMMENT '电话',
  `address` VARCHAR(255)  NULL COMMENT '地址',
  `belong_community` VARCHAR(30) NULL COMMENT '所属社区',
  `belong_department` VARCHAR(30) NULL COMMENT '所属部门',
  `available` VARCHAR(30) NULL COMMENT '是否空闲',
  `score` INT(11) NULL COMMENT '总评分',
  `work_count` INT(11) NULL COMMENT '总任务数量',
  `skill` VARCHAR(255) NULL COMMENT '擅长技能',
  PRIMARY KEY (`id`),
  FOREIGN KEY(com_id) REFERENCES cum(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='社区工作人员信息'


-- 插入菜单数据
INSERT IGNORE INTO `staff` VALUES (1,1,'bbb',20,'女', '18709261268','11111','西柚小区1','执行部','空闲',10,2,'111');
INSERT IGNORE INTO `staff` VALUES (2,1,'bbb2',20,'女', '18709261268','11111','西柚小区1','执行部','空闲',10,2,'111');
INSERT IGNORE INTO `staff` VALUES (3,1,'bbb3',20,'女', '18709261268','11111','西柚小区1','执行部','不空闲',10,2,'111');
INSERT IGNORE INTO `staff` VALUES (4,1,'bbb4',20,'女', '18709261268','11111','西柚小区1','执行部','不空闲',10,2,'111');
INSERT IGNORE INTO `staff` VALUES (5,2,'bbb5',20,'女', '18709261268','11111','西柚小区2','执行部','不空闲',10,2,'111');


-----------------------------------------------------------------------------
------------社区工作人员-工作表-------------
------------------------------------------------------------------------------
DROP TABLE IF EXISTS `work`;

CREATE TABLE

CREATE TABLE `work` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `implementer_id` INT(11) DEFAULT 1 COMMENT '实施人Id',
  `com_id` INT(11) DEFAULT 1 COMMENT '社区Id',
  `name` VARCHAR(30)  NULL COMMENT '任务名',
  `content` VARCHAR(1000) NULL COMMENT '任务内容',
  `score` INT(11) NULL COMMENT '任务总评分',
  `getscore` INT(11) NULL COMMENT '实际评分',
  `founder` VARCHAR(30) DEFAULT NULL COMMENT '创建人',
  `implementer` VARCHAR(30) DEFAULT NULL COMMENT '实施人',
  `comment` VARCHAR(255) DEFAULT NULL COMMENT '任务评价',
  `creat_time` VARCHAR(30) DEFAULT NULL COMMENT '创建时间',
  `finish_time` VARCHAR(30) DEFAULT NULL COMMENT '完成时间',
  PRIMARY KEY (`id`)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='社区工作人员任务信息'


-- 插入菜单数据
INSERT IGNORE INTO `work` VALUES (1,1,1,'111','1111111111',5,1,'hhh','bbb','11111','2023-09-28 11:50:36',NULL);
INSERT IGNORE INTO `work` VALUES (2,1,1,'111','1111111111',5,1,'hhh','bbb','11111','2023-09-28 11:50:36',NULL);
INSERT IGNORE INTO `work` VALUES (3,2,1,'111','1111111111',5,1,'hhh','bbb2','11111','2023-09-28 11:50:36',NULL);
INSERT IGNORE INTO `work` VALUES (4,2,1,'111','1111111111',5,1,'hhh','bbb2','11111','2023-09-28 11:50:36',NULL);

--------------------------------------------------------------------------------
-------------------特殊人员表----------
--------------------------------------------------------------------------------
DROP TABLE IF EXISTS `innneed`;

CREATE TABLE

CREATE TABLE `inneed` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `com_id` INT(11) DEFAULT 1 COMMENT '社区Id',
  `name` VARCHAR(30) NOT NULL COMMENT '特殊人员名字',
  `age` INT(11) NULL COMMENT '年龄',
  `sex` VARCHAR(5) NULL COMMENT '性别',
  `phone` VARCHAR(50) NULL COMMENT '电话',
  `address` VARCHAR(255)  NULL COMMENT '地址',
  `belong_community` VARCHAR(30) NULL COMMENT '所属社区',
  `type` VARCHAR(30) NULL COMMENT '类型',
  `remarks` VARCHAR(1000) NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  FOREIGN KEY(com_id) REFERENCES cum(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='特殊人员信息'


-- 插入菜单数据
INSERT IGNORE INTO `inneed` VALUES (1,1,'ccc',60,'女', '18709261268','11111','西柚小区1','残障人士','111');
INSERT IGNORE INTO `inneed` VALUES (2,1,'ccc2',60,'女', '18709261268','11111','西柚小区1','残障人士','111');
INSERT IGNORE INTO `inneed` VALUES (3,1,'ccc3',60,'男', '18709261268','11111','西柚小区1','残障人士','111');
INSERT IGNORE INTO `inneed` VALUES (4,1,'ccc4',80,'女', '18709261268','11111','西柚小区1','老人','111');
INSERT IGNORE INTO `inneed` VALUES (5,2,'ccc5',60,'女', '18709261268','11111','西柚小区2','残障人士','111');


--------------------------------------------------------------------
-----------社区医院表------------------
--------------------------------------------------------------------
DROP TABLE IF EXISTS `hospital`;

CREATE TABLE

CREATE TABLE `hospital` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `com_id` INT(11) DEFAULT 1 COMMENT '社区Id',
  `name` VARCHAR(30) NOT NULL COMMENT '社区医院名字',
  `belong_community` VARCHAR(30) NULL COMMENT '所属社区',
  `phone` VARCHAR(50) NULL COMMENT '电话',
  `address` VARCHAR(255)  NULL COMMENT '地址',
  `remarks` VARCHAR(1000) NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  FOREIGN KEY(com_id) REFERENCES cum(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='社区医院信息'


-- 插入菜单数据
INSERT IGNORE INTO `hospital` VALUES (1,1,'ddd','西柚小区1','18709261628', '长安区','111');
INSERT IGNORE INTO `hospital` VALUES (2,1,'ddd2','西柚小区1','18709261628', '长安区','111');
INSERT IGNORE INTO `hospital` VALUES (3,1,'ddd3','西柚小区1','18709261628', '长安区','111');
INSERT IGNORE INTO `hospital` VALUES (4,1,'ddd4','西柚小区1','18709261628', '长安区','111');
INSERT IGNORE INTO `hospital` VALUES (5,2,'ddd5','西柚小区2','18709261628', '长安区','111');


--------------------------------------------------------------------
-------------------医生表----------------
--------------------------------------------------------------------
DROP TABLE IF EXISTS `doctor`;

CREATE TABLE

CREATE TABLE `doctor` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `hospital_id` INT(11) DEFAULT 1 COMMENT '社区医院Id',
  `name` VARCHAR(30) NOT NULL COMMENT '医生名字',
  `age` INT(11) NULL COMMENT '年龄',
  `sex` VARCHAR(5) NULL COMMENT '性别',
  `phone` VARCHAR(50) NULL COMMENT '电话',
  `belong_department` VARCHAR(30) NULL COMMENT '所属科室',
  `remarks` VARCHAR(1000) NULL COMMENT '备注',
  PRIMARY KEY (`id`),
  FOREIGN KEY(hospital_id) REFERENCES hospital(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='医生信息'


-- 插入菜单数据
INSERT IGNORE INTO `doctor` VALUES (1,1,'fff',24,'女','18709261628', '内科','111');
INSERT IGNORE INTO `doctor` VALUES (2,1,'fff2',24,'女','18709261628', '内科','111');
INSERT IGNORE INTO `doctor` VALUES (3,1,'fff3',24,'女','18709261628', '内科','111');
INSERT IGNORE INTO `doctor` VALUES (4,1,'fff4',24,'女','18709261628', '内科','111');
INSERT IGNORE INTO `doctor` VALUES (5,2,'fff5',24,'女','18709261628', '内科','111');

INSERT IGNORE INTO `doctor` VALUES (6,2,'fff999',24,'女','18709261628', '内科','111');


-------------------------------------------------------------------------------
------------健康小知识-----------
-------------------------------------------------------------------------------
DROP TABLE IF EXISTS `health`;

CREATE TABLE

CREATE TABLE `health` (
  `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `com_id` INT(11) DEFAULT 1 COMMENT '社区Id',
  `name` VARCHAR(30) NOT NULL COMMENT '标题',
  `content` VARCHAR(1000) NULL COMMENT '内容',
  `founder` VARCHAR(30) DEFAULT NULL COMMENT '创建人',
 `creat_time` VARCHAR(30) DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  FOREIGN KEY(com_id) REFERENCES cum(id)
) ENGINE=INNODB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='健康小知识'


-- 插入菜单数据
INSERT IGNORE INTO `health` VALUES (1,1,'ggg','11111','hhh', '2023-4-15 13:44:03');
INSERT IGNORE INTO `health` VALUES (2,1,'ggg2','11111','hhh', '2023-4-15 13:44:03');
INSERT IGNORE INTO `health` VALUES (3,1,'ggg3','11111','hhh', '2023-4-15 13:44:03');
INSERT IGNORE INTO `health` VALUES (4,1,'ggg4','11111','hhh', '2023-4-15 13:44:03');
INSERT IGNORE INTO `health` VALUES (5,2,'ggg5','11111','hhh', '2023-4-15 13:44:03');