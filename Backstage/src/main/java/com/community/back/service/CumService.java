package com.community.back.service;

import cn.hutool.core.bean.BeanUtil;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Cum;
import com.community.back.entity.Menu;
import com.community.back.entity.User;
import com.community.back.exception.ServiceException;
import com.community.back.mapper.CumMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

@Service
public class CumService extends ServiceImpl<CumMapper, Cum>{

    @Resource
    private CumMapper cumMapper;

    //新增|修改社区
    public boolean saveCommunity(Cum cum) {
        if (cum.getId() == null) {
            return save(cum);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(cum);//根据id进行修改
        }
    }

}
