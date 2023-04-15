package com.community.back.entity;

import lombok.Data;

@Data
public class Staff {
    private Integer id;
    private Integer comId;
    private String name;
    private Integer age;
    private String sex;
    private String phone;
    private String address;
    private String belongCommunity;
    private String belongDepartment;
    private String available;
    private Integer score;
    private Integer workCount;
    private String skill;
}
