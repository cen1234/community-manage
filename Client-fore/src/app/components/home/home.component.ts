import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';
import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { Router,ActivatedRoute,Params } from '@angular/router';

interface ItemData {
  id: number;
  comId:number;
  content:string;
  founder:string;
  userImg:string;
  creatTime:string;
  isSolve:string;
}
interface HealthData {
  id: number;
  comId:number;
  name:string;
  content:string;
  founder:string;
  userImg:string;
  creatTime:string;
}



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,OnDestroy {
  public SelectedIndex:number = 0;//当前激活tab面板的序列号
  public user:any;
  public ds:any;
  public healthDs:any;
  private destroy$ = new Subject();
  
  constructor(private activateInfo:ActivatedRoute,private router: Router,private http:HttpClient,private message: NzMessageService) { }

  ngOnInit(): void {
     this.user  =localStorage.getItem("user");
     this.user = JSON.parse(this.user);
     this.ds = new MyDataSource(this.http);
     this.ds
      .completed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.message.warning('已经到底了！');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(1);
    this.destroy$.complete();
  }
  
  //查看问题
  check(id:number):void {
    this.router.navigate(['/article'],{
      queryParams:{
        id:id,
        type:1
      }
    })
  }
  
//查看健康知识
checkHealth(id:number):void {
  this.router.navigate(['/article'],{
    queryParams:{
      id:id,
      type:2
    }
  })
}


   //tab页改变
   SelectedIndexChange(newSelectIndex:number) {
    this.SelectedIndex = newSelectIndex;
     if (this.SelectedIndex === 0) {
        this.ds = new MyDataSource(this.http);
     } else if (this.SelectedIndex === 1) {
        this.healthDs = new HealthDataSource(this.http);  
     }
 }

}

class MyDataSource extends DataSource<ItemData> {
  private pageSize = 10;
  private cachedData: ItemData[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<ItemData[]>(this.cachedData);
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

  connect(collectionViewer: CollectionViewer): Observable<ItemData[]> {
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
      .get<{ results: ItemData[] }>('api/question/page',{
        params:{
          pageNum:page,
          pageSize:this.pageSize,
          search:"",
          comId: this.user.comId 
        }
      })
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res:any) => {
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.records);
        this.dataStream.next(this.cachedData);
      });
  }
}

class HealthDataSource extends DataSource<HealthData> {
  private pageSize = 3;
  private cachedData: HealthData[] = [];
  private fetchedPages = new Set<number>();
  private dataStream = new BehaviorSubject<HealthData[]>(this.cachedData);
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

  connect(collectionViewer: CollectionViewer): Observable<HealthData[]> {
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
      .get<{ results: HealthData[] }>('api/hospital/pageHealth',{
        params:{
          pageNum:page,
          pageSize:this.pageSize,
          comId: this.user.comId,
          search:"",
          type:"name"
        }
      })
      .pipe(catchError(() => of({ results: [] })))
      .subscribe((res:any) => {
        this.cachedData.splice(page * this.pageSize, this.pageSize, ...res.records);
        this.dataStream.next(this.cachedData);
      });
  }
}
