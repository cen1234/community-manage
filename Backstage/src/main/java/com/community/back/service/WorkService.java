package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Task;
import com.community.back.entity.Work;
import com.community.back.mapper.WorkMapper;
import org.springframework.stereotype.Service;

@Service
public class WorkService extends ServiceImpl<WorkMapper, Work> {

    //新增|修改任务
    public boolean saveWork(Work work) {
        if (work.getId() == null) {
            return save(work);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(work);//根据id进行修改
        }
    }
}
