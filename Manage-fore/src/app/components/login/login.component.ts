import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //绑定的属性
 public validateLoginForm: UntypedFormGroup; 
 public name:string | null = null;//用户名(要求用户名必填且不超过30个字符)
 public password:string | null = null;//密码(要求密码必填且长度为6-15个字符)
 private headers = new HttpHeaders({'Content-Type': 'application/json'});//请求头
 public divide_title:string = "没有账号？";
 public login_flag:boolean = true;
 public register_flag:boolean = false;
 public passwordVisible = false;
  
  constructor(private fb: UntypedFormBuilder,private router: Router,private http:HttpClient,private message: NzMessageService) { 
    this.validateLoginForm = this.fb.group({
      username: ['', [Validators.required], [this.nameValidator]],
      password: ['', [Validators.required],[this.pwdValidator]],
    });
  }

  ngOnInit(): void {
  }

  //去注册
  goRegister() {
    this.login_flag = false;
    this.register_flag = true;
    this.divide_title = "已经有账号？";
    this.resetForm();//点击去注册时清空输入框内容，回到登录页不需要清空内容，方便登录
  }

  //去登录
  goLogin() {
    this.login_flag = true;
    this.register_flag = false;
    this.divide_title = "没有账号？";
  }

  //登录
  login(): void {
     if (this.inputValidator() === true) {
        let url = 'api/user/login';
        this.http.post(url,JSON.stringify(this.validateLoginForm.value),{headers:this.headers}).subscribe((res:any) => {
          if( res.code === "200") {
            this.message.success('用户登录成功！', {
              nzDuration: 500
            });
             //登录成功跳转到首页，并将用户信息存储到浏览器本地
            localStorage.setItem("user",JSON.stringify(res.data));
            if (res.data.roleId == 1) {
              this.router.navigate(['/user']);
            } else if (res.data.roleId == 2) {
               this.router.navigate(['/staffInfo']);
            }
          } else {
              this.message.error(res.meg, {
              nzDuration: 1000
            });
          }
        })
     } else {
         Object.values(this.validateLoginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
     }
  }

  //注册
  register(): void {
    console.log(1)
    if (this.inputValidator() === true) {
      console.log(11)
      let url = 'api/user/register';
      this.http.post(url,JSON.stringify(this.validateLoginForm.value),{headers:this.headers}).subscribe((res:any) => {
         if (res.code === "200") {
            this.message.success('用户注册成功！', {
              nzDuration: 500
            });
         } else {
            this.message.error(res.meg, {
              nzDuration: 1000
            });
         }
      })
    } else {
        Object.values(this.validateLoginForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  //设置校验规则
  nameValidator = (control: UntypedFormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      setTimeout(() => {
        if (!control.value) {
          observer.next({ error: true, required: true });
        } else if (control.value.length > 30) {
          observer.next({ error: true, maxlength: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 500);
    });
    pwdValidator = (control: UntypedFormControl) =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        setTimeout(() => {
          if (!control.value) {
            observer.next({ error: true, required: true });
          } else if (control.value.length < 6) {
            observer.next({ error: true, minlength: true });
          } else if (control.value.length > 15) {
            observer.next({ error: true, maxlength: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        }, 500);
    });

    //校验输入框是否都按规则输入
    inputValidator(): boolean {
      if (this.validateLoginForm.valid) {
        console.log('submit', this.validateLoginForm.value);
        return true;
      } else {
        Object.values(this.validateLoginForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
        return false;
      }
    }

    //清空表格
    resetForm(): void {
      this.validateLoginForm.reset();
      for (const key in this.validateLoginForm.controls) {
        if (this.validateLoginForm.controls.hasOwnProperty(key)) {
          this.validateLoginForm.controls[key].markAsPristine();
          this.validateLoginForm.controls[key].updateValueAndValidity();
        }
      }
    }


}
