package com.community.back.controller;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import cn.hutool.poi.excel.StyleSet;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.community.back.entity.Cum;
import com.community.back.entity.Materials;
import com.community.back.entity.User;
import com.community.back.entity.Usermaterials;
import com.community.back.service.CumService;
import com.community.back.service.MaterialsService;
import com.community.back.service.UsermaterialsService;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.util.SheetUtil;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/userMaterials")
public class UsermaterialsController {

    @Resource
    private UsermaterialsService usermaterialsService;

//    -------
//    根据物资id获取当前借用人与物资的关系信息
//    -------
    @GetMapping("/findBorrowed")
    public List<Usermaterials> getBorrowed(@RequestParam Integer materialsId) {
        QueryWrapper<Usermaterials> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("materials_id",materialsId);
        return usermaterialsService.list(queryWrapper);
    }

//    --------
//    新增|编辑物资借用人关系
//    --------
      @PostMapping
      public boolean save(@RequestBody Usermaterials usermaterials) {
          return usermaterialsService.saveCommunity(usermaterials);
      }
}
