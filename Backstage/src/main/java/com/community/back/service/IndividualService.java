package com.community.back.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.User;
import com.community.back.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class IndividualService extends ServiceImpl<UserMapper, User> {

    //获取当前登录用户信息
    public User get(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username",username);
        return  getOne(queryWrapper);
    }

    //修改当前登录用户信息
    public boolean edit(User user) {
        return updateById(user);
    }
}
