package com.community.back.service;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.common.Constants;
import com.community.back.dto.UserDto;
import com.community.back.entity.Menu;
import com.community.back.entity.User;
import com.community.back.exception.ServiceException;
import com.community.back.mapper.RoleMapper;
import com.community.back.mapper.RolemenuMapper;
import com.community.back.mapper.UserMapper;
import com.community.back.utils.TokenUtils;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class UserService extends ServiceImpl<UserMapper,User> {

    @Resource
    private MenuService menuService;

    @Resource
    private RoleMapper roleMapper;

    @Resource
    private RolemenuMapper rolemenuMapper;

   //新增|修改用户
    public boolean saveUser(User user) {
        if (user.getId() == null) {
            return save(user);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(user);//根据id进行修改
        }
    }

    //登录
    public UserDto login(UserDto userDto) {
        User  oneData = getUserInfo(userDto);
        if (oneData !=null) {
            BeanUtil.copyProperties(oneData,userDto,true);
            //设置Token
            String token = TokenUtils.genToken(oneData.getId().toString(),oneData.getPassword());
            userDto.setToken(token);

            //获取用户角色对应的菜单功能
            Integer roleId = oneData.getRoleId();
            userDto.setMenus(getRoleMenus(roleId));
            return userDto;
        } else {
            throw new ServiceException(Constants.CODE_600,"用户名或密码错误!");
        }
    }

    //注册
    public User register(UserDto userDto) {
        User  oneData = getUserInfo(userDto);
        //如果当前数据库中找不到与注册的信息一样的用户，那么给数据库中插入注册的用户信息
        if (oneData == null) {
            oneData = new User();
            BeanUtil.copyProperties(userDto,oneData,true);
            save(oneData);
        } else {
            throw new ServiceException(Constants.CODE_600,"用户已经存在！");
        }
        return oneData;
    }

    //获取用户信息
    public User  getUserInfo(UserDto userDto) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username",userDto.getUsername());
        queryWrapper.eq("password",userDto.getPassword());
        User oneData;
        try {
            oneData =getOne(queryWrapper);//从数据库根据queryWrapper查询条件查询数据
        } catch (Exception e) {
            throw new ServiceException(Constants.CODE_500,"系统错误!");
        }
        return oneData;
    }

    //获取当前角色的菜单
    private List<Menu> getRoleMenus(Integer roleId) {

        List<Integer> menuIds = rolemenuMapper.selectByRoleId(roleId);
        //查出所有菜单
        List<Menu> menus = menuService.find();
        //筛选出用户对应的菜单
        List<Menu> userMenus =new ArrayList<>();
        for (Menu menu:menus) {
            if (menuIds.contains(menu.getId())) {
                userMenus.add(menu);
            }
            List<Menu> children = menu.getChildren();
            children.removeIf(child ->!menuIds.contains(child.getId()));
        }
        return userMenus;
    }

}
