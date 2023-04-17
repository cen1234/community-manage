package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Rolemenu;
import com.community.back.mapper.RolemenuMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.List;


@Service
public class RolemenuService extends ServiceImpl<RolemenuMapper, Rolemenu>{

    @Resource
    private RolemenuMapper rolemenuMapper;

    //新增|修改身份菜单
    public boolean saveRoleMenu(Rolemenu rolemenu) {
        if (rolemenu.getId() == null) {
            return save(rolemenu);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(rolemenu);//根据id进行修改
        }
    }

    //    获取角色id所绑定的菜单
    public List<Integer> selectByRoleId(Integer id) {
        return rolemenuMapper.selectByRoleId(id);
    }
}
