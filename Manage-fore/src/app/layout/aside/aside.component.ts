import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {

  //获取从父组件中传过来的值
  @Input() isCollapsed:any;


  constructor() { }

  ngOnInit(): void {
    
  }
 

}
