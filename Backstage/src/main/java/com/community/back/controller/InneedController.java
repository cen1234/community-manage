package com.community.back.controller;


import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import cn.hutool.poi.excel.StyleSet;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.community.back.entity.Inneed;
import com.community.back.entity.Staff;
import com.community.back.entity.Volunteer;
import com.community.back.service.InneedService;
import com.community.back.service.StaffService;
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
@RequestMapping("/inneed")
public class InneedController {

    @Resource
    private InneedService inneedService;


//    -----
//    查找全部
//    -----
    @GetMapping("/findAll")
    public List<Inneed> find(@RequestParam Integer comId) {
        QueryWrapper<Inneed> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("com_id",comId);
        return inneedService.list(queryWrapper);
    }

//    ------
//    分页查询
//    ------

    @GetMapping("page")
    public IPage<Inneed> findPage(@RequestParam Integer pageNum,
                                 @RequestParam Integer pageSize,
                                 @RequestParam(defaultValue = "") String search,
                                 @RequestParam String type,
                                 @RequestParam Integer comId
    ) {
        IPage<Inneed> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Inneed> queryWrapper = new QueryWrapper<>();
        switch (type) {
            case "type": {
                queryWrapper.like("type", search);
                break;
            }
            case "name":{
                queryWrapper.like("name",search);
                break;
            }
        }
        queryWrapper.like("com_id",comId);
        return inneedService.page(page,queryWrapper);
    }



//    ------
//    新增|修改特殊人员
//    ------
    @PostMapping
    public boolean save(@RequestBody Inneed inneed) {
        return inneedService.saveInneed(inneed);
    }

//      ------
//      删除特殊人员
//      ------
    @PostMapping("/delete/{id}")
    public boolean deleteById(@PathVariable Integer id) {
        return inneedService.removeById(id);
    }

    @PostMapping("/deleteSelect/{idlist}")
    public  boolean deleteByIds(@PathVariable Collection idlist) {
        return inneedService.removeByIds(idlist);
    }

//    ------
//    导入特殊人员
//    ------
    @PostMapping("/import")
    public void importCommunity(MultipartFile file) throws Exception {
        InputStream inputStream = file.getInputStream();
        ExcelReader reader = ExcelUtil.getReader(inputStream);
        List<Inneed> list = reader.readAll(Inneed.class);
        inneedService.saveBatch(list);
    }

//    ------
//    导出特殊人员
//    ------
    @GetMapping("/export/{comId}")
    public void export(HttpServletResponse response,@PathVariable Integer comId) throws Exception{
        //从数据库中查出所有数据
        QueryWrapper<Inneed> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("com_id",comId);
        List<Inneed> list = inneedService.list(queryWrapper);

        //在内存操作，写出到浏览器
        ExcelWriter writer = ExcelUtil.getWriter(true);
        //自定义标题名
        writer.addHeaderAlias("id","ID");
        writer.addHeaderAlias("comId","社区码");
        writer.addHeaderAlias("name","姓名");
        writer.addHeaderAlias("age","年龄");
        writer.addHeaderAlias("sex","性别");
        writer.addHeaderAlias("phone","电话");
        writer.addHeaderAlias("address","地址");
        writer.addHeaderAlias("belongCommunity","所属社区");
        writer.addHeaderAlias("type","类型");
        writer.addHeaderAlias("remarks","备注");

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
        String fileName = URLEncoder.encode("特殊人员信息","UTF-8");
        response.setHeader("Content-Disposition","attachment;filename="+fileName+".xlsx");

        ServletOutputStream out=response.getOutputStream();
        writer.flush(out, true);
        out.close();
        // 关闭writer，释放内存
        writer.close();

    }

}
