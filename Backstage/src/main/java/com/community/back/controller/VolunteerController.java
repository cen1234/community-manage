package com.community.back.controller;


import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import cn.hutool.poi.excel.StyleSet;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.community.back.entity.Approver;
import com.community.back.entity.Volunteer;
import com.community.back.service.ApproverService;
import com.community.back.service.VolunteerService;
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
@RequestMapping("/volunteer")
public class VolunteerController {

    @Resource
    private VolunteerService volunteerService;

    @Resource
    private ApproverService approverService;

//    -----
//    查找全部
//    -----
    @GetMapping("/findAll")
    public List<Volunteer> find(@RequestParam Integer comId, @RequestParam String formal) {
        QueryWrapper<Volunteer> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("com_id",comId);
        queryWrapper.like("formal",formal);
        return volunteerService.list(queryWrapper);
    }

//    ------
//    分页查询正式志愿者
//    ------

    @GetMapping("pageFormal")
    public IPage<Volunteer> findPageFormal(@RequestParam Integer pageNum,
                               @RequestParam Integer pageSize,
                               @RequestParam(defaultValue = "") String search,
                               @RequestParam String type,
                               @RequestParam Integer comId,
                               @RequestParam String formal
    ) {
        IPage<Volunteer> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Volunteer> queryWrapper = new QueryWrapper<>();
        switch (type) {
            case "available":{
                queryWrapper.like("available",search);
                break;
            }
            case "name":{
                queryWrapper.like("name",search);
                break;
            }
        }
        queryWrapper.like("com_id",comId);
        queryWrapper.like("formal",formal);
        return volunteerService.page(page,queryWrapper);
    }

//    ------
//    分页查询申请者
//    ------

    @GetMapping("page")
    public IPage<Volunteer> findPage(@RequestParam Integer pageNum,
                                     @RequestParam Integer pageSize,
                                     @RequestParam(defaultValue = "") String search,
                                     @RequestParam Integer comId,
                                     @RequestParam String formal,
                                     @RequestParam String approver
    ) {
        IPage<Volunteer> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Volunteer> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("name",search);
        queryWrapper.like("com_id",comId);
        queryWrapper.like("formal",formal);
        queryWrapper.like("approver",approver);
        return volunteerService.page(page,queryWrapper);
    }


 //    ------
//    新增|修改志愿者
//    ------
    @PostMapping
    public boolean save(@RequestBody Volunteer volunteer) {
        return volunteerService.saveVolunteer(volunteer);
    }

//      ------
//      删除志愿者
//      ------
    @PostMapping("/delete/{id}")
    public boolean deleteById(@PathVariable Integer id) {
        return volunteerService.removeById(id);
    }

    @PostMapping("/deleteSelect/{idlist}")
    public  boolean deleteByIds(@PathVariable Collection idlist) {
        return volunteerService.removeByIds(idlist);
    }

//    ------
//    导入志愿者
//    ------
    @PostMapping("/import")
    public void importCommunity(MultipartFile file) throws Exception {
        InputStream inputStream = file.getInputStream();
        ExcelReader reader = ExcelUtil.getReader(inputStream);
        List<Volunteer> list = reader.readAll(Volunteer.class);
        volunteerService.saveBatch(list);
    }

//    ------
//    导出正式志愿者
//    ------
    @GetMapping("/exportFormal/{comId}")
    public void exportFormal(HttpServletResponse response,@PathVariable Integer comId) throws Exception{
        //从数据库中查出所有数据
        QueryWrapper<Volunteer> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("formal","正式");
        queryWrapper.like("com_id",comId);
        List<Volunteer> list = volunteerService.list(queryWrapper);

        //在内存操作，写出到浏览器
        ExcelWriter writer = ExcelUtil.getWriter(true);
        //自定义标题名
        writer.addHeaderAlias("id","ID");
        writer.addHeaderAlias("comId","社区码");
        writer.addHeaderAlias("name","志愿者姓名");
        writer.addHeaderAlias("age","年龄");
        writer.addHeaderAlias("sex","性别");
        writer.addHeaderAlias("phone","电话");
        writer.addHeaderAlias("address","地址");
        writer.addHeaderAlias("belongCommunity","所属社区");
        writer.addHeaderAlias("available","是否空闲");
        writer.addHeaderAlias("score","任务总得分");
        writer.addHeaderAlias("workCount","任务总数");
        writer.addHeaderAlias("skill","擅长");
        writer.addHeaderAlias("formal","是否正式志愿者");
        writer.addHeaderAlias("applyTime","志愿者申请时间");
        writer.addHeaderAlias("formalTime","志愿者获审时间");

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
        String fileName = URLEncoder.encode("正式志愿者信息","UTF-8");
        response.setHeader("Content-Disposition","attachment;filename="+fileName+".xlsx");

        ServletOutputStream out=response.getOutputStream();
        writer.flush(out, true);
        out.close();
        // 关闭writer，释放内存
        writer.close();

    }

//    ------
//    导出要审批志愿者
//    ------
    @GetMapping("/export/{comId}")
    public void export(HttpServletResponse response,@PathVariable Integer comId) throws Exception{
        //从数据库中查出所有数据
        QueryWrapper<Volunteer> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("formal","申请");
        queryWrapper.like("com_id",comId);
        List<Volunteer> list = volunteerService.list(queryWrapper);

        //在内存操作，写出到浏览器
        ExcelWriter writer = ExcelUtil.getWriter(true);
        //自定义标题名
        writer.addHeaderAlias("id","ID");
        writer.addHeaderAlias("comId","社区码");
        writer.addHeaderAlias("name","志愿者姓名");
        writer.addHeaderAlias("age","年龄");
        writer.addHeaderAlias("sex","性别");
        writer.addHeaderAlias("phone","电话");
        writer.addHeaderAlias("address","地址");
        writer.addHeaderAlias("belongCommunity","所属社区");
        writer.addHeaderAlias("available","是否空闲");
        writer.addHeaderAlias("score","任务总得分");
        writer.addHeaderAlias("workCount","任务总数");
        writer.addHeaderAlias("skill","擅长");
        writer.addHeaderAlias("formal","是否正式志愿者");
        writer.addHeaderAlias("applyTime","志愿者申请时间");
        writer.addHeaderAlias("formalTime","志愿者获审时间");

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
        String fileName = URLEncoder.encode("审批志愿者信息","UTF-8");
        response.setHeader("Content-Disposition","attachment;filename="+fileName+".xlsx");

        ServletOutputStream out=response.getOutputStream();
        writer.flush(out, true);
        out.close();
        // 关闭writer，释放内存
        writer.close();

    }

//    ------
//    根据申请者id获取所有审批人
//    ------
    @GetMapping("/getApprover")
    public List<Approver> findApprover(@RequestParam Integer applyId) {
        QueryWrapper<Approver> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("apply_id",applyId);
        return approverService.list(queryWrapper);
    }

//    -------
//    新增审批
//    -------
    @PostMapping("/saveApprove")
    public  boolean save(@RequestBody Approver approver) {
        return approverService.save(approver);
    }
}
