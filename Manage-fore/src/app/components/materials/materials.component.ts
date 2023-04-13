import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { EChartsOption, number } from 'echarts';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload';

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
interface childDate {
  id: number;
  materialsId: number;
  userName: string;
  materialsName: string;
  count: number;
  back:string;
  phone:string;
  address:string;
}
@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrls: ['./materials.component.css']
})
export class MaterialsComponent implements OnInit {
  
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public speciesXDate:any =[];//物资名数组
  public speciesAllDate:any =[];//物资总数量数组
  public speciesBorrowDate:any =[];//被借用物资数量数组
  public availableDate:any =[];//可用物资数组
  public inputValue: string = '';//搜索框输入值
  public selectType:string = '';//搜索框搜索类型
  checked = false;
  indeterminate = false;
  listOfCurrentPageData:readonly  ItemData[] = [];
  listOfData: readonly ItemData[] = [];//物资表格数据
  childListData: childDate[] = [];//物资-借用人表格数据
  setOfCheckedId = new Set<number>();//多选框选中集合
  pageIndex:number = 1;//当前页
  pageSize:number = 5;//每页展示多少数据
  total:number = 10;//物资表格数据总数
  public isVisible:boolean = false;//新增|编辑弹窗是否出现
  public UMisVisible:boolean = false;//物资借用弹窗是否出现
  public Moadl:string = '新增物资';//新增|编辑弹窗标题
  public isOkLoading:boolean = false;///新增|编辑弹窗提交数据是否加载
  public validateForm: UntypedFormGroup;//社区表格
  public communityId:number = 1;//社区Id
  public communityName:string = '';//社区名
  editCache: { [key: string]: { edit: boolean; data: childDate } } = {};
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
            data: this.speciesXDate
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
            data: this.speciesXDate
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
            data: this.speciesBorrowDate
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
            data: this.speciesAllDate,
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
                data: this.availableDate,
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
    this.validateForm = this.fb.group({
      id:[''],
      comId:[1],
      name: ['', [Validators.required]],
      count: [0, [Validators.required],[this.countAsyncValidator]],
      belongCommunity: [''],
      available: ['', [Validators.required]],
      borrowedCount:[0,[Validators.required],[this.borrowedCountAsyncValidator]]
    });
   }

  ngOnInit(): void {
    //获取社区管理员所在社区的id
    let user:any = localStorage.getItem('user');
    user = JSON.parse(user);
    this.communityId = user.comId;

    this.onload();
    this.findAll();
  }

   //获取全部物资数据
   findAll():void {
    let url = 'api/materials/findAll';
    this.http.get(url).subscribe((res:any) => {
      this.statisticalSpecies(res);
      this.statisticalAvailable(res);
    })
  }
 
  
  //分页获取数据
  onload(): void {
    let url = 'api/materials/page';
    this.http.get(url,{
      params:{
        pageNum:this.pageIndex,
        pageSize:this.pageSize,
        search:this.inputValue,
        type:this.selectType,
      }}).subscribe((res:any) => {
        res.records.forEach((item:any) => {
          item.isExpand = item.isExpand === 'true'?true:false;
        })
       this.listOfData = res.records;
       this.total = res.total;
    })
  }
   
  
  //新增
    add():void {
      this.validateForm.reset();
      for (const key in this.validateForm.controls) {
        if (this.validateForm.controls.hasOwnProperty(key)) {
          this.validateForm.controls[key].markAsPristine();
          this.validateForm.controls[key].updateValueAndValidity();
        }
      }
      this.isVisible = true;
      this.Moadl = '新增物资';
      this.findName();
      setTimeout(() => {
        this.validateForm.controls['comId'].setValue(this.communityId);
        this.validateForm.controls['belongCommunity'].setValue(this.communityName);
      },1000)
    }

      //编辑
  edit(data:any):void {
    this.isVisible = true;
    this.Moadl = '编辑物资';
    //将要编辑的这一行用户数据绑定到表单上
    this.validateForm.controls['id'].setValue(data.id);
    this.validateForm.controls['name'].setValue(data.name);
    this.validateForm.controls['count'].setValue(data.count);
    this.validateForm.controls['available'].setValue(data.available);
    this.validateForm.controls['borrowedCount'].setValue(data.borrowedCount);
  }

  //根据comId获取小区名字
   findName():void {
      let url = 'api/community/getName';
      this.http.get(url,{params:{
        comId: this.communityId
      }}).subscribe((res:any) => {
        console.log(res)
         if (res) {
           this.communityName = res.name;
         }
      })
   }

   //新增|编辑取消
   handleCancel(): void {
    this.isVisible = false;
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
  }

