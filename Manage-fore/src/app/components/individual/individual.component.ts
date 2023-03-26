import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent implements OnInit {

  //用户属性
  public user_name:string = '小岑';//用户名
  public user_realname:string = '李哈哈';//用户真实姓名
  public user_phone:string = '12345678911';//用户电话号码
  public user_age:number|string = 21;//用户年龄
  public user_sex:string = '女';//用户姓名
  public user_address:string = '西安市';//用户地址
  public user_img:string = '';//用户图像
  public user_role:string = '管理员';//用户身份
  public user_password:string = '123456';//用户密码
  //其他属性
  isInformationVisible = false;//修改个人信息弹出框是否出现
  isOkInformationLoading = false;//异步标识,用于提交完表单信息后关闭个人信息弹出框
  isPhoneVisible = false;//绑定手机弹出框是否出现
  isOkPhoneLoading = false;//异步标识,用于提交完表单信息后关闭个人信息弹出框
  validateForm!: UntypedFormGroup;//个人信息表单
  phonevalidateForm!:UntypedFormGroup;//绑定手机弹出框
  passwordVisible = false;//密码输入框可视

  constructor(private router:Router,private fb: UntypedFormBuilder) {
    this.validateForm = this.fb.group({
      user_realname: ['', [Validators.required],[this.userRealnameAsyncValidator]],
      user_name: ['', [Validators.required],[this.userNameAsyncValidator]],
      user_age: ['', [Validators.required],[this.ageValidator]],
      user_sex:['',[Validators.required]],
      user_password:['',[Validators.required],[this.pwdValidator]],
      user_address:['',[Validators.required],[this.addressAsyncValidator]]
    });
    this.phonevalidateForm = this.fb.group({
      user_phone:['',[Validators.required],[this.phoneAsyncValidator]]
    })
   }

  ngOnInit(): void {
  }
 
  //回到管理页面
  onBack() {
   this.router.navigate(['/login']);
  }


  //打开个人信息弹出框
  showInformatioinModal(): void {
    this.isInformationVisible = true;
  }

  //打开绑定手机弹出框
  showPhoneModal(): void {
    this.isPhoneVisible = true;
  }
  
  //确认个人信息弹出框
  informationHandleOk(): void {
    this.isOkInformationLoading = true;
    if (this.validateForm.valid) {
     
      setTimeout(() => {
        this.isInformationVisible = false;
        this.isOkInformationLoading = false;
      }, 500);
    } else {
      this.isInformationVisible = true;
      this.isOkInformationLoading = false;
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  //确认绑定手机弹出框
  phoneHandleOk() {
    this.isOkPhoneLoading = true;
    if (this.phonevalidateForm.valid) {
      console.log('submit', this.phonevalidateForm.value);
      setTimeout(() => {
        this.isOkPhoneLoading = false;
        this.isPhoneVisible = false;
      }, 500);
    } else {
        this.isOkPhoneLoading = false;
        this.isPhoneVisible = true;
        Object.values(this.phonevalidateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
    }

  }
  
  //关闭|取消个人信息弹出框
  informationHandleCancel(): void {
    this.isInformationVisible = false;
  }

  //关闭|取消绑定手机弹出框
  phoneHandleCancel() {
     this.isPhoneVisible = false;
  }

  //设置校验规则
  userRealnameAsyncValidator = (control: UntypedFormControl) =>
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
  userNameAsyncValidator = (control: UntypedFormControl) =>
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
    ageValidator = (control: UntypedFormControl) =>
        new Observable((observer: Observer<ValidationErrors | null>) => {
          setTimeout(() => {
            if (!control.value) {
              observer.next({ error: true, required: true });
            } else if (control.value < 1) {
              observer.next({ error: true, minlength: true });
            } else if (control.value> 120) {
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
  addressAsyncValidator = (control: UntypedFormControl) =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        setTimeout(() => {
          if (!control.value) {
            observer.next({ error: true, required: true });
          } else if (control.value.length > 60) {
            observer.next({ error: true, maxlength: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        }, 500);
  });
  phoneAsyncValidator = (control: UntypedFormControl) =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        setTimeout(() => {
          if (control.value == '') {
            observer.next({ error: true, required: true });
          } else if (control.value.match(/^1(3|4|5|6|7|8|9)\d{9}$/) === null) {
            observer.next({ error: true, errorPhone: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        }, 500);
      });
}