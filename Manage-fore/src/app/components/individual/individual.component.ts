import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 

@Component({
  selector: 'app-individual',
  templateUrl: './individual.component.html',
  styleUrls: ['./individual.component.css']
})
export class IndividualComponent implements OnInit {

  //用户属性
  public id:number = 0;//id
  public username:string = '';//用户名
  public userRealName:string = '';//用户真实姓名
  public phone:string = '';//用户电话号码
  public age:number|string = 0;//用户年龄
  public sex:string = '';//用户姓名
  public address:string = '';//用户地址
  public userImg:string = '';//用户图像
  public role:string = '';//用户身份
  public password:string = '';//用户密码
  //其他属性
  isInformationVisible = false;//修改个人信息弹出框是否出现
  isOkInformationLoading = false;//异步标识,用于提交完表单信息后关闭个人信息弹出框
  isPhoneVisible = false;//绑定手机弹出框是否出现
  isOkPhoneLoading = false;//异步标识,用于提交完表单信息后关闭个人信息弹出框
  validateForm!: UntypedFormGroup;//个人信息表单
  phonevalidateForm!:UntypedFormGroup;//绑定手机弹出框
  passwordVisible = false;//密码输入框可视
  loading = false;//上传头像加载
  avatarUrl?: string;//上传的头像
  img_upload:boolean = false;//上传图像功能是否展示
  data:any;//上传文件携带的参数
  user:any;//获取缓存里的用户信息
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private router:Router,private fb: UntypedFormBuilder,private msg: NzMessageService,private http:HttpClient) {
    this.validateForm = this.fb.group({
      id:[0],
      roleId:[0,[Validators.required]],
      userRealName: ['', [Validators.required],[this.userRealnameAsyncValidator]],
      username: ['', [Validators.required],[this.userNameAsyncValidator]],
      age: ['', [Validators.required],[this.ageValidator]],
      sex:['',[Validators.required]],
      password:['',[Validators.required],[this.pwdValidator]],
      address:['',[Validators.required],[this.addressAsyncValidator]]
    });
    this.phonevalidateForm = this.fb.group({
      id:[0],
      username: ['', [Validators.required],[this.userNameAsyncValidator]],
      phone:['',[Validators.required],[this.phoneAsyncValidator]]
    })
   }

  ngOnInit(): void {
     this.user = localStorage.getItem("user");
     this.user = JSON.parse(this.user);
     this.onload();
     this.data = () => {
       return {"username":this.user.username};
     }
  }

  //获取用户信息
  onload():void {
      let url = 'api/individual';
      this.http.get(url,{params:{
        username: this.user.username
      }}).subscribe((res:any) => {
          if (res) {
             this.id = res.id;
             this.userRealName = res.userRealName;
             this.username = res.username;
             this.age = res.age;
             this.sex = res.sex;
             this.password = res.password;
             this.phone = res.phone;
             this.address = res.address;
             this.role = res.roleId == 1? '系统管理员':'社区管理员';
             this.userImg = '/api/file/'+res.userImg;
          }
      })
  }
 
  //回到管理页面
  onBack() {
   this.router.navigate(['/user']);
  }


  //打开个人信息弹出框
  showInformatioinModal(): void {
    this.validateForm.controls['id'].setValue(this.id);
    if (this.role === '系统管理员') {
      this.validateForm.controls['roleId'].setValue(1);
    } else {
      this.validateForm.controls['roleId'].setValue(2);
    }
    this.validateForm.controls['userRealName'].setValue(this.userRealName);
    this.validateForm.controls['username'].setValue(this.username);
    this.validateForm.controls['age'].setValue(this.age);
    this.validateForm.controls['sex'].setValue(this.sex);
    this.validateForm.controls['password'].setValue(this.password);
    this.validateForm.controls['address'].setValue(this.address);
    this.isInformationVisible = true;
  }

  //打开绑定手机弹出框
  showPhoneModal(): void {
    this.phonevalidateForm.controls['id'].setValue(this.id);
    this.phonevalidateForm.controls['username'].setValue(this.username);
    this.phonevalidateForm.controls['phone'].setValue(this.phone);
    this.isPhoneVisible = true;
  }
  
  //确认个人信息弹出框
  informationHandleOk(): void {
    this.isOkInformationLoading = true;
    if (this.validateForm.valid) {
      let url = 'api/individual';
      this.http.post(url,JSON.stringify(this.validateForm.value),{headers:this.headers}).subscribe((res:any) => {
         if (res === true) {
            this.msg.success('用户操作成功！', {
              nzDuration: 500
            });
            //在用户名和密码发生改变情况下，更新缓存里的用户名和密码
            let userMassage:any = localStorage.getItem('user');
            userMassage = JSON.parse(userMassage);
            userMassage.username = this.validateForm.value.username;
            userMassage.password = this.validateForm.value.password;
            let user = JSON.stringify(userMassage);
            localStorage.setItem("user" , user);
            //在用户名发生改变情况下，更新当前user里的用户名，因为onload是按照用户名检索信息，不更新会按照改变前的进行检索，会查不到信息
            this.user.username = this.validateForm.value.username;
            this.onload();
         }  
      },err => {
          this.msg.error('用户操作失败！', {
            nzDuration: 500
          });
      })
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
      let url = 'api/individual';
      this.http.post(url,JSON.stringify(this.phonevalidateForm.value),{headers:this.headers}).subscribe((res:any) => {
           if (res === true) {
            this.msg.success('用户操作成功！', {
              nzDuration: 500
            });
            this.onload();
           }
      },err => {
        this.msg.error('用户操作失败！', {
          nzDuration: 500
        });
      })
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
  
  //打开上传头像功能
  startImg():void {
    this.img_upload = true;
  }    
  //确认上传头像
  editImg():void {
    this.onload();
    this.msg.success('头像修改成功！', {
      nzDuration: 500
    });
    this.img_upload = false;
  }
  //取消上传头像
  cancel():void {
    this.img_upload = false;
  }

  //设置头像上传格式，大小
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
  new Observable((observer: Observer<boolean>) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.msg.error('You can only upload JPG file!');
      observer.complete();
      return;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.msg.error('Image must smaller than 2MB!');
      observer.complete();
      return;
    }
    observer.next(isJpgOrPng && isLt2M);
    observer.complete();
  });

//说明，在上传完图片后，也拿到了fileuuid,但是不知道为什么info.file.status是error,所有直接从error里取fileuuid了
handleChange(info: { file: NzUploadFile }): void {
  switch (info.file.status) {
    case 'uploading':
      this.loading = true;
      break;
    case 'done':
          break;
    case 'error':
      this.avatarUrl ='api/file/'+ info.file.error.error.text;
      this.loading = false;
      break;
  }
}
}
