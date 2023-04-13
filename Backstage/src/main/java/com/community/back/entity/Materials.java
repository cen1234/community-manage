package com.community.back.entity;

import lombok.Data;

@Data
public class Materials {
    private Integer id;
    private Integer comId;
    private String name;
    private Integer count;
    private String belongCommunity;
    private String available;
    private Integer borrowedCount;
    private String isExpand;
}
