package com.community.back.dto;

import lombok.Data;

@Data
public class UserDto {
    private String username;
    private String password;
    private String token;
}
