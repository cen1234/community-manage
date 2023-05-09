import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
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
@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent implements OnInit {
  
  public type:number =0;
  public id:number = 0;
  public data:ItemData = {
    id: 0,
    implementerId: 0,
    comId: 0,
    name: '',
    content: '',
    score: 0,
    getscore: 0,
    founder: '',
    implementer: '',
    comment: '',
    creatTime: '',
    finishTime: ''
  };
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

  constructor(private router: Router,private activateInfo:ActivatedRoute,private http:HttpClient,private message: NzMessageService) { 
    activateInfo.queryParams.subscribe(queryParams => {
      let type = queryParams['type'];
      let id = queryParams['id'];
      this.type = type; 
      this.id = id;
    })
  }

  ngOnInit(): void {
    this.onload();
  }

  //获取工作具体信息
  onload():void {
    let url:string = '';
     if (this.type == 1) {
       url = 'api/task/getInfo/'+this.id;
     } else if (this.type == 2) {
       url = 'api/work/getInfo/'+this.id;
     }
     this.http.post(url,{headers:this.headers}).subscribe((res:any) => {
       if (res) {
          this.data = res;
       }
     })
  }

  back():void {
    this.router.navigate(['/work'],{
      queryParams:{
        type:this.type
      }
    })
  }

}
