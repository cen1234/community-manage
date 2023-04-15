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
  age: number;
  sex: string;
  phone:string;
  address: string;
  belongDepartment:string;
  available:string;
  score:number;
  workCount:number;
  skill:string;
}

@Component({
  selector: 'app-staff-info',
  templateUrl: './staff-info.component.html',
  styleUrls: ['./staff-info.component.css']
})
export class StaffInfoComponent implements OnInit {

  public isCollapsed:boolean = false;//侧边栏是否折叠
  public departmentData:any =[];//统计所在部门数组
  public genderData:any =[];//统计性别数组
  public ageData:any= [];//统计年龄数组
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
  communityId:number = 1;//存储社区id
  public isVisible:boolean = false;//弹窗是否出现
  public isOkLoading:boolean = false;//弹窗提交数据是否加载
  public modalTitle:string = '新增社区员工';//弹窗标题
  public validateForm: UntypedFormGroup;//表单
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头
   //年龄统计图
   ageOption = {
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
            text: '职员年龄统计',
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
                name: '职员年龄信息',
                type: 'pie',
                radius: '60%',
                roseType: 'area',//是否表现为南丁格尔图
                data: this.ageData,
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
  genderOption = {
    color:[ '#ecedf6', '#f2e7ff','#a4d6fe'],
    title: {
        text: '职员性别统计',
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
            name: '职员性别信息',
            type: 'pie',
            radius: '50%',
            data: this.genderData,
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
   //所在部门统计图
   departmentOption = {
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
            text: '所在部门统计',
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
                name: '所在部门信息',
                type: 'pie',
                radius: '60%',
                roseType: 'area',//是否表现为南丁格尔图
                data: this.departmentData,
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
      comId: [0],
      name: ['',[Validators.required]],
      age: [0,[Validators.required],[this.ageValidator]],
      sex: ['',[Validators.required]],
      phone:['',[Validators.required],[this.phoneAsyncValidator]],
      address:['',[Validators.required],[this.addressAsyncValidator]],
      belongCommunity:[''],
      belongDepartment: ['',[Validators.required]],
      skill: ['',[Validators.max(300)]]
    });
  }
  
  ngOnInit(): void {
     //获取社区管理员所在社区的id
     let user:any = localStorage.getItem('user');
     user = JSON.parse(user);
     this.communityId = user.comId;
     this.findAll();
     this.onload();
  }

   //分页获取数据
   onload(): void {
    let url = 'api/staff/page';
    this.http.get(url,{
      params:{
        pageNum:this.pageIndex,
        pageSize:this.pageSize,
        search:this.inputValue,
        type:this.selectType,
        comId:this.communityId,
      }}).subscribe((res:any) => {
       this.listOfData = res.records;
       this.total = res.total;
    })
  }
   
  //获取本社区所有社区工作人员
  findAll():void {
    let url = 'api/staff/findAll';
    this.http.get(url,{params:{
      comId:this.communityId
    }}).subscribe((res:any) => {
      this.statisticalGrnder(res);
      this.statisticalAge(res);
      this.statisticalRole(res);
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
      let url = 'api/community/getName';
      this.http.get(url,{
        params:{
          comId:this.communityId
        }
      }).subscribe((res:any) => {
        if (res) {
          this.isVisible = true;
          this.modalTitle = '新增社区员工'; 
          this.validateForm.controls['comId'].setValue(this.communityId);   
          this.validateForm.controls['belongCommunity'].setValue(res.name);
        }
      })
    

    }

      //编辑
  edit(data:any):void {
    this.isVisible = true;
    this.modalTitle = '编辑用户';
        this.validateForm.controls['id'].setValue(data.id);
        this.validateForm.controls['comId'].setValue(Number(data.comId));
        this.validateForm.controls['name'].setValue(data.name);
        this.validateForm.controls['age'].setValue(Number(data.age));
        this.validateForm.controls['sex'].setValue(data.sex);
        this.validateForm.controls['phone'].setValue(Number(data.phone));
        this.validateForm.controls['address'].setValue(data.address);
        this.validateForm.controls['belongCommunity'].setValue(data.belongCommunity);
        this.validateForm.controls['belongDepartment'].setValue(data.belongDepartment);
        this.validateForm.controls['skill'].setValue(Number(data.skill));   
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
      let url = 'api/staff';
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
  

    //删除单个
    Singleconfirm(id:number) {
      let url = 'api/staff/delete/'+id;
      this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('社区工作人员删除成功！', {
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
       let url = 'api/staff/deleteSelect/'+delList;
       this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('社区工作人员删除成功！', {
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
          this.onload();
        } else if (info.file.status === 'error') {
          this.message.error(`${info.file.name} 上传失败`);
        }
      }

    //导出社区
    export() {
      window.open('http://localhost:9000/staff/export/'+this.communityId);
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

   //统计性别
   statisticalGrnder(arr: any) {
    let map = new Map();
    let num:number;
    arr.forEach((item:any)=>{
       if(!map.has(item.age)) {
           num = 1;
         map.set(item.sex,1)
       } else {
        num = map.get(item.sex) + 1;
         map.delete(item.sex);
         map.set(item.sex,num+1);
       }
    })
    for (const [key,value] of map) {
      let obj:any = {};
      obj.value = value;
      obj.name = key;
      this.genderData.push(obj);
     }
     this.genderOption.series[0].data = this.genderData;
  }

    //统计年龄
    statisticalAge(arr: any) {
      let map = new Map();
      let num:number;
      arr.forEach((item:any)=>{
        if(!map.has(item.age)) {
            num = 1;
          map.set(item.age,1)
        } else {
          num = map.get(item.age) + 1;
          map.delete(item.age);
          map.set(item.age,num+1);
        }
      })
      for (const [key,value] of map) {
        let obj:any = {};
        obj.value = value;
        obj.name = key;
        this.ageData.push(obj);
      }
      this.ageOption.series[0].data = this.ageData;
   }

   //统计不同部门
   statisticalRole(arr: any) {
      let map = new Map();
      let num:number;
      arr.forEach((item:any)=>{
        if(!map.has(item.belongDepartment)) {
            num = 1;
          map.set(item.belongDepartment,1)
        } else {
          num = map.get(item.belongDepartment) + 1;
          map.delete(item.belongDepartment);
          map.set(item.belongDepartment,num+1);
        }
      })
      for (const [key,value] of map) {
        let obj:any = {};
        obj.value = value;
        obj.name = key;
        this.departmentData.push(obj);
      }
      this.departmentOption.series[0].data = this.departmentData;
  }
 
  //设置校验规则
  ageValidator = (control: UntypedFormControl) =>
  new Observable((observer: Observer<ValidationErrors | null>) => {
    setTimeout(() => {
      if (!control.value) {
        observer.next({ error: true, required: true });
      } else if (control.value < 1) {
        observer.next({ error: true, minlength: true });
      } else if (control.value> 120) {
        observer.next({ error: true, maxlength: true });
      } else {
        observer.next(null);
      }
      observer.complete();
    }, 500);    
});  
addressAsyncValidator = (control: UntypedFormControl) =>
   new Observable((observer: Observer<ValidationErrors | null>) => {
     setTimeout(() => {
       if (!control.value) {
         observer.next({ error: true, required: true });
       } else if (control.value.length > 300) {
         observer.next({ error: true, maxlength: true });
       } else {
         observer.next(null);
       }
       observer.complete();
     }, 500);
});
phoneAsyncValidator = (control: UntypedFormControl) =>
   new Observable((observer: Observer<ValidationErrors | null>) => {
     setTimeout(() => {
       if (control.value == '') {
         observer.next({ error: true, required: true });
       } else if (control.value.match(/^1(3|4|5|6|7|8|9)\d{9}$/) === null) {
         observer.next({ error: true, errorPhone: true });
       } else {
         observer.next(null);
       }
       observer.complete();
     }, 500);
   }); 



}
