package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.User;
import com.community.back.mapper.UserMapper;
import org.springframework.stereotype.Service;

@Service
public class UserService extends ServiceImpl<UserMapper,User> {

   //新增|修改用户
    public boolean saveUser(User user) {
        if (user.getId() == null) {
            return save(user);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(user);//根据id进行修改
        }
    }

}
