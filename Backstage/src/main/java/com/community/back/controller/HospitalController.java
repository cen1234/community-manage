package com.community.back.controller;

import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import cn.hutool.poi.excel.StyleSet;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.community.back.entity.Doctor;
import com.community.back.entity.Health;
import com.community.back.entity.Hospital;
import com.community.back.service.DoctorService;
import com.community.back.service.HealthService;
import com.community.back.service.HospitalService;
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
@RequestMapping("/hospital")
public class HospitalController {

    @Resource
    private HospitalService hospitalService;

    @Resource
    private DoctorService doctorService;

    @Resource
    private HealthService healthService;

//
//    -----------
//    根据名字，社区分页获取医院信息
//    -----------
    @GetMapping("pageHospital")
    public IPage<Hospital> findPageHospital(@RequestParam Integer pageNum,
                                    @RequestParam Integer pageSize,
                                    @RequestParam Integer comId,
                                    @RequestParam(defaultValue = "") String search
    ) {
        IPage<Hospital> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Hospital> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("name", search);
         queryWrapper.like("com_id", comId);
        return hospitalService.page(page,queryWrapper);
    }



//    ---------------
//    新增|修改医院信息
//    --------------
    @PostMapping
    public boolean saveHospital(@RequestBody Hospital hospital) {
        return hospitalService.saveHospital(hospital);
    }


//      ------
//      删除医院信息
//      ------
    @PostMapping("/deleteHospital/{id}")
    public boolean deleteByIdHospital(@PathVariable Integer id) {
        return hospitalService.removeById(id);
    }

    @PostMapping("/deleteSelectHospital/{idlist}")
    public  boolean deleteByIdsHospital(@PathVariable Collection idlist) {
        return hospitalService.removeByIds(idlist);
    }

//    ------
//    导入医院信息
//    ------
    @PostMapping("/importHospital")
    public void importHospital(MultipartFile file) throws Exception {
        InputStream inputStream = file.getInputStream();
        ExcelReader reader = ExcelUtil.getReader(inputStream);
        List<Hospital> list = reader.readAll(Hospital.class);
        hospitalService.saveBatch(list);
    }

//    ------
//    导出医院信息
//    ------
    @GetMapping("/exportHospital/{comId}")
    public void exportHospital(HttpServletResponse response, @PathVariable Integer comId) throws Exception{
        //从数据库中查出所有数据
        QueryWrapper<Hospital> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("com_id",comId);
        List<Hospital> list = hospitalService.list(queryWrapper);

        //在内存操作，写出到浏览器
        ExcelWriter writer = ExcelUtil.getWriter(true);
        //自定义标题名
        writer.addHeaderAlias("id","ID");
        writer.addHeaderAlias("comId","社区码");
        writer.addHeaderAlias("name","社区医院名字");
        writer.addHeaderAlias("belongCommunity","所属社区");
        writer.addHeaderAlias("phone","电话");
        writer.addHeaderAlias("address","地址");
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
        String fileName = URLEncoder.encode("社区医院信息","UTF-8");
        response.setHeader("Content-Disposition","attachment;filename="+fileName+".xlsx");

        ServletOutputStream out=response.getOutputStream();
        writer.flush(out, true);
        out.close();
        // 关闭writer，释放内存
        writer.close();
    }

//
//    -----------
//    分页获取医生信息
//    -----------
    @GetMapping("pageDoctor")
    public IPage<Doctor> findPageDoctor(@RequestParam Integer pageNum,
                                        @RequestParam Integer pageSize,
                                        @RequestParam Integer hospitalId
    ) {
        IPage<Doctor> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Doctor> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("hospital_id", hospitalId);
        return doctorService.page(page,queryWrapper);
    }



//    ---------------
//    修改医生信息
//    --------------
    @PostMapping("editDoctor")
    public boolean saveDoctor(@RequestBody Doctor doctor) {
        return doctorService.saveDoctor(doctor);
    }


//      ------
//      删除医生信息
//      ------
    @PostMapping("/deleteDoctor/{id}")
    public boolean deleteByIdDoctor(@PathVariable Integer id) {
        return doctorService.removeById(id);
    }

    @PostMapping("/deleteSelectDoctor/{idlist}")
    public  boolean deleteByIdsDoctor(@PathVariable Collection idlist) {
        return doctorService.removeByIds(idlist);
    }

//    ------
//    导入医生信息
//    ------
    @PostMapping("/importDoctor")
    public void importDoctor(MultipartFile file) throws Exception {
        InputStream inputStream = file.getInputStream();
        ExcelReader reader = ExcelUtil.getReader(inputStream);
        List<Doctor> list = reader.readAll(Doctor.class);
        doctorService.saveBatch(list);
    }

//
//    -----------
//    分页获取健康信息
//    -----------
    @GetMapping("pageHealth")
    public IPage<Health> findPageHealth(@RequestParam Integer pageNum,
                                        @RequestParam Integer pageSize,
                                        @RequestParam Integer comId,
                                        @RequestParam(defaultValue = "") String search,
                                        @RequestParam String type
    ) {
        IPage<Health> page = new Page<>(pageNum,pageSize);
        QueryWrapper<Health> queryWrapper = new QueryWrapper<>();
        switch (type) {
            case "founder": {
                queryWrapper.like("founder", search);
                break;
            }
            case "name": {
                queryWrapper.like("name", search);
                break;
            }
        }
        queryWrapper.like("com_id", comId);
        return healthService.page(page,queryWrapper);
    }



//    ---------------
//    新增健康信息
//    --------------
    @PostMapping("addHealth")
    public boolean saveHealth(@RequestBody Health health) {
        return healthService.saveHealth(health);
    }













}
