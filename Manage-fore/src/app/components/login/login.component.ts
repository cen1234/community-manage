import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  //绑定的属性
 public validateForm: UntypedFormGroup; 
 public name:string | null = null;//用户名(要求用户名必填且不超过30个字符)
 public password:string | null = null;//密码(要求密码必填且长度为6-15个字符)

 public divide_title:string = "没有账号？";
 public login_flag:boolean = true;
 public register_flag:boolean = false;
 public passwordVisible = false;
  
  constructor(private fb: UntypedFormBuilder) { 
    this.validateForm = this.fb.group({
      name: ['', [Validators.required], [this.nameValidator]],
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
  }

  //去登录
  goLogin() {
    this.login_flag = true;
    this.register_flag = false;
    this.divide_title = "没有账号？";
  }

  //登录
  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
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


}
