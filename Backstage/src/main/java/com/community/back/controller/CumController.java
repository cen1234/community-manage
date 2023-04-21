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
import com.community.back.entity.User;
import com.community.back.service.CumService;
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
@RequestMapping("/community")
public class CumController {

    @Resource
    private CumService cumService;

//    -----
//    查找全部
//    -----
    @GetMapping("/findAll")
    public List<Cum> find() {
        return cumService.list();
    }

//    ------
//    分页查询
//    ------

    @GetMapping("page")
    public IPage<Cum> findPage(@RequestParam Integer pageNum,
                                @RequestParam Integer pageSize,
                                @RequestParam(defaultValue = "") String search,
                                @RequestParam String type
                                ) {
        IPage<Cum> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Cum> queryWrapper = new QueryWrapper<>();
        switch (type) {
            case "province":{
                queryWrapper.like("province",search);
                break;
            }
            case "city":{
                queryWrapper.like("city",search);
                break;
            }
            case "area":{
                queryWrapper.like("area",search);
                break;
            }
            case "name":{
                queryWrapper.like("name",search);
                break;
            }
        }
        return cumService.page(page,queryWrapper);
    }

    //根据comId获取小区名字
    @GetMapping("/getName")
    public Cum findName(@RequestParam Integer comId) {
        return cumService.getById(comId);
    }
    @GetMapping("/Name")
    public Cum findCommunityName(@RequestParam Integer id) {
        return cumService.getById(id);
    }




//    ------
//    新增|修改社区
//    ------
    @PostMapping
    public boolean save(@RequestBody Cum cum) {
        return cumService.saveCommunity(cum);
    }

//      ------
//      删除社区
//      ------
    @PostMapping("/delete/{id}")
    public boolean deleteById(@PathVariable Integer id) {
        return cumService.removeById(id);
    }

    @PostMapping("/deleteSelect/{idlist}")
    public  boolean deleteByIds(@PathVariable Collection idlist) {
        return cumService.removeByIds(idlist);
    }

//    ------
//    导入社区
//    ------
    @PostMapping("/import")
    public void importCommunity(MultipartFile file) throws Exception {
        InputStream inputStream = file.getInputStream();
        ExcelReader reader = ExcelUtil.getReader(inputStream);
        List<Cum> list = reader.readAll(Cum.class);
        cumService.saveBatch(list);
    }

//    ------
//    导出社区
//    ------
    @GetMapping("/export")
    public void export(HttpServletResponse response) throws Exception{
        //从数据库中查出所有数据
        List<Cum> list = cumService.list();

        //在内存操作，写出到浏览器
        ExcelWriter writer = ExcelUtil.getWriter(true);
        //自定义标题名
        writer.addHeaderAlias("id","ID");
        writer.addHeaderAlias("comId","社区码");
        writer.addHeaderAlias("name","社区名");
        writer.addHeaderAlias("province","所在省");
        writer.addHeaderAlias("city","所在市");
        writer.addHeaderAlias("area","所在区");
        writer.addHeaderAlias("address","地址");

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
        String fileName = URLEncoder.encode("社区信息","UTF-8");
        response.setHeader("Content-Disposition","attachment;filename="+fileName+".xlsx");

        ServletOutputStream out=response.getOutputStream();
        writer.flush(out, true);
        out.close();
        // 关闭writer，释放内存
        writer.close();

    }

}
