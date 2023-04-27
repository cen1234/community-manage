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
import com.community.back.entity.Materials;
import com.community.back.entity.Usermaterials;
import com.community.back.entity.Volunteer;
import com.community.back.service.MaterialsService;
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
@RequestMapping("/materials")
public class MaterialsController {

    @Resource
    private MaterialsService materialsService;


//    -----
//    查找全部
//    -----
    @GetMapping("/findAll")
    public List<Materials> find( @RequestParam Integer comId) {
        QueryWrapper<Materials> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("com_id",comId);
        return materialsService.list();
    }

//    ------
//    分页查询
//    ------

    @GetMapping("page")
    public IPage<Materials> findPage(@RequestParam Integer pageNum,
                               @RequestParam Integer pageSize,
                               @RequestParam(defaultValue = "") String search,
                               @RequestParam String type,
                               @RequestParam Integer comId
    ) {
        IPage<Materials> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Materials> queryWrapper = new QueryWrapper<>();
        switch (type) {
            case "available": {
                queryWrapper.like("available", search);
                break;
            }
            case "name":{
                queryWrapper.like("name",search);
                break;
            }
        }
        queryWrapper.like("com_id",comId);
        return materialsService.page(page,queryWrapper);
    }

    //根据物资id获取物资的信息
    @GetMapping("/getInfo")
    public Materials myBorrowed(@RequestParam Integer id) {
        return materialsService.getById(id);
    }



//    ------
//    新增|修改
//    ------
    @PostMapping
    public boolean save(@RequestBody Materials materials) {
        return materialsService.saveCommunity(materials);
    }

    //      ------
//      删除社区
//      ------
    @PostMapping("/delete/{id}")
    public boolean deleteById(@PathVariable Integer id) {
        return materialsService.removeById(id);
    }

    @PostMapping("/deleteSelect/{idlist}")
    public  boolean deleteByIds(@PathVariable Collection idlist) {
        return materialsService.removeByIds(idlist);
    }

//    ------
//    导入社区
//    ------
    @PostMapping("/import")
    public void importCommunity(MultipartFile file) throws Exception {
        InputStream inputStream = file.getInputStream();
        ExcelReader reader = ExcelUtil.getReader(inputStream);
        List<Materials> list = reader.readAll(Materials.class);
        materialsService.saveBatch(list);
    }

//    ------
//    导出社区
//    ------
    @GetMapping("/export/{comId}")
    public void export(HttpServletResponse response,@PathVariable Integer comId) throws Exception{
        //从数据库中查出所有数据
        QueryWrapper<Materials> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("com_id",comId);
        List<Materials> list = materialsService.list();

        //在内存操作，写出到浏览器
        ExcelWriter writer = ExcelUtil.getWriter(true);
        //自定义标题名
        writer.addHeaderAlias("id","ID");
        writer.addHeaderAlias("comId","所在社区码");
        writer.addHeaderAlias("name","物资名");
        writer.addHeaderAlias("count","物资总数");
        writer.addHeaderAlias("belongCommunity","所属社区");
        writer.addHeaderAlias("available","物资是否可用");
        writer.addHeaderAlias("borrowedCount","总借用数量");

        //一次性写出list内的对象到excel，使用默认样式，强制输出标题
        writer.write(list,true);
        //定义单元格背景色
        StyleSet style = writer.getStyleSet();
        //设置内容字体
        Font font = writer.createFont();
        font.setFontHeightInPoints((short) 12);
        //重点，设置中文字体
        font.setFontName("宋体");
        //第二个参数表示是否忽略头部样式
        style.getHeadCellStyle().setFont(font);
        int columnCount = writer.getColumnCount();
        for (int i = 0; i < columnCount; ++i) {
            double width = SheetUtil.getColumnWidth(writer.getSheet(), i, false);
            if (width != -1.0D) {
                width *= 256.0D;
                //此处可以适当调整，调整列空白处宽度
                width += 220D;
                writer.setColumnWidth(i, Math.toIntExact(Math.round(width / 256D)));
            }
        }
        //设置浏览器响应格式
        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8");
        String fileName = URLEncoder.encode("物资信息","UTF-8");
        response.setHeader("Content-Disposition","attachment;filename="+fileName+".xlsx");

        ServletOutputStream out=response.getOutputStream();
        writer.flush(out, true);
        out.close();
        // 关闭writer，释放内存
        writer.close();

    }


}
