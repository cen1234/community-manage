package com.community.back.entity;

import lombok.Data;

@Data
public class Work {
    private Integer id;
    private Integer implementerId;
    private Integer comId;
    private String name;
    private String content;
    private Integer score;
    private Integer getscore;
    private String founder;
    private String implementer;
    private String comment;
    private String creatTime;
    private String finishTime;
}
