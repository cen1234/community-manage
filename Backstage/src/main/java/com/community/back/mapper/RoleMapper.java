package com.community.back.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.community.back.entity.Role;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import sun.reflect.generics.tree.VoidDescriptor;

import java.util.List;

public interface RoleMapper extends BaseMapper<Role>{

    @Select("select menu.menu_id from menu,role where role_id = #{roleId} and menu.role_id = role.id")
    List<Integer> selectByRoleId(Integer roleId);

}
