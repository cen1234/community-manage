package com.community.back.controller;

import cn.hutool.core.util.StrUtil;
import cn.hutool.poi.excel.ExcelReader;
import cn.hutool.poi.excel.ExcelUtil;
import cn.hutool.poi.excel.ExcelWriter;
import cn.hutool.poi.excel.StyleSet;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.community.back.common.Constants;
import com.community.back.common.Result;
import com.community.back.dto.UserDto;
import com.community.back.entity.User;
import com.community.back.service.UserService;
import com.community.back.utils.SMSUtils;
import com.community.back.utils.TokenUtils;
import com.community.back.utils.ValidateCodeUtils;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.util.SheetUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
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
@RequestMapping("/user")
public class UserController {

    @Resource
    private UserService userService;

    @Resource
    private SMSUtils smsUtils;

    @Resource
    private StringRedisTemplate stringRedisTemplate;





//      ------
//       管理端登录
//      ------
    @PostMapping("/login")
    private Result Login(@RequestBody UserDto userDto) {
        String username = userDto.getUsername();
        String password = userDto.getPassword();
        //校验username,password是否为空
        if(StrUtil.isBlank(username) || StrUtil.isBlank(password)) {
            return Result.error(Constants.CODE_400,"参数不足!");
        }
        //在数据库中查到用户信息，给前台返回一些用户的信息存储到浏览器上
        UserDto userDto1 = userService.login(userDto);
        return Result.success(userDto1);
    }

//    ------
//    客户端登录
//    ------
    @GetMapping("/clientLogin")
    public Result ClientLogin(@RequestParam String phone,@RequestParam String inputCode) {
        if (StrUtil.isBlank(phone) || StrUtil.isBlank(inputCode)) {
            return Result.error(Constants.CODE_400,"参数不足!");
        }
        //从redis中获取验证码，与输入的进行匹配
        String code = stringRedisTemplate.opsForValue().get("code");
        if (code.equals(inputCode)) {
            //查询电话是否存在，存在则为登录，返回用户信息;
            QueryWrapper<User> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("phone",phone);
            User oneData;
            oneData = userService.getOne(queryWrapper);
            if (oneData != null) {
                return Result.success(oneData);
            }
            //电话不存在则为注册
            oneData = new User();
            oneData.setUsername(ValidateCodeUtils.generateValidateCode(6).toString());
            oneData.setPassword("123456");
            oneData.setPhone(phone);
            oneData.setRoleId(5);
            userService.save(oneData);
            return Result.success(oneData);
        } else {
            return Result.error(Constants.CODE_402,"验证码错误!");
        }
    }

//       -----
//       注册
//       -----
    @PostMapping("/register")
    public Result Register(@RequestBody UserDto userDto) {
        String username = userDto.getUsername();
        String password = userDto.getPassword();
        //校验username,password是否为空
        if(StrUtil.isBlank(username) || StrUtil.isBlank(password)) {
            return Result.error(Constants.CODE_400,"参数不足!");
        }
        //在数据库中添加注册的用户信息
        return Result.success(userService.register(userDto));
    }

//    -----
//    查找全部
//    -----
    @GetMapping("/findAll")
    public List<User> find() {
        //获取当前用户信息
        User currentUser = TokenUtils.getCurrentUser();
        return userService.list();
    }

//    ------
//    分页查询
//    ------
//    ------
//    分页查询
//    使用mybatis-plus方法进行分页查询
//    @RequestParam接收： ？pageNum=1&pageSize=10
//    设置page条件：哪一页和页的数据多少条；
//    设置查询条件：queryWrapper；
//    用户可以根据 realname，name，phone这些关键词进行模糊查询，并带上type
//    ------
      @GetMapping("page")
      public IPage<User> findPage(@RequestParam Integer pageNum,
                                  @RequestParam Integer pageSize,
                                  @RequestParam(defaultValue = "") String search,
                                  @RequestParam(defaultValue = "name") String type,
                                  @RequestParam Integer roleId) {
    IPage<User> page = new Page<>(pageNum,pageSize);
    QueryWrapper<User> queryWrapper = new QueryWrapper<>();
    switch (type) {
        case "realname":{
             queryWrapper.like("user_real_name",search);
             break;
        }
        case "name":{
            queryWrapper.like("username",search);
            break;
        }
        case "phone":{
            queryWrapper.like("phone",search);
            break;
        }
    }
    queryWrapper.like("role_id",roleId);
    return userService.page(page,queryWrapper);
}


//    ------
//    新增|修改用户
//    ------
    @PostMapping
    //@RequestBody将前台传过来的参数转化为User对象
    public boolean save(@RequestBody User user) {
    return userService.saveUser(user);
}

//      ------
//      删除用户
//      ------
    @PostMapping("/delete/{id}")
    public boolean deleteById(@PathVariable Integer id) {
        return userService.removeById(id);
    }

