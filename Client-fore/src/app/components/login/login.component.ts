import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
   public phone:string = '';//输入的电话号码
   public inputcode:string = '';//输入的验证码
  
   
   constructor(private router: Router,private http:HttpClient,private message: NzMessageService) {
  
  }


   
   //获取验证码
   getCode():void {
    if (this.phone != '') {
      let url = 'api/user/sendSmg';
      this.http.get(url,{
        params:{
          phone:this.phone
        }
      }).subscribe((res:any) => {
      })
    }
   }

   //登录
   login():void {
       if (this.inputcode != ''&& this.phone != '') {
          let url = 'api/user/clientLogin';
          this.http.get(url,{
            params:{
              phone:this.phone,
              inputCode:this.inputcode
            }
          }).subscribe((res:any) => {
             if (res.code === '200') {
                //登录成功跳转到首页，并将用户信息存储到浏览器本地
                localStorage.setItem("user",JSON.stringify(res.data));
                this.router.navigate(['/home']);
             } else {
                this.message.error(res.meg, {
                  nzDuration: 1000
                });
             }
          })
       } else {
            this.message.error("请填写完整手机号和验证码", {
              nzDuration: 3000
            });
       }
   }
}
