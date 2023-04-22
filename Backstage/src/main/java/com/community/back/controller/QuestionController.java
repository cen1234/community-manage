package com.community.back.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.community.back.entity.Question;
import com.community.back.service.QuestionService;
import org.springframework.web.bind.annotation.*;
import javax.annotation.Resource;
import java.util.List;

@RestController
@RequestMapping("/question")
public class QuestionController {

    @Resource
    private QuestionService questionService;


//    -----
//    用户查找自己的全部问题
//    -----
    @GetMapping("/findAll")
    public List<Question> userfind(@RequestParam Integer comId, @RequestParam String founder) {
        QueryWrapper<Question> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("com_id",comId);
        queryWrapper.eq("founder",founder);
        return questionService.list(queryWrapper);
    }

//    -------
//    查找所有解决的问题
//    -------
    @GetMapping("/findNoSolve")
    public List<Question> findNoSolve(@RequestParam Integer comId,@RequestParam String isSolve) {
        QueryWrapper<Question> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("com_id",comId);
        queryWrapper.like("is_solve",isSolve);
        return questionService.list(queryWrapper);
    }

 //    ------
//    分页查询未解决的问题
//    ------

    @GetMapping("page")
    public IPage<Question> Page(@RequestParam Integer pageNum,
                                           @RequestParam Integer pageSize,
                                           @RequestParam(defaultValue = "") String search,
                                           @RequestParam Integer comId
    ) {
        IPage<Question> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Question> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("com_id",comId);
        queryWrapper.like("founder",search);
        queryWrapper.like("is_solve","否");
        return questionService.page(page,queryWrapper);
    }

//    -----
//    根据问题id获取具体数据
//    -----
    @PostMapping("/getQuestion/{id}")
    public Question getById(@PathVariable Integer id) {
        return questionService.getById(id);
    }

//    ------
//    新增|修改
//    ------
    @PostMapping
    public boolean save(@RequestBody Question question) {
        return questionService.saveQuestion(question);
    }


//      ------
//      删除
//      ------
    @PostMapping("/delete/{id}")
    public boolean deleteById(@PathVariable Integer id) {
        return questionService.removeById(id);
    }




}
