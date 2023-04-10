package com.community.back.config;


import com.community.back.config.interceptor.JWTinterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class InterceptorConfig implements WebMvcConfigurer{
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwTinterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns("/user/login","/user/register","/**/export","/file/**","/**");//拦截所有请求，通过判断token是否合法来决定是否需要登录
    }

    @Bean
    public JWTinterceptor jwTinterceptor() {
        return new JWTinterceptor();
    }
}
