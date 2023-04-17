import { Component, OnInit} from '@angular/core';
import { NzPlacementType } from 'ng-zorro-antd/dropdown';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
  public user_img :string ='';
  position:NzPlacementType = 'bottomCenter';


  constructor(private router: Router,private message: NzMessageService) { }

  ngOnInit(): void {
    let user:any = localStorage.getItem("user");
    if (!user) {
      this.router.navigate(['/no-login']);
    } else {
      user = JSON.parse(user);
      this.user_img = 'api/file/' + user.userImg;
    }
  }
   
  //登出
  exit() {
    this.router.navigate(['/login']);
    localStorage.clear();
    this.message.success('用户登出成功！', {
      nzDuration: 500
    });
  }
  

}
