package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Health;
import com.community.back.mapper.HealthMapper;

import org.springframework.stereotype.Service;

import javax.annotation.Resource;


@Service
public class HealthService extends ServiceImpl<HealthMapper, Health>{
    //新增|修改社区医院
    public boolean saveHealth(Health health) {
        if (health.getId() == null) {
            return save(health);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(health);//根据id进行修改
        }
    }
}
