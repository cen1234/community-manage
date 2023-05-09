import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

interface ItemData {
  score:number;
  workCount:number;
}
interface TaskData {
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

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.css']
})
export class WorkComponent implements OnInit,OnDestroy {
  
  public type:number =0;
  public user:any;//存储用户信息
  public workTotal:ItemData = {
    score: 0,
    workCount: 0
  };
  switchValue = false;//空闲繁忙开关值
  loading = false;
  value = '空闲';
  public ds:any;
  private destroy$ = new Subject();
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private router: Router,private activateInfo:ActivatedRoute,private http:HttpClient,private message: NzMessageService) { 
    activateInfo.queryParams.subscribe(queryParams => {
      let type = queryParams['type'];
      this.type = type; 
    })
  }

  ngOnInit(): void {
    this.user  =localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.onload();
    this.ds
     .completed()
     .pipe(takeUntil(this.destroy$))
     .subscribe(() => {
       this.message.warning('已经到底了！');
     });
  }

  onload():void {
    this.Total();
    if (this.type == 1) {
      this.ds = new MyDataSource(this.http);
    } else if (this.type == 2) {
      this.ds = new MyDataSource2(this.http);
    }
  }
 
  
  //获取用户工作总积分，总数量，及具体工作
  Total():void {
    if (this.type == 1) {
      let volunteerUrl = 'api/volunteer/getApplyId';
      this.http.get(volunteerUrl,{
        params:{
          name:this.user.userRealName
        }
      }).subscribe((res:any) => {
          this.workTotal['score'] = res.score;
          this.workTotal['workCount'] = res.workCount;
      })
  } else if (this.type == 2) {
    let staffUrl = 'api/staff/getByName';
    this.http.get(staffUrl,{
     params:{
       name:this.user.userRealName
     }
   }).subscribe((res:any) => {
       this.workTotal['score'] = res.score;
       this.workTotal['workCount'] = res.workCount;
   })
  }
  }

 //修改状态
  clickSwitch(): void {
    this.loading = true;
    if (this.value == '忙碌') {
       this.value = '空闲';
       setTimeout(() => {
        this.switchValue = false;
        this.loading = false;
      }, 500);
    } else {
      this.value = '忙碌';
      setTimeout(() => {
        this.switchValue = true;
        this.loading = false;
      }, 1000);
    }

    if (this.type == 1) {
      let url1 = 'api/volunteer/updateStatus';
      this.http.get(url1,{
        params:{
          name:this.user.userRealName,
          status:this.value
        }
      }).subscribe((res) => {
         if( res) {
            this.message.success('用户操作成功！', {
              nzDuration: 500
            });
         }
      })
    } else if (this.type == 2) {
      let url2 = 'api/staff/updateStatus';
      this.http.get(url2,{
        params:{
          name:this.user.userRealName,
          status:this.value
        }
      }).subscribe((res) => {
         if( res) {
            this.message.success('用户操作成功！', {
              nzDuration: 500
            });
         }
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(1);
    this.destroy$.complete();
  }
  
  check(id:number):void {
    this.router.navigate(['/content'],{
      queryParams:{
        type:this.type,
        id:id
      }
    })
  }


 

}

class MyDataSource extends DataSource<TaskData> {
  private pageSize = 3;
  private cachedData: TaskData[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<TaskData[]>(this.cachedData);
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();
  private user:any = '';

  constructor(private http: HttpClient) {
    super();
    this.user =localStorage.getItem("user");
    this.user = JSON.parse(this.user);

  }

  completed(): Observable<void> {
    return this.complete$.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<TaskData[]> {
    this.setup(collectionViewer);
    return this.dataStream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private setup(collectionViewer: CollectionViewer): void {
    this.fetchPage(0);
    collectionViewer.viewChange.pipe(takeUntil(this.complete$), takeUntil(this.disconnect$)).subscribe(range => {
      if (this.cachedData.length >= 50) {
        this.complete$.next();
        this.complete$.complete();
      } else {
        const endPage = this.getPageForIndex(range.end);
        this.fetchPage(endPage + 1);
      }
    });
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);
    
    this.http
      .get<{ results: TaskData[] }>('api/task/page',{
        params:{
          pageNum:page,
          pageSize:this.pageSize,
          comId: this.user.comId,
          search:this.user.userRealName,
          type:"implementer"
        }
      })
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res:any) => {
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.records);
        this.dataStream.next(this.cachedData);
      });
  }
}

class MyDataSource2 extends DataSource<TaskData> {
  private pageSize = 3;
  private cachedData: TaskData[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<TaskData[]>(this.cachedData);
  private complete$ = new Subject<void>();
  private disconnect$ = new Subject<void>();
  private user:any = '';

  constructor(private http: HttpClient) {
    super();
    this.user =localStorage.getItem("user");
    this.user = JSON.parse(this.user);

  }

  completed(): Observable<void> {
    return this.complete$.asObservable();
  }

  connect(collectionViewer: CollectionViewer): Observable<TaskData[]> {
    this.setup(collectionViewer);
    return this.dataStream;
  }

  disconnect(): void {
    this.disconnect$.next();
    this.disconnect$.complete();
  }

  private setup(collectionViewer: CollectionViewer): void {
    this.fetchPage(0);
    collectionViewer.viewChange.pipe(takeUntil(this.complete$), takeUntil(this.disconnect$)).subscribe(range => {
      if (this.cachedData.length >= 50) {
        this.complete$.next();
        this.complete$.complete();
      } else {
        const endPage = this.getPageForIndex(range.end);
        this.fetchPage(endPage + 1);
      }
    });
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number): void {
    if (this.fetchedPages.has(page)) {
      return;
    }
    this.fetchedPages.add(page);
    
    this.http
      .get<{ results: TaskData[] }>('api/work/page',{
        params:{
          pageNum:page,
          pageSize:this.pageSize,
          comId: this.user.comId,
          search:this.user.userRealName,
          type:"implementer"
        }
      })
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res:any) => {
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.records);
        this.dataStream.next(this.cachedData);
      });
  }
}