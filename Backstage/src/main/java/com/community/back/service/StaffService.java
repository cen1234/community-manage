package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Staff;
import com.community.back.mapper.StaffMapper;
import org.springframework.stereotype.Service;

@Service
public class StaffService  extends ServiceImpl<StaffMapper, Staff>{

    //新增|修改社区工作人员
    public boolean saveStaff(Staff staff) {
        if (staff.getId() == null) {
            return save(staff);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(staff);//根据id进行修改
        }
    }
}
