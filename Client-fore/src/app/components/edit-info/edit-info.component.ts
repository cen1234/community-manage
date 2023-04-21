import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';

interface ItemData {
  id: number;
  comId:number;
  userRealName: string;
  username: string;
  age: number;
  sex:string;
  password:string;
  phone:string;
  address: string;
  userImg:string;
}
interface communityData {
  name:string;
  comId:number;
}
@Component({
  selector: 'app-edit-info',
  templateUrl: './edit-info.component.html',
  styleUrls: ['./edit-info.component.css']
})
export class EditInfoComponent implements OnInit {
  
  visible = false;//编辑资料抽屉是否可见
  public passwordVisible = false;//密码输入框可视
  public user:any;
  public validateForm: UntypedFormGroup;//用户表格
  communityInfo:communityData [] = [];//存储社区id和名字的数组
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private router: Router,private message: NzMessageService,private fb: UntypedFormBuilder,private http:HttpClient) {
    this.validateForm = this.fb.group({
      id:[''],
      comId:[0],
      userRealName: ['', [Validators.required],[this.userRealnameAsyncValidator]],
      username: ['', [Validators.required],[this.userNameAsyncValidator]],
      age: ['', [Validators.required],[this.ageValidator]],
      sex:['',[Validators.required]],
      password:['',[Validators.required],[this.pwdValidator]],
      address:['',[Validators.required],[this.addressAsyncValidator]],
      phone:['',[Validators.required],[this.phoneAsyncValidator]],
      userImg:['']
    });
   }

  ngOnInit(): void {
    //从浏览器缓存取出用户信息
    this.user  =localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.open();
  }
  

  //打开编辑资料
  open():void {
    this.getCommunity();
    setTimeout(() => {
      this.validateForm.controls['id'].setValue(this.user.id);
      this.validateForm.controls['userRealName'].setValue(this.user.userRealName);
      this.validateForm.controls['username'].setValue(this.user.username);
      this.validateForm.controls['age'].setValue(this.user.age);
      this.validateForm.controls['sex'].setValue(this.user.sex);
      this.validateForm.controls['password'].setValue(this.user.password);
      this.validateForm.controls['phone'].setValue(this.user.phone);
      this.validateForm.controls['address'].setValue(this.user.address);
      this.validateForm.controls['userImg'].setValue(this.user.userImg); 
      this.visible = true;
    },1000) 
  }


 //关闭编辑资料
 close(): void {
  this.visible = false;
  this.validateForm.reset();
  for (const key in this.validateForm.controls) {
    if (this.validateForm.controls.hasOwnProperty(key)) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }
  this.router.navigate(['/user']);
 }

 //编辑表单确认提交
 submit():void {
  if (this.validateForm.valid) {
    let url = 'api/user';
    this.http.post(url,JSON.stringify(this.validateForm.value),{headers:this.headers}).subscribe(res => {
      if( res === true) {
        this.message.success('用户操作成功！', {
          nzDuration: 500
        });
        //更新缓存中的用户信息
        localStorage.clear();
        localStorage.setItem("user",JSON.stringify(this.validateForm.value));
      }
    },err => {
      this.message.error('用户操作失败！', {
        nzDuration: 500
      });
    })
  } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
  }
 }

 //获取所有社区id及社区名
 getCommunity():void {
  let url = 'api/community/findAll';
  this.http.get(url).subscribe((res:any) => {
    this.communityInfo = res.map((item:any) => {
      let obj:any = {};
       obj['comId'] = item.id;
       obj['name'] = item.name;
       return obj;
    })
  })

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
        } else if (control.value.length > 300) {
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
