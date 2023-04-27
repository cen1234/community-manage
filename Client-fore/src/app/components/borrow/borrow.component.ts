import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';

interface MData {
  id: number;
  comId:number;
  name:string;
  count:number;
  belongCommunity:string;
  available: string;
  borrowedCount:number;
  isExpand:boolean;
}

interface ItemDate {
  id: number;
  materialsId: number;
  userName: string;
  materialsName: string;
  count: number;
  back:string;
  phone:string;
  address:string;
  time:string;
}

@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.css']
})
export class BorrowComponent implements OnInit {

  public id:number = 0;//物资id
  public user:any = {};
  public name:string = '';//用户名
  public flag:boolean = false;//提示归还标志
  public data:ItemDate [] = [];//借用人-物资信息
  public mdata:MData = {
    id: 0,
    comId: 0,
    name: '',
    count: 0,
    belongCommunity: '',
    available: '',
    borrowedCount: 0,
    isExpand: false
  };
  isVisible = false;
  isOkLoading = false;
  public validateForm: UntypedFormGroup;//表格
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private router: Router,private activateInfo:ActivatedRoute,private http:HttpClient,private fb: UntypedFormBuilder,private message: NzMessageService) {
    activateInfo.queryParams.subscribe(queryParams => {
      let id = queryParams['id'];
      this.id = id;
    })
    this.validateForm = this.fb.group({
      materialsId:[0],
      userName: [''],
      materialsName: [''],
      count: [0, [Validators.required]],
      back: [''],
      phone: [''],
      address:[''],
      time:['']
    });
   }

  ngOnInit(): void {
    this.user  =localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.name = this.user.username;
    this.getMyBorrowed();
    if (!this.flag) {
       this.getInfo();
    }
  }

  //获取用户借用信息,如果当前用户借用记录超过3条，要求先将物资归还才能再次借
  getMyBorrowed() {
     let url = 'api/userMaterials/myBorrowed';
     this.http.get(url,{
       params:{
        name:this.name
       }
     }).subscribe((res:any) => {
          if (res) {
             this.data = res;
             this.flag = res.length > 3? true:false;
          }
     }) 
  }

  //根据物资id获取物资信息
  getInfo():void {
    let url = 'api/materials/getInfo';
    this.http.get(url,{
      params:{
        id:this.id
      }
    }).subscribe((res:any) => {
       if (res) {
          this.mdata = res;
       }
    })
  }

  showModal(): void {
    this.isVisible = true;
    this.validateForm.reset();
      for (const key in this.validateForm.controls) {
        if (this.validateForm.controls.hasOwnProperty(key)) {
          this.validateForm.controls[key].markAsPristine();
          this.validateForm.controls[key].updateValueAndValidity();
        }
      }
      this.validateForm.controls['materialsId'].setValue(this.id);
      this.validateForm.controls['userName'].setValue(this.user.username);
      this.validateForm.controls['materialsName'].setValue(this.mdata.name);
      this.validateForm.controls['back'].setValue('否');
      this.validateForm.controls['phone'].setValue(this.user.phone);
      this.validateForm.controls['address'].setValue(this.user.address);
      this.validateForm.controls['time'].setValue(this.getCurrentTime());
  }

  handleOk(): void {
    this.isOkLoading = true;
    if (this.validateForm.valid) {
      //新增一条记录
      let url = 'api/userMaterials';
      this.http.post(url,JSON.stringify(this.validateForm.value),{headers:this.headers}).subscribe(res => {
        if( res === true) {
          let updateUrl = 'api/materials';
          let temp =JSON.parse(JSON.stringify(this.validateForm.value));
          let obj:any = {};
          obj['id'] = this.mdata.id;
          obj['count'] = this.mdata.count;
          obj['borrowedCount'] = this.mdata.borrowedCount + temp.count;
          if ( obj['count'] == obj['borrowedCount']) {
              obj['available'] = 'false';
          }
          this.http.post(updateUrl,JSON.stringify(obj),{headers:this.headers}).subscribe((res:any) => {
            this.message.success('用户操作成功！', {
              nzDuration: 500
            });
            this.getInfo();
          })

        }
      },err => {
        this.message.error('用户操作失败！', {
          nzDuration: 500
        });
      })
      setTimeout(() => {
        this.isVisible = false;
        this.isOkLoading = false;
      }, 500);
    } else {
        this.isVisible = true;
        this.isOkLoading = false;
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
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
