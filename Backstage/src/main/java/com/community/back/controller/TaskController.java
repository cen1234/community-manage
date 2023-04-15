package com.community.back.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.community.back.entity.Task;
import com.community.back.service.TaskService;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.Collection;

@RestController
@RequestMapping("/task")
public class TaskController {

    @Resource
    private TaskService taskService;

//    -----------
//    根据实施者id分页获取任务信息
//    -----------
    @GetMapping("pageImplementer")
    public IPage<Task> findPageImplementer(@RequestParam Integer pageNum,
                                     @RequestParam Integer pageSize,
                                     @RequestParam Integer implementerId
    ) {
        IPage<Task> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Task> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("implementer_id",implementerId);
        return taskService.page(page,queryWrapper);
    }

//    -------------
//    分页获取当前社区所有任务
//    -------------
    @GetMapping("page")
    public IPage<Task> findPage(@RequestParam Integer pageNum,
                                @RequestParam Integer pageSize,
                                @RequestParam Integer comId,
                                @RequestParam(defaultValue = "") String search,
                                @RequestParam String type
    ) {
        IPage<Task> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Task> queryWrapper = new QueryWrapper<>();
        switch (type) {
            case "founder":{
                queryWrapper.like("founder",search);
                break;
            }
            case "name":{
                queryWrapper.like("name",search);
                break;
            }
            case "implementer":{
                queryWrapper.like("implementer",search);
                break;
            }
        }
        queryWrapper.like("com_id",comId);
        return taskService.page(page,queryWrapper);
    }


//    ---------------
//    新增|修改任务
//    --------------
     @PostMapping
    public boolean save(@RequestBody Task task) {
        return taskService.saveTask(task);
    }


//      ------
//      删除任务
//      ------
    @PostMapping("/delete/{id}")
    public boolean deleteById(@PathVariable Integer id) {
        return taskService.removeById(id);
    }

    @PostMapping("/deleteSelect/{idlist}")
    public  boolean deleteByIds(@PathVariable Collection idlist) {
        return taskService.removeByIds(idlist);
    }
}
