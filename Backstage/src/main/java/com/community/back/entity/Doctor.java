package com.community.back.entity;

import lombok.Data;

@Data
public class Doctor {
    private Integer id;
    private Integer hospitalId;
    private String name;
    private Integer age;
    private String sex;
    private String phone;
    private String belongDepartment;
    private String remarks;

}
