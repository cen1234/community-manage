import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';

interface ItemData {
  id: number;
  comId:number;
  content: string;
  founder:string;
  userImg:string;
  creatTime: string;
  isSolve:string;
}

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  
  visible = false;//编辑资料抽屉是否可见
  public user:any;
  public validateForm: UntypedFormGroup;//用户表格
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private router: Router,private message: NzMessageService,private fb: UntypedFormBuilder,private http:HttpClient) {
    this.validateForm = this.fb.group({
      comId:[0],
      content: ['',[Validators.required]],
      founder: [''],
      userImg: [''],
      creatTime:[''],
      isSolve:['']
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
      this.visible = true; 
      this.validateForm.controls['comId'].setValue(this.user.comId);
      this.validateForm.controls['founder'].setValue(this.user.username);
      this.validateForm.controls['userImg'].setValue(this.user.userImg);
      this.validateForm.controls['creatTime'].setValue(this.getCurrentTime());
      this.validateForm.controls['isSolve'].setValue('否');    
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
  this.router.navigate(['/home']);
 }

 
 //编辑表单确认提交
 submit():void {
  if (this.validateForm.valid) {
    let url = 'api/question';
    this.http.post(url,JSON.stringify(this.validateForm.value),{headers:this.headers}).subscribe(res => {
      if( res === true) {
        this.message.success('用户操作成功！', {
          nzDuration: 500
        });
        this.router.navigate(['/home']);
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

  //获取yyyy-MM-dd hh:mm:ss格式的时间字符串
  getCurrentTime():string {
    let currentTime:string = '';
    let time = new Date();
    let yyyy = time.getFullYear().toString();
    let MM = time.getMonth()+1;
    let dd = time.getDate();
    let hh = time.getHours();
    let mm = time.getMinutes();
    let ss = time.getSeconds();
    currentTime = yyyy + '-' + MM + '-'+ dd + ' '+ hh + ':' + mm + ':' + ss;
    return currentTime;  
  }

}
