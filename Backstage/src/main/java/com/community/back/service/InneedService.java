package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Inneed;
import com.community.back.mapper.InneedMapper;
import org.springframework.stereotype.Service;

@Service
public class InneedService extends ServiceImpl<InneedMapper, Inneed>{

    //新增|修改特殊人员
    public boolean saveInneed(Inneed inneed) {
        if (inneed.getId() == null) {
            return save(inneed);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(inneed);//根据id进行修改
        }
    }
}
