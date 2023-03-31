import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
interface ItemData {
  id: number;
  userRealName: string;
  userName: string;
  age: number;
  sex:string;
  phone:string;
  address: string;
}
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
 
  //属性
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public inputValue: string | null = null;//搜索框输入值
  checked = false;
  indeterminate = false;
  listOfCurrentPageData:readonly  ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();
  pageIndex:number = 1;//当前页
  pageSize:number = 5;//每页展示多少数据
  total:number = 10;//表格数据总数
  
  //身份统计图
  roleOption = {
    color:[ '#d1b7d7', "#998cc3","#9974b2","#7c78ab","#9a86ba"],
    title: {
        text: '用户角色统计',
        left: 'leftcenter',
        textStyle:{
          color:'#919cab',
          fontSize:15
        }
    },
    tooltip: {
        trigger: 'item',
        borderColor: "#e8e8e8",
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'horizontal',
        left: 'center',
        top:'bottom'
    },
    series: [
        {
            name: '用户角色信息',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '系统管理员' },
              { value: 735, name: '社区管理员' },
              { value: 580, name: '志愿者' },
              { value: 484, name: '社区工作人员' },
              { value: 300, name: '普通用户' }],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
  };
  //年龄统计图
  genderOption = {
    color:[ '#dfe3e5',
            '#afc3de',
            '#c3d5e6',
            "#87abda",
            '#698eb1',
            '#a5d5ff',
            "#d6ecff",
            '#a7b9d3',
            '#a4b9d9',
            "#a9bee3",
            '#bce0ff',
            '#6b92cb',
            "#43658c",
        ],
        title: {
            text: '用户年龄统计',
            left: 'leftcenter',
            textStyle:{
              color:'#919cab',
              fontSize:15
            }
        },
        tooltip: {
            trigger: 'item',
            borderColor: "#e8e8e8",
            formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            left: 'center',
            top:'bottom'
        },
        series: [
            {
                name: '用户年龄信息',
                type: 'pie',
                radius: '60%',
                roseType: 'area',//是否表现为南丁格尔图
                data: [
                  { value: 10, name: '20' },
                  { value: 7, name: '22' },
                  { value: 5, name: '21' },
                  { value: 4, name: '25' },
                  { value: 3, name: '26' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
  }
  //性别统计图
  ageOption = {
    color:[ '#ecedf6', '#f2e7ff','#a4d6fe'],
    title: {
        text: '用户性别统计',
        left: 'leftcenter',
        textStyle:{
          color:'#919cab',
          fontSize:15
        }
    },
    tooltip: {
        trigger: 'item',
        borderColor: "#e8e8e8",
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
        orient: 'horizontal',
        left: 'center',
        top:'bottom'
    },
    series: [
        {
            name: '用户性别信息',
            type: 'pie',
            radius: '50%',
            data: [
              {value:22,name:'女'},
              {value:20,name:'男'}
            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
    ]
  }
 
  constructor() { }

  ngOnInit(): void {
    this.listOfData = new Array(10).fill(0).map((_, index) => ({
      id: index,
      userRealName:`Edward King ${index}`,
      userName: `Edward King ${index}`,
      age: 32,
      sex:'女',
      phone:'12345678911',
      address: `London, Park Lane no. ${index}`
    }));   
  }

  //取消批量删除
  cancel(): void {
    
  }

 //批量删除二次确认
  confirm(): void {
    
  }

  //更新选中集合
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

 //单个选中
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

 //全部选中
  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }
 
  //当前页发生改变
  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }
  //刷新选中状态
  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
 
  






}
