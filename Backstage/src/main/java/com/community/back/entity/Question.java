package com.community.back.entity;

import lombok.Data;

@Data
public class Question {
    private Integer id;
    private Integer comId;
    private String content;
    private String founder;
    private String creatTime;
    private String isSolve;
}
