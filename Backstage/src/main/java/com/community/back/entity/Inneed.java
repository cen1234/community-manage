package com.community.back.entity;

import lombok.Data;

@Data
public class Inneed {

    private Integer id;
    private Integer comId;
    private String name;
    private Integer age;
    private String sex;
    private String phone;
    private String address;
    private String belongCommunity;
    private String type;
    private String remarks;

}
