package com.community.back.entity;

import lombok.Data;

@Data
public class Health {
    private Integer id;
    private Integer comId;
    private String name;
    private String content;
    private String founder;
    private String creatTime;
}
