import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute,Params } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';



@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  
  public userImg:string = '';//用户头像
  public userName:string = '';//用户名
  public userRole:string = '';//用户身份
  public user:any;//存储用户信息


  constructor(private activateInfo:ActivatedRoute,private router: Router,private message: NzMessageService,private fb: UntypedFormBuilder,private http:HttpClient) { }

  ngOnInit(): void {
    //从浏览器缓存取出用户信息
    this.user  =localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.userImg = 'api/file/' + this.user.userImg;
    this.userName = this.user.username;
    if (this.user.roleId == 4) {
      this.userRole = '志愿者';
    } else if (this.user.roleId == 3) {
      this.userRole = '社区工作人员';
    }
  }

  //退出系统
  loginOut() {
    this.router.navigate(['/login']);
    localStorage.clear();
    this.message.success('用户登出成功！', {
      nzDuration: 500
    });
  }

  //查看个人资料
  check():void {
    this.router.navigate(['/information']);
  }
  
  //编辑个人资料
  edit():void {
    this.router.navigate(['/editInfo']);
  }

  //编辑个人头像
  editImg():void {
    this.router.navigate(['/editImg']);
  }

  //问题管理
  question():void {
    this.router.navigate(['/question']);
  }

  //物资借用
  borrow():void {
    this.router.navigate(['/material']);
  }

  //申请志愿者
  apply():void {
    this.router.navigate(['/apply']);
  }

  //特殊人员认证
  need():void {
    this.router.navigate(['/need']);
  }
 
  //工作管理
  work(type:number):void {
    this.router.navigate(['/work'],{
      queryParams:{
        type:type
      }
    })
  }




}
