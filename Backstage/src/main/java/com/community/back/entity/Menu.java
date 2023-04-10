package com.community.back.entity;

import lombok.Data;
import com.baomidou.mybatisplus.annotation.TableField;
import java.util.List;

@Data
public class Menu {
    private Integer id;
    private Integer menuId;
    private Integer pid;
    private Integer roleId;
    private String  name;
    private String  description;
    private String  path;
    private String  icon;

    @TableField(exist = false)
    private List<Menu> children;
}
