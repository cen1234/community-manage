import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';

interface ItemData {
  id: number;
  roleId:number;
  comId:number;
  userRealName: string;
  username: string;
  age: number;
  sex:string;
  password:string;
  phone:string;
  address: string;
}
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  public user:any;//存储用户信息
  public community:string = '';//用户当前所属社区
  visible = false;//编辑资料抽屉是否可见

  constructor(private router: Router,private message: NzMessageService,private fb: UntypedFormBuilder,private http:HttpClient) { }

  ngOnInit(): void {
    //从浏览器缓存取出用户信息
    this.user  =localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.getCommunity();
    this.open(); 
  }

  //获取用户所属社区
  getCommunity():void {
    let url = 'api/community/Name';
    this.http.get(url,{
      params:{
        id:this.user.comId
      }
    }).subscribe((res:any) => {
       if (res) {
         this.community = res.name;

       }
    })
  }

 //打开个人资料
  open():void {
    this.visible = true;
    
  }

 //关闭个人资料
 close(): void {
  this.visible = false;
  this.router.navigate(['/user']);
}

}
