import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute,Params} from '@angular/router';
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

@Component({
  selector: 'app-my-question',
  templateUrl: './my-question.component.html',
  styleUrls: ['./my-question.component.css']
})
export class MyQuestionComponent implements OnInit {

  public user:any;
  public loading = false;
  public data:ItemData [] = [];

  constructor(private activateInfo:ActivatedRoute,private router: Router,private http:HttpClient,private message: NzMessageService) { }

  ngOnInit(): void {
    this.user  =localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.onload();
  }

  onload():void {
    let url = 'api/question/findAll';
    this.http.get(url,{
      params:{
        comId:this.user.comId,
        founder:this.user.username
      }
    }).subscribe((res:any) => {
       if (res) {
         this.data = res;
         this.loading = false;
       }
    })
  } 

  check(id:number):void {
    this.router.navigate(['/article'],{
      queryParams:{
        id:id,
        type:3
      }
    })
  }

  

}
