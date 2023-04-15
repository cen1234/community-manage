package com.community.back.service;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Task;
import com.community.back.entity.Volunteer;
import com.community.back.mapper.TaskMapper;
import org.springframework.stereotype.Service;

@Service
public class TaskService extends ServiceImpl<TaskMapper, Task> {

    //新增|修改任务
    public boolean saveTask(Task task) {
        if (task.getId() == null) {
            return save(task);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(task);//根据id进行修改
        }
    }
}
