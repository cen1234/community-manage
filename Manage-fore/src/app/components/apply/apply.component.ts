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
  age: number;
  sex: string;
  phone:string;
  address: string;
  skill:string;
  applyTime:string;
  formalTime:string;
  formal:string;
}
interface ApproveData {
  id:number;
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
  
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public inputValue: string = '';//搜索框输入值
  checked = false;
  indeterminate = false;
  listOfCurrentPageData:readonly  ItemData[] = [];
  listOfData: readonly ItemData[] = [];//表格数据
  setOfCheckedId = new Set<number>();//多选框选中集合
  pageIndex:number = 1;//当前页
  pageSize:number = 5;//每页展示多少数据
  total:number = 10;//表格数据总数
  public communityId:number = 1;//存储社区id
  public userRealName:string = '';//存储当前登录社区管理员真实姓名
  public applydata:any = {};//存储当前申请者信息
  public approverData:ApproveData[] = [];//存储当前审批人信息
  public show:boolean = false;//审批进度是否显示
  public isVisible:boolean = false;//审批弹窗是否出现
  public isOkLoading:boolean = false;//审批弹窗提交数据是否加载
  public approveObj:any = {};//存储审批表单信息
  public advice:string = '';//输入意见
  public isFinal:string = '';//是否为最终审批
  public nextApprover:string = '';//下一位审批人
  public userData:string [] = [];//存储所有审批人姓名 
  public applyObj:any = {};//存储申请人id.name,formal
  public isApproved:boolean = false;//当前登录社区管理员是否已审核完相关申请者
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头
  constructor(private fb: UntypedFormBuilder,private http:HttpClient,private message: NzMessageService) {
     
   }

  ngOnInit(): void {
     //获取社区管理员所在社区的id
     let user:any = localStorage.getItem('user');
     user = JSON.parse(user);
     this.communityId = user.comId;
     this.userRealName = user.userRealName;
     this.onload();
  }

  //分页获取数据
  onload(): void {
    let url = 'api/volunteer/page';
    this.http.get(url,{
      params:{
        pageNum:this.pageIndex,
        pageSize:this.pageSize,
        search:this.inputValue,
        comId:this.communityId,
        formal:'申请',
        approver:this.userRealName
      }}).subscribe((res:any) => {
       this.listOfData = res.records;
       this.total = res.total;
    })
  }

   //删除单个
   Singleconfirm(id:number) {
    let url = 'api/volunteer/delete/'+id;
    this.http.post(url,{headers:this.headers}).subscribe(res => {
       if (res === true) {
          this.message.success('申请者删除成功！', {
            nzDuration: 500
          });
          this.onload();
       }
    })
  }

  //取消批量删除
  cancel(): void {}
   
   //批量删除二次确认
   confirm(): void {
    let delList:any = [];
    this.setOfCheckedId.forEach(item => {
      delList.push(item);
    })
    let url = 'api/volunteer/deleteSelect/'+delList;
    this.http.post(url,{headers:this.headers}).subscribe(res => {
      if (res === true) {
         this.message.success('申请者删除成功！', {
            nzDuration: 500
        });
        this.onload();
     }
    })
  }

   //导出申请者
   export() {
    window.open('http://localhost:9000/volunteer/export/'+this.communityId);
 }
 
  //显示审批进度
  check(data:any):void {
     this.applydata = data;
     let url = 'api/volunteer/getApprover';
     this.http.get(url,{params:{
       applyId:this.applydata.id
     }}).subscribe((res:any) => {
        if (res) {
           this.approverData = res;
           if ((this.applydata['formal'] === '申请'  && this.nextApprover !== '') || this.applyObj['formal'] === '正式') {
                this.isApproved = true;
           }
           this.show = !this.show;
        }
     })

  }

  //打开审批弹出框
  apply(data:ItemData):void {
    //清空之前弹窗审批信息
    this.advice = '';
    this.isFinal = '';
    this.nextApprover = '';
    //将表格里的申请人信息赋给要提交的对象
    this.approveObj['applyId'] = data.id;
    this.applyObj['id'] = data.id;
    this.applyObj['name'] = data.name;
    //获取审批人信息
    let url = 'api/user/getApprover';
    this.http.get(url,{
      params:{
        comId:this.communityId
      }
    }).subscribe((res:any) => {
       if (res) {
          this.userData = res.map((item:any) => {
                return item.userRealName;
          })
          this.isVisible = true;
       }
    })
  }

  //审批取消
  handleCancel(): void {
    this.isVisible = false;
  }
  
  //审批数据确认提交
  handleOk(): void {
    this.isOkLoading = true;
    this.advice = this.advice === ''? '审批同意':this.advice;
    this.approveObj['name'] = this.userRealName;
    this.approveObj['advice'] = this.advice;
    this.approveObj['approverTime'] = this.getCurrentTime();
      //增加一条审批数据，
     let addApproveUrl = 'api/volunteer/saveApprove';
     this.http.post(addApproveUrl,JSON.stringify(this.approveObj),{headers:this.headers}).subscribe((res:any) => {
          if (res) {
               //如果当前是最终审批，则修改申请者为正式志愿者，审批人设为空字符串，新增成为正式时间
               if (this.isFinal === '是') {
                this.applyObj['formal'] = '正式';
                this.applyObj['approver'] = '';
                this.applyObj['formalTime'] = this.getCurrentTime();
                let url = 'api/volunteer';
                this.http.post(url,JSON.stringify(this.applyObj),{headers:this.headers}).subscribe((res:any) => {
                   if (res) {
                      this.message.success('当前申请人已成为正式志愿者！', {
                        nzDuration: 500
                      });
                      let updateRole = 'api/user/updateRole';
                      this.http.get(updateRole,{
                        params:{
                          userRealName:this.applyObj['name']
                        }
                      }).subscribe((res) => {
                        this.isVisible = false;
                        this.isOkLoading = false;
                      })
                   }
                })
             } else if (this.isFinal === '否') {
                //当前不是最终审批，只需要把审批人修改为下一审批人
                this.applyObj['approver'] = this.nextApprover;
                let url = 'api/volunteer';
                this.http.post(url,JSON.stringify(this.applyObj),{headers:this.headers}).subscribe((res:any) => {
                  if (res) {
                     this.message.success('审批意见已提交！', {
                       nzDuration: 500
                     });
                     setTimeout(() => {
                       this.isVisible = false;
                       this.isOkLoading = false;
                   }, 500);
                  }
               })
             }

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
  
   //刷新选中状态
   refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  //更新选中集合
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

 //单个选中
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

 //全部选中
  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
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
