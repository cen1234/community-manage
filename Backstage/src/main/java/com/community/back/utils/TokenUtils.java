package com.community.back.utils;

import cn.hutool.core.date.DateUnit;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.community.back.entity.User;
import com.community.back.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import javax.annotation.PostConstruct;
import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;

@Component
public class TokenUtils {
    private static UserService userStaticService;

    @Resource
    private UserService userService;

    @PostConstruct
    public void setUserService() {
        userStaticService = userService;
    }

    //生成Token
    public static String genToken(String userId,String sign) {
        return JWT.create().withAudience(userId) // 将 user id 保存到 token 里面
                .withExpiresAt(DateUtil.offsetHour(new Date(),2)) //2小时后token过期
                .sign(Algorithm.HMAC256(sign)); // 以 password 作为 token 的密钥
    }

    //获取当前登录用户信息
    public static User getCurrentUser() {
        try {
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
            String token = request.getHeader("token");
            if (!StrUtil.isBlank(token)) {
                String userId = JWT.decode(token).getAudience().get(0);
                return  userStaticService.getById(Integer.valueOf(userId));
            }

        } catch (Exception e) {
            return null;
        }
        return  null;
    }
}