//新增|编辑数据确认提交
handleOk(): void {
  this.isOkLoading = true;
  console.log(0)
  if (this.validateForm.valid) {
    console.log(1)
    let url = 'api/materials';
    this.http.post(url,JSON.stringify(this.validateForm.value),{headers:this.headers}).subscribe(res => {
      if( res === true) {
        this.message.success('用户操作成功！', {
          nzDuration: 500
        });
        this.onload();
      }
    },err => {
      this.message.error('用户操作失败！', {
        nzDuration: 500
      });
    })
    setTimeout(() => {
      this.isVisible = false;
      this.isOkLoading = false;
    }, 500);
  } else {
    console.log(2)
      this.isVisible = true;
      this.isOkLoading = false;
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
  }
}


    //删除单个
    Singleconfirm(id:number) {
      let url = 'api/materials/delete/'+id;
      this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('物资删除成功！', {
              nzDuration: 500
            });
            this.onload();
         }
      })
    }

    //取消批量删除
    cancel(): void {}

    //批量删除二次确认
     confirm(): void {
       let delList:any = [];
       this.setOfCheckedId.forEach(item => {
         delList.push(item);
       })
       let url = 'api/materials/deleteSelect/'+delList;
       this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('物资删除成功！', {
               nzDuration: 500
           });
           this.onload();
        }
       })
     }

     //查看借用
     getBorrow(id:number):void {
          let url = 'api/userMaterials/findBorrowed';
          this.http.get(url,{
            params:{
              materialsId:id
            }
          }).subscribe((res:any) => {
             this.childListData = res;
             this.UMisVisible = true;
             this.updateEditCache();
          })    
     }

    //查看借用关闭
    UMhandleOk(): void {
      this.UMisVisible = false;
    }
    UMhandleCancel():void {
      this.UMisVisible = false;
    }

    //开始编辑物资-借用人表格数据
    startEdit(id: number): void {
      this.editCache[id].edit = true;
    }

    //取消编辑物资-借用人表格数据
    cancelEdit(id: number): void {
      const index = this.childListData.findIndex(item => item.id === id);
      this.editCache[id] = {
        data: { ...this.childListData[index] },
        edit: false
      };
    }

    //保存编辑物资-借用人表格数据
    saveEdit(id: number): void {
      const index = this.childListData.findIndex(item => item.id === id);
      Object.assign(this.childListData[index], this.editCache[id].data);
      let url = 'api/userMaterials';
      this.http.post(url,JSON.stringify(this.childListData[index]),{headers:this.headers}).subscribe((res:any) => {
         if (res) {
            this.message.success('用户操作成功！', {
              nzDuration: 500
            });
            this.editCache[id].edit = false;
         }
      })
    }

    //更新编辑物资-借用人表格数据
    updateEditCache(): void {
      this.childListData.forEach(item => {
        this.editCache[item.id] = {
          edit: false,
          data: { ...item }
        };
      });
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

    //导出物资
    export() {
      window.open('http://localhost:9000/materials/export');
   }

   //当前页发生改变
  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  //页码改变
  nzPageIndexChange(newPageIndex:number):void{
      this.pageIndex = newPageIndex;
      this.onload();
  }

  //页大小改变
  nzPageSizeChange(newPageSize:number) {
    this.pageSize = newPageSize;
    this.onload();
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
  
  //统计物资种类数量
  statisticalAvailable(arr: any) {
    arr.forEach((item:any)=>{
      this.speciesXDate.push(item.name);
      this.speciesAllDate.push(item.count);
      this.speciesBorrowDate.push(item.borrowedCount);
    })
    this.speciesOption.xAxis[0].data = this.speciesXDate;
    this.speciesOption.xAxis[1].data = this.speciesXDate;
    this.speciesOption.series[0].data = this.speciesBorrowDate;
    this.speciesOption.series[1].data = this.speciesAllDate;
  }
 
  //统计可用物资种类及占比
  statisticalSpecies(arr: any) {
    let map = new Map();
    arr.forEach((item:any)=>{
      if (item.available === '可用') {
        map.set(item.name,item.count - item.borrowedCount);
      }
    })
    for (const [key,value] of map) {
      let obj:any = {};
      obj.value = value;
      obj.name = key;
      this.availableDate.push(obj);
     }
     this.availableOption.series[0].data = this.availableDate;
   }
   
   //物资总数量校验规则
   countAsyncValidator = (control: UntypedFormControl) =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        setTimeout(() => {
          if (control.value === null) {
            observer.next({ error: true, required: true });
          } else if (control.value < 0) {
            observer.next({ error: true, minlength: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        }, 500);    
  });  
 
  //物资借用总数量
  borrowedCountAsyncValidator = (control: UntypedFormControl) =>
      new Observable((observer: Observer<ValidationErrors | null>) => {
        setTimeout(() => {
          if (control.value === null) {
            observer.next({ error: true, required: true });
          } else if (control.value < 0) {
            observer.next({ error: true, minlength: true });
          } else {
            observer.next(null);
          }
          observer.complete();
        }, 500);    
});  



}
