package com.community.back.entity;

import lombok.Data;

@Data
public class Usermaterials {

    private Integer id;
    private Integer materialsId;
    private String userName;
    private String materialsName;
    private Integer count;
    private String back;
    private String phone;
    private String address;
    private String time;
}
