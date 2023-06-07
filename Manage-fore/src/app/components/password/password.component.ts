import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  
  //属性
 public inputcode:any;//输入框验证码
 public code:any;//从后台获取的验证码
 public phone:string = '';//电话
 public pwd:string = '';//密码

  constructor(private fb: UntypedFormBuilder, private router: Router,private http:HttpClient,private message: NzMessageService) {
  
   }

  ngOnInit(): void {
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

  //提交
  getPwd(): void {
       let url = 'api/user/getPassword';
       this.http.get(url,{
         params:{
          phone:this.phone,
          inputCode:this.inputcode
         }
       }).subscribe((res:any) => {
          if(res!= '校验码错误') {
            this.message.success('密码为：'+res, {
              nzDuration: 10000
            });
          } else {
            this.message.success('校验码错误', {
              nzDuration: 10000
            });
          }
       })
}
  

  //回到登录页(防止误点到找回密码页)
  onBack() {
     this.router.navigate(['/login']);
  }
 


}
