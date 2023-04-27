package com.community.back.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;

@Data
public class Cum {

    private Integer id;
    private String name;
    private String province;
    private String city;
    private String area;
    private String address;

    @TableField(exist = false)
    private Integer comId;


}
