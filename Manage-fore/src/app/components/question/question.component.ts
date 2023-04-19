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
  content: string;
  founder:string;
  creatTime: string;
  isSolve:string;
}
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public inputValue: string = '';//搜索框输入值
  listOfCurrentPageData:readonly  ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  pageIndex:number = 1;
  pageSize:number = 5;
  total:number = 10;
  communityId:number = 1;//存储社区id
  expandSet = new Set<number>();
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private http:HttpClient,private message: NzMessageService) { }

  ngOnInit(): void {
    //获取社区管理员所在社区的id
    let user:any = localStorage.getItem('user');
    user = JSON.parse(user);
    this.communityId = user.comId;
    this.onload();
  }

  //获取问题数据
  onload():void {
    let url = 'api/question/page';
    this.http.get(url,{
      params:{
        pageNum:this.pageIndex,
        pageSize:this.pageSize,
        search:this.inputValue,
        comId:this.communityId
      }
    }).subscribe((res:any) => {
        if (res) {
          this.listOfData = res.records;
          this.total = res.total;
        }
    })
  }

  //当前页发生改变
  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
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

   //表格展开折叠
   onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

}
