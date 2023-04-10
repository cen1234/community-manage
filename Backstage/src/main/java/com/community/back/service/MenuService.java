package com.community.back.service;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Menu;
import com.community.back.mapper.MenuMapper;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuService extends ServiceImpl<MenuMapper, Menu>{

//    获取全部菜单信息
    public List<Menu> find(Integer roleId) {
        //查询出所有数据
        QueryWrapper<Menu> queryWrapper = new QueryWrapper<>();
        if (roleId != 0) {
            queryWrapper.like("role_id",roleId);
        }
        List<Menu> list = list(queryWrapper);
        //找出pid为null的一级菜单
        List<Menu> parentNode= list.stream().filter(menu -> menu.getPid() == null).collect(Collectors.toList());
        //找出一级菜单的子菜单
        for (Menu menu:parentNode) {
            menu.setChildren(list.stream().filter(m -> menu.getMenuId().equals(m.getPid())).collect(Collectors.toList()));
        }

        return parentNode;
    }
}
