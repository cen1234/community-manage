package com.community.back.service;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Cum;
import com.community.back.mapper.CumMapper;
import org.springframework.stereotype.Service;




@Service
public class CumService extends ServiceImpl<CumMapper, Cum>{


    //新增|修改社区
    public boolean saveCommunity(Cum cum) {
        if (cum.getId() == null) {
            return save(cum);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(cum);//根据id进行修改
        }
    }

}
