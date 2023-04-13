package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Materials;
import com.community.back.mapper.MaterialsMapper;
import org.springframework.stereotype.Service;

@Service
public class MaterialsService extends ServiceImpl<MaterialsMapper, Materials> {


    public boolean saveCommunity(Materials materials) {
        if (materials.getId() == null) {
            return save(materials);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(materials);//根据id进行修改
        }
    }
}
