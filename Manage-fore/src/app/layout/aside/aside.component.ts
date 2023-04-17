import { Component, OnInit,Input } from '@angular/core';
interface itemData {
  id:number;
  pid:number;
  name:string;
  description:string;
  path:string;
  icon:string;
  children:childData[];
}
interface childData {
  id:number;
  pid:number;
  name:string;
  description:string;
  path:string;
  icon:string;
}

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  //获取从父组件中传过来的值
  @Input() isCollapsed:any;
  public menus:itemData [] = [];//存储从缓存中获取的菜单

  constructor() { }

  ngOnInit(): void {
    let user:any = localStorage.getItem('user');
     user = JSON.parse(user);
     this.menus = user.menus;
  }
 

}
