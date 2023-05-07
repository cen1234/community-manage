import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
interface ItemData {
  comId:number;
  name:string;
  age: number;
  sex: string;
  phone:string;
  address: string;
  type:string;
  remarks:string
}
@Component({
  selector: 'app-in-need',
  templateUrl: './in-need.component.html',
  styleUrls: ['./in-need.component.css']
})
export class InNeedComponent implements OnInit {
  
  visible = false;//抽屉是否可见
  public user:any;
  public validateForm: UntypedFormGroup;//用户表格
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private router: Router,private message: NzMessageService,private fb: UntypedFormBuilder,private http:HttpClient) {
    this.validateForm = this.fb.group({
      comId: [0],
      name: [''],
      age: [0],
      sex: [''],
      phone:[''],
      address:[''],
      type:['',[Validators.required]],
      remarks:['']
    });
   }


  ngOnInit(): void {
     //从浏览器缓存取出用户信息
     this.user  =localStorage.getItem("user");
     this.user = JSON.parse(this.user);
     this.open();
  }

      //打开编辑
      open():void {
          this.visible = true;
      }


    //关闭编辑
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
      this.validateForm.controls['comId'].setValue(this.user.comId);
      this.validateForm.controls['name'].setValue(this.user.userRealName);
      this.validateForm.controls['age'].setValue(this.user.age);
      this.validateForm.controls['sex'].setValue(this.user.sex);
      this.validateForm.controls['phone'].setValue(this.user.phone);
      this.validateForm.controls['address'].setValue(this.user.address);

      if (this.validateForm.valid) {
        let url = 'api/inneed';
        this.http.post(url,JSON.stringify(this.validateForm.value),{headers:this.headers}).subscribe(res => {
          if( res === true) {
            this.message.success('用户操作成功！', {
              nzDuration: 500
            });
            this.router.navigate(['/user']);
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

}
