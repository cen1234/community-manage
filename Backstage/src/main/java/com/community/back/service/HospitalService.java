package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Hospital;
import com.community.back.mapper.HospitalMapper;
import org.springframework.stereotype.Service;



@Service
public class HospitalService extends ServiceImpl<HospitalMapper, Hospital>{

    //新增|修改社区医院
    public boolean saveHospital(Hospital hospital) {
        if (hospital.getId() == null) {
            return save(hospital);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(hospital);//根据id进行修改
        }
    }
}
