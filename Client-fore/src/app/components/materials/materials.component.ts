import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute,Params} from '@angular/router';
import { count, map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
interface ItemData {
  id: number;
  comId:number;
  name:string;
  count:number;
  belongCommunity:string;
  available: string;
  borrowedCount:number;
  isExpand:boolean;
}

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {

  public user:any;
  public data:ItemData [] = [];
  public communityId:number = 1;//社区Id

   constructor(private activateInfo:ActivatedRoute,private router: Router,private http:HttpClient,private message: NzMessageService) { }

  ngOnInit(): void {
    this.user  =localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.communityId = this.user.comId;
    this.onload();
  }
 
  //获取当前登录用户所在社区全部的物资
  onload():void {
    let url = 'api/materials/findAll';
    this.http.get(url,{
      params:{
        comId:this.communityId
      }
    }
    ).subscribe((res:any) => {
       if (res) {
         this.data = res;
       }
    })

  }
  
  //借用
  check(id:number):void {
    this.router.navigate(['/borrow'],{
      queryParams:{
        id:id
      }
    })
  }

}
