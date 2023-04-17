package com.community.back.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Menu;
import com.community.back.entity.Role;
import com.community.back.entity.Rolemenu;
import com.community.back.mapper.MenuMapper;
import com.community.back.mapper.RoleMapper;
import com.community.back.mapper.RolemenuMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import javax.annotation.Resource;
import java.util.List;

@Service
public class RoleService extends ServiceImpl<RoleMapper, Role>{

    @Resource
    private RoleMapper roleMapper;

    @Resource
    private MenuService menuService;

    @Resource
    private MenuMapper menuMapper;

    @Resource
    private RolemenuMapper rolemenuMapper;


//    绑定角色与菜单的关系
    @Transactional
    public void setRoleMenu(Integer roleId, List<Integer> menuIds) {
        //先删除角色与菜单的对应关系
        QueryWrapper<Rolemenu> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role_id",roleId);
        rolemenuMapper.delete(queryWrapper);
        //再根据前端传过来的关系建立新的对应关系
        for (Integer menuId:menuIds) {
            Rolemenu rolemenu = new Rolemenu();
            rolemenu.setRoleId(roleId);
            rolemenu.setMenuId(menuId);
            rolemenuMapper.insert(rolemenu);
        }
    }
}
