import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { EChartsOption, number } from 'echarts';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';

interface ItemData {
  id: number;
  name:string;
  count:number;
  belongCommunity:string;
  available: string;
  borrowedPeople:string;
  borrowedCount:number
}
@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {
  
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public speciesXData:any =[];//物质名数组
  public speciesYData:any =[];//物质数量数组
  public availableDara:any =[];//可用物资数组
  public inputValue: string = '';//搜索框输入值
  public selectType:string = '物资名';//搜索框搜索类型
  checked = false;
  indeterminate = false;
  listOfCurrentPageData:readonly  ItemData[] = [];
  listOfData: readonly ItemData[] = [];//表格数据
  setOfCheckedId = new Set<number>();//多选框选中集合
  pageIndex:number = 1;//当前页
  pageSize:number = 5;//每页展示多少数据
  total:number = 10;//表格数据总数
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头
   //物质种类数量统计图
   speciesOption = {
       //表大小
        grid: {
          left: '2%',
          right: '6%',
          bottom: '5%',
          top:'20%',
          containLabel: true,
        },
        title: {
          text: '物质种类数量统计',
          left: 'leftcenter',
          textStyle:{
            color:'#919cab',
            fontSize:15
          }
       },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow',
        }
      },
      //不显示x轴
        xAxis: [
          { 
            name:'物资',
            nameTextStyle:{
                color:'#909399',
            },
            //是否为反向坐标
            inverse:false,
            //不显示轴线条
            axisLine:{
              show:true,
              lineStyle:{
                color:'#c1c5d0',
                width:1,
                type:'solid',
               }
            },
            //不显示刻度线
            axisTick:{
              show:false
            },
            //轴上的字
            axisLabel:{
            color:'#c1c7cf'
            },
            type: 'category',
            data: ['酒精', '灭火器', '梯子', '急救药品', '创可贴']
          },
          {
            inverse:false,
            //不显示轴线条
            axisLine:{
              show:false
            },
            //不显示刻度线
            axisTick:{
              show:false
            },
            //轴上的字
            axisLabel:{
            color:'white'
            },
            type: 'category',
            data: ['酒精', '灭火器', '梯子', '急救药品', '创可贴']
          }
        ],
        yAxis: {
          show:true,
          name:'数量(个)',
          nameTextStyle:{
              color:'#909399',
          },
          axisLine:{
            show:true,
            lineStyle:{
              color:'#c1c5d0',
              width:1,
              type:'solid',
             }
          },
          splitLine:{
            show:true
          },
        },
        series: [
          {
            name: '已使用',
            type: 'bar',
            xAxisIndex:0,
            //柱子之间的距离
            barCategoryGap:50,
            //柱子的宽度
            barWidth:15,
            //设置柱子圆角,颜色
            itemStyle:{
                barBorderRadius:2,
            },   
            data: [20, 30, 29, 10, 13]
          },
          {
            name: '总数',
            type: 'bar',
            xAxisIndex:1,
            barCategoryGap:50,
            barWidth:25,
            itemStyle:{
              barBorderRadius:2,
              color:'rgba(145, 204, 117, 0.2)',
              borderWith:3
            },
            data: [100, 100, 100, 100, 100],
          }
        ]
  }
  //可用物资统计图
  availableOption = {
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
            text: '可用物资统计',
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
                name: '可用物资信息',
                type: 'pie',
                radius: '60%',
                roseType: 'area',//是否表现为南丁格尔图
                data: [
                  {value:1,name:'灭火器'},
                  {value:1,name:'酒精'},
                  {value:1,name:'梯子'}
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
  constructor(private fb: UntypedFormBuilder,private http:HttpClient,private message: NzMessageService) {

   }

  ngOnInit(): void {
    this.listOfData = [
      {
        id: 1,
        name:'酒精',
        count:100,
        belongCommunity:'西柚小区',
        available: `可用`,
        borrowedPeople: `嘻嘻`,
        borrowedCount: 10
      },{
        id: 2,
        name:'灭火器',
        count:100,
        belongCommunity:'西柚小区',
        available: `可用`,
        borrowedPeople: `嘻嘻`,
        borrowedCount: 30
      },{
        id: 3,
        name:'梯子',
        count:100,
        belongCommunity:'西柚小区',
        available: `可用`,
        borrowedPeople: `嘻嘻`,
        borrowedCount: 29
      }]

  }
  
  //分页获取数据
  onload(): void {
    // let url = 'api/user/page';
    // this.http.get(url,{
    //   params:{
    //     pageNum:this.pageIndex,
    //     pageSize:this.pageSize,
    //     search:this.inputValue,
    //     type:this.selectType,
    //     roleId:this.SelectedIndex+1
    //   }}).subscribe((res:any) => {
    //    this.listOfData = res.records;
    //    this.total = res.total;
    // })
  }
   
  
  //新增
    add():void {
      // this.UservalidateForm.reset();
      // for (const key in this.UservalidateForm.controls) {
      //   if (this.UservalidateForm.controls.hasOwnProperty(key)) {
      //     this.UservalidateForm.controls[key].markAsPristine();
      //     this.UservalidateForm.controls[key].updateValueAndValidity();
      //   }
      // }
      // this.isVisible = true;
      // this.userMoadl = '新增用户';
    }

      //编辑
  edit(data:any):void {
    // this.isVisible = true;
    // this.userMoadl = '编辑用户';
    // //将要编辑的这一行用户数据绑定到表单上
    // this.UservalidateForm.controls['id'].setValue(data.id);
    // this.UservalidateForm.controls['roleId'].setValue(Number(data.roleId));
    // this.UservalidateForm.controls['userRealName'].setValue(data.userRealName);
    // this.UservalidateForm.controls['username'].setValue(data.username);
    // this.UservalidateForm.controls['age'].setValue(data.age);
    // this.UservalidateForm.controls['sex'].setValue(data.sex);
    // this.UservalidateForm.controls['password'].setValue(data.password);
    // this.UservalidateForm.controls['phone'].setValue(data.phone);
    // this.UservalidateForm.controls['address'].setValue(data.address);
  }

    //删除单个
    Singleconfirm(id:number) {
      // let url = 'api/user/delete/'+id;
      // this.http.post(url,{headers:this.headers}).subscribe(res => {
      //    if (res === true) {
      //       this.message.success('用户删除成功！', {
      //         nzDuration: 500
      //       });
      //       this.onload();
      //    }
      // })
    }

    //取消批量删除
    cancel(): void {}

    //批量删除二次确认
     confirm(): void {
      //  let delList:any = [];
      //  this.setOfCheckedId.forEach(item => {
      //    delList.push(item);
      //  })
      //  let url = 'api/user/deleteSelect/'+delList;
      //  this.http.post(url,{headers:this.headers}).subscribe(res => {
      //    if (res === true) {
      //       this.message.success('用户删除成功！', {
      //          nzDuration: 500
      //      });
          //  this.onload();
      //   }
      //  })
     }

       //上传文件改变时的状态
      handleChange(info: NzUploadChangeParam): void {
        if (info.file.status !== 'uploading') {
          // console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          this.message.success(`${info.file.name} 上传成功`);
          // this.onload();
        } else if (info.file.status === 'error') {
          this.message.error(`${info.file.name} 上传失败`);
        }
      }

    //导出社区
    export() {
      // window.open('http://localhost:9000/user/export');
   }

   //当前页发生改变
  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  //页码改变
  nzPageIndexChange(newPageIndex:number):void{
      this.pageIndex = newPageIndex;
      // this.onload();
  }

  //页大小改变
  nzPageSizeChange(newPageSize:number) {
    this.pageSize = newPageSize;
    // this.onload();
  }

   //刷新选中状态
   refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
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
}
