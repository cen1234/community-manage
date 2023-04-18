package com.community.back.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.community.back.entity.User;
import org.apache.ibatis.annotations.Select;

public interface UserMapper extends BaseMapper<User> {

    @Select("select password from user where phone = #{phone}")
    String getPwd(String phone);
}
