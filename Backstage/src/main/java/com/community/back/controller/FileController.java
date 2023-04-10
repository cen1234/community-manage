package com.community.back.controller;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.IdUtil;
import cn.hutool.core.util.StrUtil;
import com.community.back.entity.User;
import com.community.back.service.IndividualService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;
import java.net.URLEncoder;

@RestController
@RequestMapping("/file")
public class FileController {
    private String fileUploadPath = "C:/Users/cxy/Desktop/cccc/CM/files/";

    @Resource
    private IndividualService individualService;

    //文件上传
    @PostMapping("/upload")
    public String upload(@RequestParam MultipartFile file,@RequestParam String username) throws IOException {
        //获取文件原始名称，文件类型，文件大小
        String originalFilename  = file.getOriginalFilename();
        String type = FileUtil.extName(originalFilename);
        long size = file.getSize();
        //把文件存储到磁盘
        File uploadFile = new File(fileUploadPath);
        //如果目录不存在,就创建
        if(!uploadFile.exists()) {
            uploadFile.mkdirs();
        }
        //定义一个文件唯一的标识码
        String uuid = IdUtil.fastSimpleUUID();
        String fileUuid = uuid+ StrUtil.DOT+type;
        File uploadFilePath =  new File(fileUploadPath + fileUuid);
        String  url = "http://localhost:9000/file/"+fileUuid;
        //把获取到的文件存储到磁盘目录
        file.transferTo(uploadFilePath);
        //更新当前用户的头像
        User user = individualService.get(username);
        user.setUserImg(fileUuid);
        individualService.edit(user);
        return fileUuid;
    }

    //下载文件
    @GetMapping("/{fileUuid}")
    public void download(@PathVariable String fileUuid, HttpServletResponse response) throws IOException {
        //根据文件唯一标识码获取文件
        File uploadFile = new File(fileUploadPath + fileUuid);
        //设置输出流格式
        ServletOutputStream os = response.getOutputStream();
        response.addHeader("Content-Disposition","attachment;filename="+ URLEncoder.encode(fileUuid,"UTF-8"));
        response.setContentType("application/octet-stream");
        //读取文件字节流
        os.write(FileUtil.readBytes(uploadFile));
        os.flush();
        os.close();
    }

}
