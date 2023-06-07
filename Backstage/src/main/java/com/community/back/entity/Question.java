package com.community.back.entity;

import lombok.Data;

import java.io.Serializable;

@Data
public class Question implements Serializable {
    private Integer id;
    private Integer comId;
    private String content;
    private String founder;
    private String userImg;
    private String creatTime;
    private String isSolve;
}
