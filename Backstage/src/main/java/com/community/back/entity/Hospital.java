package com.community.back.entity;

import lombok.Data;

@Data
public class Hospital {
    private Integer id;
    private Integer comId;
    private String name;
    private String belongCommunity;
    private String phone;
    private String address;
    private String remarks;

}
