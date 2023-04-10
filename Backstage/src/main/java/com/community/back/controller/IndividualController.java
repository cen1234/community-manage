package com.community.back.controller;

import com.community.back.entity.User;
import com.community.back.service.IndividualService;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/individual")
public class IndividualController {

    @Resource
    private IndividualService individualService;

//    ------
//    获取当前登录用户信息
//    ------
     @GetMapping
    public User get(@RequestParam String username) {
       return individualService.get(username);
     }

//    ------
//    修改当前登录用户信息
//    ------
     @PostMapping
     public boolean update(@RequestBody User user) {
         return individualService.edit(user);
     }


}
