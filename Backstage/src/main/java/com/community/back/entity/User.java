package com.community.back.entity;

import lombok.Data;

@Data
public class User {
    private Integer id;
    private Integer roleId;
    private String username;
    private String userRealName;
    private String password;
    private String sex;
    private Integer age;
    private String phone;
    private String address;
    private String userImg;
}
