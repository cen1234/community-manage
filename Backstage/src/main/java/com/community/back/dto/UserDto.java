package com.community.back.dto;

import com.baomidou.mybatisplus.annotation.TableField;
import com.community.back.entity.Menu;
import lombok.Data;

import java.util.List;

@Data
public class UserDto {
    private String username;
    private String userRealName;
    private String password;
    private String userImg;
    private Integer comId;
    private Integer roleId;
    private String token;

    @TableField(exist = false)
    private List<Menu> menus;
}
