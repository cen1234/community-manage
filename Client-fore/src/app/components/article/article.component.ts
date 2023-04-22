import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';

interface ItemData {
  id: number;
  comId:number;
  content: string;
  founder:string;
  userImg:string;
  creatTime: string;
  isSolve:string;
}
interface HealthData {
  id: number;
  comId:number;
  name:string;
  content:string;
  founder:string;
  creatTime:string;
}
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {

   public id:number = 0;//问题id
   public type:number =0;
   public question:ItemData = {
     id: 0,
     comId: 0,
     content: '',
     founder: '',
     userImg:'',
     creatTime: '',
     isSolve: ''
   };
   public health:HealthData = {
     id: 0,
     comId: 0,
     name: '',
     content: '',
     founder: '',
     creatTime: ''
   }
   public phone:string = '';//联系人电话
   headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private router: Router,private activateInfo:ActivatedRoute,private http:HttpClient,private message: NzMessageService) { 
    activateInfo.queryParams.subscribe(queryParams => {
      let id = queryParams['id'];
      let type = queryParams['type'];
      this.id = id;
      this.type = type; 
    })
  }
    
    
  ngOnInit(): void {  
    if (this.type == 1) {
      this.onload();  
    } else if (this.type == 2) {
      this.loadHealth();
    } else if (this.type == 3) {
       this.loadMyQuestion();
    }
   
  }
 
  //根据问题id获取具体数据
  onload() {
      let url = 'api/question/getQuestion/'+this.id;
      this.http.post(url,{headers:this.headers}).subscribe((res:any) => {
         if (res) {
           this.question = res;
           this.question['userImg'] = 'api/file/'+ this.question['userImg'];
           let userUrl = 'api/user/getContact';
           this.http.get(userUrl,{
             params:{
              username:this.question['founder']
             }
           }).subscribe((res:any) => {
               if (res) {
                 this.phone = res.phone;
               }
           })
         }
      })  
  }

  loadHealth():void {
    let url = 'api/hospital/getHealthById/'+this.id;
    this.http.post(url,{headers:this.headers}).subscribe((res:any) => {
      if (res) {
            this.health = res;
      }
    })
  }

  loadMyQuestion():void {
    let url = 'api/question/getQuestion/'+this.id;
    this.http.post(url,{headers:this.headers}).subscribe((res:any) => {
      if (res) {
        this.question = res;
        this.question['userImg'] = 'api/file/'+ this.question['userImg'];
      }
   })  
  }

  goback():void {
     if (this.type == 1 || this.type == 2) {
       this.router.navigate(['/home']);
     } else if (this.type == 3) {
       this.router.navigate(['/question']);
     } 
  }

  //将未解决状态修改为已解决
  solve(id:number) {
    let url = 'api/question';
    let obj:any = {};
    obj['id'] = id;
    obj['isSolve'] = '是';
    this.http.post(url,JSON.stringify(obj),{headers:this.headers}).subscribe((res:any) => {
       if (res) {
        this.message.success('用户删除成功！', {
          nzDuration: 500
        });
          this.loadMyQuestion();
       }
    })
  }
  
  //取消删除
  cancel(): void {}
 
  //确认删除
  confirm(id:number): void {
    let url = 'api/question/delete/'+id;
    this.http.post(url,{headers:this.headers}).subscribe((res:any) => {
      if (res) {
        this.message.success('删除成功！', {
          nzDuration: 500
        });
        this.router.navigate(['/question']);
      }
    })
    
  }
}