    @PostMapping("/deleteSelect/{idlist}")
    public  boolean deleteByIds(@PathVariable Collection idlist) {
        return userService.removeByIds(idlist);
    }

//    ------
//    导入用户
//    ------
    @PostMapping("/import")
    public void importUser(MultipartFile file) throws Exception {
        InputStream inputStream = file.getInputStream();
        ExcelReader reader = ExcelUtil.getReader(inputStream);
        List<User> list = reader.readAll(User.class);
        userService.saveBatch(list);
    }

//    ------
//    导出用户
//    ------
    @GetMapping("/export")
    public void export(HttpServletResponse response) throws Exception{
        //从数据库中查出所有数据
        List<User> list = userService.list();

        //在内存操作，写出到浏览器
        ExcelWriter writer = ExcelUtil.getWriter(true);
        //自定义标题名
        writer.addHeaderAlias("id","ID");
        writer.addHeaderAlias("roleId","身份码");
        writer.addHeaderAlias("comId","社区码");
        writer.addHeaderAlias("userRealName","真实姓名");
        writer.addHeaderAlias("username","用户名");
        writer.addHeaderAlias("password","密码");
        writer.addHeaderAlias("sex","性别");
        writer.addHeaderAlias("age","年龄");
        writer.addHeaderAlias("phone","电话");
        writer.addHeaderAlias("address","地址");
        writer.addHeaderAlias("userImg","头像");

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
        String fileName = URLEncoder.encode("角色信息","UTF-8");
        response.setHeader("Content-Disposition","attachment;filename="+fileName+".xlsx");

        ServletOutputStream out=response.getOutputStream();
        writer.flush(out, true);
        out.close();
        // 关闭writer，释放内存
        writer.close();

}


//    --------------------------------
//    获取所有当前登录用户所在社区的社区管理员
//    --------------------------------
    @GetMapping("/getApprover")
    public List<User> findApprover(@RequestParam Integer comId) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.like("com_id",comId);
        queryWrapper.like("role_id",2);
        return userService.list(queryWrapper);
    }


//    ---------
//    发送验证码
//    ---------
    @GetMapping("/sendSmg")
    public void sendSmg(@RequestParam String phone) throws Exception {
        //获取随机验证码
        Integer code = ValidateCodeUtils.generateValidateCode(6);
        //发送短信
        smsUtils.sendMessage("阿里云短信测试", "SMS_154950909", phone, code.toString());
        //向redis中存入code
        stringRedisTemplate.opsForValue().set("code",code.toString());
    }

//    --------
//    验证码正确返回密码信息
//    --------
     @GetMapping("/getPassword")
    public String getPwd(@RequestParam String phone,@RequestParam String inputCode) {
        //从redis中取出验证码
        String code = stringRedisTemplate.opsForValue().get("code");
        if (code.equals(inputCode)) {
            String pwd = userService.getPwd(phone);
            return pwd;
        } else {
            return "校验码错误";
        }
     }

//     ----
//     根据用户id获取用户全部信息
//     -----
    @GetMapping("/getInfo")
    public User getInfo(@RequestParam Integer id) {
        return userService.getById(id);
    }


//    --------
//    根据用户名获取用户信息
//    -------
    @GetMapping("/getContact")
    public User getContact(@RequestParam String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("username",username);
        return userService.getOne(queryWrapper);
    }

//    --------
//    根据社区id获取所有社区管理员
//    -------
    @GetMapping("/getCommunity")
    public List<User> getCommunity(@RequestParam Integer comId) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("com_id",comId);
        queryWrapper.eq("role_id",2);
        return userService.list(queryWrapper);
    }

//    ---------
//    根据用户姓名修改用户roleId
//    ---------
    @GetMapping("/updateRole")
    public boolean updateRole(@RequestParam String userRealName) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_real_name",userRealName);
        User user = userService.getOne(queryWrapper);
        user.setRoleId(4);
        return userService.saveUser(user);
    }




}
