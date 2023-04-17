package com.community.back.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.community.back.entity.Staff;
import org.apache.ibatis.annotations.Select;

public interface StaffMapper extends BaseMapper<Staff> {

    @Select("select * from staff where name = #{name}")
    Staff getByName(String name);
}
