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
  province:string;
  city: string;
  area: string;
  name:string;
  address: string;
}
@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public provinceData:any =[];//省数组
  public cityDara:any =[];//市数组
  public areaData:any= [];//区数组
  public inputValue: string = '';//搜索框输入值
  public selectType:string = 'name';//搜索框搜索类型
  checked = false;
  indeterminate = false;
  listOfCurrentPageData:readonly  ItemData[] = [];
  listOfData: readonly ItemData[] = [];//表格数据
  setOfCheckedId = new Set<number>();//多选框选中集合
  pageIndex:number = 1;//当前页
  pageSize:number = 5;//每页展示多少数据
  total:number = 10;//表格数据总数
  public isVisible:boolean = false;//新增|编辑弹窗是否出现
  public Moadl:string = '新增社区';//新增|编辑弹窗标题
  public isOkLoading:boolean = false;///新增|编辑弹窗提交数据是否加载
  public validateForm: UntypedFormGroup;//社区表格
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头
  //省份统计图
  provinceOption = {
    color:[ '#d8d6eb',
            '#cface6',
            "#b988c9",
            '#f9c5d9',
            '#ca167b',
            "#aa1f65",
            '#8e1959',
            '#ebc4dc',
            "#da9fc8",
            '#c66fad',
            '#ab4299',
            "#a63795",
        ],
        title: {
            text: '所在省份统计',
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
                name: '所在省份信息',
                type: 'pie',
                radius: '60%',
                roseType: 'area',//是否表现为南丁格尔图
                data: this.provinceData,
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
   //市统计图
   cityOption = {
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
            text: '所在市统计',
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
                name: '所在市信息',
                type: 'pie',
                radius: '60%',
                roseType: 'area',//是否表现为南丁格尔图
                data: this.cityDara,
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
  //区统计图
  areaOption = {
    color:[ '#caadd5',
            '#b38fc2',
            '#956caf',
            "#7f55a4",
            '#672e93',
            '#552a8b',
            "#572b84",
            '#452260',
            '#baaed2',
            "#9e91c4",
            '#8877b6',
            '#aa9ccb',
            "#9278b9",
        ],
        title: {
            text: '所在区统计',
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
                name: '所在区信息',
                type: 'pie',
                radius: '60%',
                roseType: 'area',//是否表现为南丁格尔图
                data: this.areaData,
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
      comId:[0],
      name: ['', [Validators.required]],
      province: ['', [Validators.required]],
      city: ['', [Validators.required]],
      area: ['', [Validators.required]],
      address:['',[Validators.required]]
    
    });
  }

  ngOnInit(): void {
    this.onload();
    this.findAll();
  }

  //获取全部社区数据
  findAll():void {
    let url = 'api/community/findAll';
    this.http.get(url).subscribe((res:any) => {
      this.statisticalProvince(res);
      this.statisticalCity(res);
      this.statisticalArea(res);
    })
  }
  
  
   //分页获取社区数据
   onload(): void {
    let url = 'api/community/page';
    this.http.get(url,{
      params:{
        pageNum:this.pageIndex,
        pageSize:this.pageSize,
        search:this.inputValue,
        type:this.selectType,
      }}).subscribe((res:any) => {
       this.listOfData = res.records;
       this.total = res.total;
    })
  }
   
  
  //新增社区
    add():void {
      this.validateForm.reset();
      for (const key in this.validateForm.controls) {
        if (this.validateForm.controls.hasOwnProperty(key)) {
          this.validateForm.controls[key].markAsPristine();
          this.validateForm.controls[key].updateValueAndValidity();
        }
      }
      this.isVisible = true;
      this.Moadl = '新增社区';
      this.validateForm.controls['comId'].setValue(Math.round( Math.random()*10000));
    }

      //编辑社区
  edit(data:any):void {
    this.isVisible = true;
    this.Moadl = '编辑社区';
    //将要编辑的这一行用户数据绑定到表单上
    this.validateForm.controls['id'].setValue(data.id);
    this.validateForm.controls['name'].setValue(data.name);
    this.validateForm.controls['province'].setValue(data.province);
    this.validateForm.controls['city'].setValue(data.city);
    this.validateForm.controls['area'].setValue(data.area);
    this.validateForm.controls['address'].setValue(data.address);
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
    if (this.validateForm.valid) {
      let url = 'api/community';
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

    //删除单个社区
    Singleconfirm(id:number) {
      let url = 'api/community/delete/'+id;
      this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('社区删除成功！', {
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
       let url = 'api/community/deleteSelect/'+delList;
       this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('社区删除成功！', {
               nzDuration: 500
           });
           this.onload();
        }
       })
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
      window.open('http://localhost:9000/community/export');
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

  //统计省
  statisticalProvince(arr: any) {
    let map = new Map();
    let num:number;
    arr.forEach((item:any)=>{
       if(!map.has(item.province)) {
           num = 1;
         map.set(item.province,1)
       } else {
        num = map.get(item.province) + 1;
         map.delete(item.province);
         map.set(item.province,num+1);
       }
    })
    for (const [key,value] of map) {
      let obj:any = {};
      obj.value = value;
      obj.name = key;
      this.provinceData.push(obj);
     }
     this.provinceOption.series[0].data = this.provinceData;
  }

  //统计市
  statisticalCity(arr: any) {
    let map = new Map();
    let num:number;
    arr.forEach((item:any)=>{
       if(!map.has(item.city)) {
           num = 1;
         map.set(item.city,1)
       } else {
        num = map.get(item.city) + 1;
         map.delete(item.city);
         map.set(item.city,num+1);
       }
    })
    for (const [key,value] of map) {
      let obj:any = {};
      obj.value = value;
      obj.name = key;
      this.cityDara.push(obj);
     }
     this.cityOption.series[0].data = this.cityDara;
  }

  //统计区
  statisticalArea(arr: any) {
    let map = new Map();
    let num:number;
    arr.forEach((item:any)=>{
       if(!map.has(item.area)) {
           num = 1;
         map.set(item.area,1)
       } else {
        num = map.get(item.area) + 1;
         map.delete(item.area);
         map.set(item.area,num+1);
       }
    })
    for (const [key,value] of map) {
      let obj:any = {};
      obj.value = value;
      obj.name = key;
      this.areaData.push(obj);
     }
     this.areaOption.series[0].data = this.areaData;
    
  }
 

}
