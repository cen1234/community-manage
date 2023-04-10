package com.community.back.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Menu;
import com.community.back.entity.Role;
import com.community.back.mapper.MenuMapper;
import com.community.back.mapper.RoleMapper;
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

//    获取角色所绑定的菜单
    public List<Integer> selectByRoleId(Integer id) {
        return roleMapper.selectByRoleId(id);
    }

//    绑定角色与菜单的关系
    public void setRoleMenu(Integer roleId, List<Integer> menuIds) {
        //先删除角色与菜单的对应关系
        QueryWrapper<Menu> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("role_id",roleId);
        menuMapper.delete(queryWrapper);
       //再根据前端传过来的关系建立新的对应关系
        for (Integer menuId:menuIds) {
            Menu roleMenu = new Menu();
            roleMenu.setMenuId(menuId);
            roleMenu.setRoleId(roleId);
            switch(menuId) {
                case 1: {
                    roleMenu.setName("账号与用户");
                    roleMenu.setDescription("111");
                    roleMenu.setIcon("user");
                    break;
                }
                case 2: {
                    roleMenu.setPid(1);
                    roleMenu.setName("账号管理");
                    roleMenu.setDescription("111");
                    roleMenu.setPath("/user");
                    break;
                }
                case 3: {
                    roleMenu.setPid(1);
                    roleMenu.setName("用户问题追踪");
                    roleMenu.setDescription("111");
                    roleMenu.setPath("/userquestion");
                    break;
                }
                case 4: {
                    roleMenu.setName("权限管理");
                    roleMenu.setDescription("111");
                    roleMenu.setPath("/role");
                    roleMenu.setIcon("key");
                    break;
                }
                case 5: {
                    roleMenu.setName("社区管理");
                    roleMenu.setDescription("111");
                    roleMenu.setPath("/community");
                    roleMenu.setIcon("home");
                    break;
                }
                case 6: {
                    roleMenu.setName("社区工作人员");
                    roleMenu.setDescription("111");
                    roleMenu.setIcon("solution");
                    break;
                }
                case 7: {
                    roleMenu.setPid(6);
                    roleMenu.setName("工作人员信息管理");
                    roleMenu.setDescription("111");
                    roleMenu.setPath("/staffinfo");
                    break;
                }
            }
            menuService.save(roleMenu);
        }
    }
}
