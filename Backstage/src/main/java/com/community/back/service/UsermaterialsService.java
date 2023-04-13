package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Usermaterials;
import com.community.back.mapper.UsermaterialsMapper;
import org.springframework.stereotype.Service;

@Service
public class UsermaterialsService extends ServiceImpl<UsermaterialsMapper, Usermaterials> {

    public boolean saveCommunity(Usermaterials usermaterials) {
        if (usermaterials.getId() == null) {
            return save(usermaterials);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(usermaterials);//根据id进行修改
        }
    }
}
