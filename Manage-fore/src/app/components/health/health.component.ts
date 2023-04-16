import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { EChartsOption, number } from 'echarts';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';

interface ItemData {
  id: number;
  comId:number;
  name:string;
  content: string;
  founder:string;
  creatTime: string;
}

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {
  
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public inputValue: string = '';//搜索框输入值
  public selectType:string = 'name';//搜索框搜索类型
  checked = false;
  indeterminate = false;
  listOfCurrentPageData:readonly  ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();
  pageIndex:number = 1;
  pageSize:number = 5;
  total:number = 10;
  communityId:number = 1;//存储社区id
  founder:string = ''//存储当前登录的社区管理员姓名
  public isVisible:boolean = false;//新增医院弹窗是否出现
  public isOkLoading:boolean = false;//新增医院弹窗提交数据是否加载
  public validateForm: UntypedFormGroup;//新增医院表单
  expandSet = new Set<number>();
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private fb: UntypedFormBuilder,private http:HttpClient,private message: NzMessageService) { 
    this.validateForm = this.fb.group({
      id:[''],
      comId: [1],
      name:['',[Validators.required]],
      content: ['',[Validators.required]],
      founder:[''],
      creatTime: ['']
    });
  }

  ngOnInit(): void {
     //获取社区管理员所在社区的id
     let user:any = localStorage.getItem('user');
     user = JSON.parse(user);
     this.communityId = user.comId;
     this.founder = user.userRealName;
     this.onload();
  }

  //分页获取数据
  onload():void {
    let url = 'api/hospital/pageHealth';
    this.http.get(url,{
      params:{
        pageNum:this.pageIndex,
        pageSize:this.pageSize,
        comId:this.communityId,
        search:this.inputValue,
        type:this.selectType 
      }
    }).subscribe((res:any) => {
        if (res) {
          this.listOfData = res.records;
          this.total = res.total;
        }
    })
  }

  add():void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.validateForm.controls['comId'].setValue(this.communityId);
    this.validateForm.controls['founder'].setValue(this.founder);
    this.validateForm.controls['creatTime'].setValue(this.getCurrentTime());
    this.isVisible = true;
  }

   //取消
   handleCancel(): void {
    this.isVisible = false;
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

  //数据确认提交
  handleOk(): void {
    this.isOkLoading = true;
    if (this.validateForm.valid) {
      let url = 'api/hospital/addHealth';
      this.http.post(url,JSON.stringify(this.validateForm.value),{headers:this.headers}).subscribe(res => {
        if( res === true) {
          this.message.success('用户操作成功！', {
            nzDuration: 500
          });
          this.onload();
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
  
  
  //当前页发生改变
    onCurrentPageDataChange($event: readonly ItemData[]): void {
      this.listOfCurrentPageData = $event;
      this.refreshCheckedStatus();
    }

    //页码改变
    nzPageIndexChange(newPageIndex:number):void{
        this.pageIndex = newPageIndex;
        this.onload();
    }

    //页大小改变
    nzPageSizeChange(newPageSize:number) {
      this.pageSize = newPageSize;
      this.onload();
    }

  //刷新选中状态
  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
  //表格展开折叠
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
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
