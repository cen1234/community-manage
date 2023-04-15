package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Cum;
import com.community.back.entity.Volunteer;
import com.community.back.mapper.CumMapper;
import com.community.back.mapper.VolunteerMapper;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;


@Service
public class VolunteerService extends ServiceImpl<VolunteerMapper, Volunteer>{


    //新增|修改志愿者
    public boolean saveVolunteer(Volunteer volunteer) {
        if (volunteer.getId() == null) {
            return save(volunteer);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(volunteer);//根据id进行修改
        }
    }
}
