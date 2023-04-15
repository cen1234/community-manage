package com.community.back.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.community.back.entity.Work;
import com.community.back.service.WorkService;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;


@RestController
@RequestMapping("/work")
public class WorkController {

    @Resource
    private WorkService workService;

//    -------------
//    分页获取当前社区所有任务
//    -------------
    @GetMapping("page")
    public IPage<Work> findPage(@RequestParam Integer pageNum,
                                @RequestParam Integer pageSize,
                                @RequestParam Integer comId,
                                @RequestParam(defaultValue = "") String search,
                                @RequestParam String type
    ) {
        IPage<Work> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Work> queryWrapper = new QueryWrapper<>();
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
        return workService.page(page,queryWrapper);
    }


//    ---------------
//    新增|修改任务
//    --------------
    @PostMapping
    public boolean save(@RequestBody Work work) {
        return workService.saveWork(work);
    }

}
