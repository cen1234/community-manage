package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Doctor;
import com.community.back.entity.Hospital;
import com.community.back.mapper.DoctorMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;


@Service
public class DoctorService extends ServiceImpl<DoctorMapper, Doctor>{
    //新增|修改医生
    public boolean saveDoctor(Doctor doctor) {
        if (doctor.getId() == null) {
            return save(doctor);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(doctor);//根据id进行修改
        }
    }
}
