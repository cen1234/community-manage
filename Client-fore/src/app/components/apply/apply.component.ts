import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';

interface ItemData {
  id: number;
  comId:number;
  name:string;
  age: number;
  sex: string;
  phone:string;
  address: string;
  available:string;
  skill:string;
  formal:string;
  applyTime:string;
  approver:string; 
}
interface ApproveData {
  applyId:number;
  name:string;
  advice:string;
  approverTime:string
}

@Component({
  selector: 'app-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent implements OnInit {

  public user:any = {};
  public roleId:number = 0;
  public approve:any [] = [];//申请人信息
  public approver = '';
  visible = false;//抽屉是否可见
  public flag:boolean = false;
  public approverData:ApproveData[] = [];//存储当前审批人信息
  public validateForm: UntypedFormGroup;//表格
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private router: Router,private activateInfo:ActivatedRoute,private http:HttpClient,private fb: UntypedFormBuilder,private message: NzMessageService) {
    this.validateForm = this.fb.group({
      comId:[0],
      name: [''],
      age: [0],
      sex: [''],
      phone:[''],
      address:[''],
      available: [''],
      skill:['',[Validators.required]],
      formal:[''],
      applyTime:[''],
      approver: [''],
    });
   }

  ngOnInit(): void {
    this.user  =localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.roleId = this.user.roleId;
    this.load();
    this.validateForm.controls['comId'].setValue(this.user.comId);
    this.validateForm.controls['name'].setValue(this.user.userRealName);
    this.validateForm.controls['age'].setValue(this.user.age);
    this.validateForm.controls['sex'].setValue(this.user.sex);
    this.validateForm.controls['phone'].setValue(this.user.phone);
    this.validateForm.controls['address'].setValue(this.user.address);
    this.validateForm.controls['available'].setValue('空闲');
    this.validateForm.controls['formal'].setValue('申请');   
    this.validateForm.controls['applyTime'].setValue(this.getCurrentTime());
    this.getCommunity();
  }

  load():void {
    let url = 'api/volunteer/getApplyId';
    this.http.get(url,{
      params:{
        name:this.user.userRealName
      }
    }).subscribe((res:any) => {
       if (res) {
         this.flag = true;
         let id = res.id;
         let url1 = 'api/volunteer/getApprover';
         this.http.get(url1,{
           params:{
            applyId:id
           }
         }).subscribe((res:any) => {
            if (res) {
               this.approverData = res;      
            }
         })
       } else {
          this.visible = true;
       }
    })
  }

   //获取当前社区所有社区管理者姓名
   getCommunity():void {
      let url = 'api/user/getCommunity';
      this.http.get(url,{
        params:{
          comId:this.user.comId
        }
      }).subscribe((res:any) => {
         if (res) {
           this.approve = res.map((item:any) => {
             return item.userRealName;
           })
           let index =Math.floor(Math.random()*this.approve.length);
           this.approver = this.approve[index];
           this.validateForm.controls['approver'].setValue(this.approver); 
         }
      })
   }

    //关闭申请抽屉
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

    //申请表单确认
    submit():void {
      //新增志愿者
      if (this.validateForm.valid) {
        let url = 'api/volunteer';
        this.http.post(url,JSON.stringify(this.validateForm.value),{headers:this.headers}).subscribe(res => {
          if( res === true) {
            let getIdUrl = 'api/volunteer/getApplyId';
            this.http.get(getIdUrl,{
              params:{
                name:this.user.userRealName
              }
            }).subscribe((res:any) => {
              if (res) {
                this.message.success('用户操作成功！', {
                  nzDuration: 500
                });
                this.router.navigate(['/user']);
              }
            })
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
