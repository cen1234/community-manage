package com.community.back.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.community.back.entity.User;
import com.community.back.mapper.UserMapper;
import com.community.back.service.UserService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;


//    -----
//    查找全部
//    -----
    @GetMapping("/findAll")
    public List<User> find() {
        return userService.list();
    }

//    ------
//    分页查询
//    ------
//    ------
//    分页查询
//    使用mybatis-plus方法进行分页查询
//    @RequestParam接收： ？pageNum=1&pageSize=10
//    设置page条件：哪一页和页的数据多少条；
//    设置查询条件：queryWrapper；
//    用户可以根据 username，realname，email，phone这些关键词进行模糊查询，并带上type
//    ------
      @GetMapping("page")
      public IPage<User> findPage(@RequestParam Integer pageNum,
                                  @RequestParam Integer pageSize,
                                  @RequestParam(defaultValue = "") String search,
                                  @RequestParam(defaultValue = "name") String type,
                                  @RequestParam Integer roleId) {
    IPage<User> page = new Page<>(pageNum,pageSize);
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    switch (type) {
        case "realname":{
             queryWrapper.like("user_real_name",search);
             break;
        }
        case "name":{
            queryWrapper.like("username",search);
            break;
        }
        case "phone":{
            queryWrapper.like("phone",search);
            break;
        }
    }
    queryWrapper.like("role_id",roleId);
    return userService.page(page,queryWrapper);
}


//    ------
//    新增|修改用户
//    ------
    @PostMapping
    //@RequestBody将前台传过来的参数转化为User对象
    public boolean save(@RequestBody User user) {
    return userService.saveUser(user);
}

//      ------
//      删除用户
//      ------
    @DeleteMapping("/{id}")
    public boolean deleteById(@PathVariable Integer id) {
        return userService.removeById(id);
    }

    @DeleteMapping
    public  boolean deleteByIds(@RequestParam Collection idlist) {
        return userService.removeByIds(idlist);
    }

}
