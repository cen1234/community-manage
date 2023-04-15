package com.community.back.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;


@Data
public class Volunteer {
    private Integer id;
    private Integer comId;
    private String name;
    private Integer age;
    private String sex;
    private String phone;
    private String address;
    private String belongCommunity;
    private String available;
    private Integer score;
    private Integer workCount;
    private String skill;
    private String formal;
    private String  applyTime;
    private String formalTime;
    private String approver;

    @TableField(exist = false)
    private String isFinal;
}
