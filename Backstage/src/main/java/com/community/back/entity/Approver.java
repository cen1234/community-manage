package com.community.back.entity;

import lombok.Data;

@Data
public class Approver {
    private Integer id;
    private Integer applyId;
    private String name;
    private String advice;
    private String approverTime;

}
