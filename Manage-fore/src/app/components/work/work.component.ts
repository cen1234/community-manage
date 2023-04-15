import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { EChartsOption, number } from 'echarts';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';

interface ItemData {
  id:number;
  implementerId:number;
  comId:number;
  name:string;
  content:string;
  score:number;
  getscore:number;
  founder:string;
  implementer:string;
  comment:string;
  creatTime:string;
  finishTime:string;
}
interface StaffData {
   id:number;
   name:string;
}

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit {

  public isCollapsed:boolean = false;//侧边栏是否折叠
  public inputValue: string = '';//搜索框输入值
  public selectType:string = 'name';//搜索框搜索类型
  listOfCurrentPageData:readonly  ItemData[] = [];
  listOfData: readonly ItemData[] = [];//表格数据
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  pageIndex:number = 1;//当前页
  pageSize:number = 5;//每页展示多少数据
  total:number = 10;//表格数据总数
  communityId:number = 1;//存储社区id
  founder:string = ''//存储当前登录的社区管理员姓名
  public staffList:StaffData [] = [];//存储本社区所有社区工作人员
  public isVisible:boolean = false;//打分弹窗是否出现
  public isOkLoading:boolean = false;//打分弹窗提交数据是否加载
  public validateForm: UntypedFormGroup;//打分表单
  public isVisibleTask:boolean = false;//派发任务弹窗是否出现
  public isOkLoadingTask:boolean = false;//派发任务弹窗提交数据是否加载
  public validateFormTask: UntypedFormGroup;//派发任务表单
  expandSet = new Set<number>();
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];//打分提示
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private fb: UntypedFormBuilder,private http:HttpClient,private message: NzMessageService) { 
    this.validateForm = this.fb.group({
      id:[''],
      getscore: [0],
      comment: ['']
    });
    this.validateFormTask = this.fb.group({
      id:[''],
      implementerId: [0],
      comId: [1],
      name:['',[Validators.required]],
      content: ['',[Validators.required]],
      score: [0,[Validators.required]],
      founder:[''],
      implementer: [''],
      creatTime: [''],
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
 

  //分页获取任务数据
  onload():void {
    let url = 'api/work/page';
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

  //新增工作
  add():void {
    //获取所有本社区社区员工
    let url = 'api/staff/findAll';
    this.http.get(url,{
      params:{
        comId:this.communityId
      }
    }).subscribe((res:any) => {
       if (res) {
         this.staffList = res.map((item:any) => {
            let obj:any = {};
            obj['id'] = item.id;
            obj['name'] = item.name;
            return obj;
         })
         this.isVisibleTask = true;

      }
      
    })
  }

   //派发任务取消
   handleCancelTask(): void {
    this.isVisibleTask = false;
    this.validateFormTask.reset();
    for (const key in this.validateFormTask.controls) {
      if (this.validateFormTask.controls.hasOwnProperty(key)) {
        this.validateFormTask.controls[key].markAsPristine();
        this.validateFormTask.controls[key].updateValueAndValidity();
      }
    }
  }

  //派发任务数据确认提交
  handleOkTask(): void {
    this.isOkLoadingTask = true;
    if (this.validateFormTask.valid) {

      let temp = this.validateFormTask.value.implementer;
      this.staffList.forEach((item:any) => {
         if (item.name === temp) {
           this.validateFormTask.controls['implementerId'].setValue(item.id);
         }
      })
      this.validateFormTask.controls['comId'].setValue(this.communityId);
      this.validateFormTask.controls['founder'].setValue(this.founder);
      this.validateFormTask.controls['creatTime'].setValue(this.getCurrentTime());
      let url = 'api/work';
      this.http.post(url,JSON.stringify(this.validateFormTask.value),{headers:this.headers}).subscribe(res => {
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
        this.isVisibleTask = false;
        this.isOkLoadingTask = false;
      }, 500);
    } else {
        this.isVisibleTask = true;
        this.isOkLoadingTask = false;
        Object.values(this.validateFormTask.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
    }
  }

  //打分
  rate(id:number):void {
    this.isVisible = true;
    this.validateForm.controls['id'].setValue(id);
  }

  //打分取消
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

  //打分数据确认提交
  handleOk(): void {
    this.isOkLoading = true;
    if (this.validateForm.valid) {
      let url = 'api/work';
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
  

  //完成工作
  finish(id:number):void {
    let obj:any = {};
    obj['id'] = id;
    obj['finishTime'] = this.getCurrentTime();
    let url = 'api/work';
    this.http.post(url,JSON.stringify(obj),{headers:this.headers}).subscribe((res:any) => {
       if (res) {
        this.message.success('已结束本任务！', {
          nzDuration: 500
        });
        this.onload();
       }
    })
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

   //所属志愿者刷新选中状态
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
