import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
 
  //属性
  public isCollapsed:boolean = false;//侧边栏是否折叠
  constructor() { }

  ngOnInit(): void {
  }

  //折叠和展开侧边栏
  fold(): void {
    this.isCollapsed = !this.isCollapsed;
    console.log(this.isCollapsed)
  }

}
