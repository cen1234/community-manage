package com.community.back.service;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.community.back.entity.Question;
import com.community.back.mapper.QuestionMapper;
import org.springframework.stereotype.Service;


@Service
public class QuestionService extends ServiceImpl<QuestionMapper, Question>{
    //新增|修改问题
    public boolean saveQuestion(Question question) {
        if (question.getId() == null) {
            return save(question);//mybatis-plus提供的方法，表示插入数据
        } else {
            return updateById(question);//根据id进行修改
        }
    }
}
