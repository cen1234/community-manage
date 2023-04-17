package com.community.back.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.community.back.entity.Rolemenu;
import org.apache.ibatis.annotations.Select;

import java.util.List;

public interface RolemenuMapper extends BaseMapper<Rolemenu> {

    @Select("select menu_id from rolemenu where role_id = #{roleId}")
    List<Integer> selectByRoleId(Integer roleId);
}
