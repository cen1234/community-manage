import { Component, OnInit } from '@angular/core';
import { EChartsOption, number } from 'echarts';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';
import { ThisReceiver } from '@angular/compiler';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
interface ItemData {
  id: number;
  roleId:number;
  userRealName: string;
  username: string;
  age: number;
  sex:string;
  password:string;
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
  public sysAdmin:number = 0;//系统管理员人数
  public comAdmin:number= 0;//社区管理员人数
  public staff:number= 0;//社区工作人员人数
  public volunteer:number= 0;//志愿者人数
  public ordinary:number= 0;//普通用户人数
  public roleData:any =[];//统计身份数组
  public genderDara:any =[];//统计性别数组
  public ageData:any= [];//统计年龄数组
  public isVisible:boolean = false;//新增|编辑用户弹窗是否出现
  public userMoadl:string = '新增用户';//新增|编辑用户弹窗标题
  public isOkLoading:boolean = false;///新增|编辑用户弹窗提交数据是否加载
  public inputValue: string = '';//搜索框输入值
  public UservalidateForm: UntypedFormGroup;//用户表格
  public passwordVisible = false;//密码输入框可视
  public selectType:string = '';//搜索框搜索类型
  public tabs:string[] = [
    "系统管理员",
    "社区管理员",
    "社区工作人员",
    "志愿者",
    "普通用户"
  ];//tabs标题
  public SelectedIndex:number = 0;//当前激活tab面板的序列号
  checked = false;
  indeterminate = false;
  listOfCurrentPageData:readonly  ItemData[] = [];
  listOfData: readonly ItemData[] = [];//表格数据
  setOfCheckedId = new Set<number>();//多选框选中集合
  pageIndex:number = 1;//当前页
  pageSize:number = 5;//每页展示多少数据
  total:number = 10;//表格数据总数
  userForm:any = {};//传递给后台的用户表单信息
  private headers = new HttpHeaders({'Content-Type': 'application/json'});//请求头
  fileList: NzUploadFile[] = [];
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
            data: [],
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
                data: [],
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
            data: [],
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
    this.UservalidateForm = this.fb.group({
      id:[''],
      roleId:[0,[Validators.required]],
      userRealName: ['', [Validators.required],[this.userRealnameAsyncValidator]],
      username: ['', [Validators.required],[this.userNameAsyncValidator]],
      age: ['', [Validators.required],[this.ageValidator]],
      sex:['',[Validators.required]],
      password:['',[Validators.required],[this.pwdValidator]],
      address:['',[Validators.required],[this.addressAsyncValidator]],
      phone:['',[Validators.required],[this.phoneAsyncValidator]],
    });
   }

  ngOnInit(): void {  
    // this.onload();
    this.findAll();
  }

  //取消批量删除
  cancel(): void {}

 //批量删除二次确认
  confirm(): void {
    let delList:any = [];
    this.setOfCheckedId.forEach(item => {
      delList.push(item);
    })
    let url = 'api/user/deleteSelect/'+delList;
    this.http.post(url,{Headers:this.headers}).subscribe(res => {
      if (res === true) {
         this.message.success('用户删除成功！', {
            nzDuration: 500
        });
        this.onload();
     }
    })
  }

  //分页获取用户数据
  onload(): void {
    let url = 'api/user/page';
    this.http.get(url,{params:{
      pageNum:this.pageIndex,
      pageSize:this.pageSize,
      search:this.inputValue,
      type:this.selectType,
      roleId:this.SelectedIndex+1
    }}).subscribe((res:any) => {
       this.listOfData = res.records;
       this.total = res.total;
    })
  }

  //获取全部用户数据
  findAll():void {
    let url = 'api/user/findAll';
    this.http.get(url).subscribe((res:any) => {
      let temp:any = [];
      let array = res.map((item:any) => {
          switch(item.roleId) {
            case 1:{
                this.sysAdmin++;
                temp.push(item);
                break;
            }
            case 2:{
                 this.comAdmin++;
                 break;
            }
            case 3:{
                 this.staff++;
                 break;
            }
            case 4:{
                 this.volunteer++;
                 break;
            }
            case 5:{
                 this.ordinary++;
                 break;
            }
          }
          return temp;
      })
      this.statisticalRole();
      this.statisticalAge(res);
      this.statisticalGender(res);
      this.listOfData = temp;
      this.total = temp.length;
    })
  }

  //新增用户
  add():void {
    this.UservalidateForm.reset();
    for (const key in this.UservalidateForm.controls) {
      if (this.UservalidateForm.controls.hasOwnProperty(key)) {
        this.UservalidateForm.controls[key].markAsPristine();
        this.UservalidateForm.controls[key].updateValueAndValidity();
      }
    }
    this.isVisible = true;
    this.userMoadl = '新增用户';
  }

  //编辑用户
  edit(data:any):void {
    this.isVisible = true;
    this.userMoadl = '编辑用户';
    //将要编辑的这一行用户数据绑定到表单上
    this.UservalidateForm.controls['id'].setValue(data.id);
    this.UservalidateForm.controls['roleId'].setValue(Number(data.roleId));
    this.UservalidateForm.controls['userRealName'].setValue(data.userRealName);
    this.UservalidateForm.controls['username'].setValue(data.username);
    this.UservalidateForm.controls['age'].setValue(data.age);
    this.UservalidateForm.controls['sex'].setValue(data.sex);
    this.UservalidateForm.controls['password'].setValue(data.password);
    this.UservalidateForm.controls['phone'].setValue(data.phone);
    this.UservalidateForm.controls['address'].setValue(data.address);
  }

  //删除单个用户
  Singleconfirm(id:number) {
    let url = 'api/user/delete/'+id;
    this.http.post(url,{headers:this.headers}).subscribe(res => {
       if (res === true) {
          this.message.success('用户删除成功！', {
            nzDuration: 500
          });
          this.onload();
       }
    })
  }

  //新增|编辑用户数据确认提交
  handleOk(): void {
    this.isOkLoading = true;
    if (this.UservalidateForm.valid) {
      let url = 'api/user';
      this.http.post(url,JSON.stringify(this.UservalidateForm.value),{headers:this.headers}).subscribe(res => {
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
        Object.values(this.UservalidateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
    }
  }

 
  //上传文件改变时的状态
  handleChange(info: NzUploadChangeParam): void {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      this.message.success(`${info.file.name} 上传成功`);
      this.onload();
    } else if (info.file.status === 'error') {
      this.message.error(`${info.file.name} 上传失败`);
    }
  }

  //导出用户
  export() {
     window.open('http://localhost:9000/user/export');
  }
 
  //新增|编辑用户取消
  handleCancel(): void {
    this.isVisible = false;
    this.UservalidateForm.reset();
    for (const key in this.UservalidateForm.controls) {
      if (this.UservalidateForm.controls.hasOwnProperty(key)) {
        this.UservalidateForm.controls[key].markAsPristine();
        this.UservalidateForm.controls[key].updateValueAndValidity();
      }
    }
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
  
  //tab页改变
  SelectedIndexChange(newSelectIndex:number) {
     this.SelectedIndex = newSelectIndex;
     this.onload();
  }
  //刷新选中状态
  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }
 
   //设置校验规则
   userRealnameAsyncValidator = (control: UntypedFormControl) =>
   new Observable((observer: Observer<ValidationErrors | null>) => {
     setTimeout(() => {
       if (!control.value) {
         observer.next({ error: true, required: true });
       } else if (control.value.length > 30) {
         observer.next({ error: true, maxlength: true });
       } else {
         observer.next(null);
       }
       observer.complete();
     }, 500);
   });
userNameAsyncValidator = (control: UntypedFormControl) =>
   new Observable((observer: Observer<ValidationErrors | null>) => {
     setTimeout(() => {
       if (!control.value) {
         observer.next({ error: true, required: true });
       } else if (control.value.length > 30) {
         observer.next({ error: true, maxlength: true });
       } else {
         observer.next(null);
       }
       observer.complete();
     }, 500);
   });
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
 pwdValidator = (control: UntypedFormControl) =>
     new Observable((observer: Observer<ValidationErrors | null>) => {
       setTimeout(() => {
         if (!control.value) {
           observer.next({ error: true, required: true });
         } else if (control.value.length < 6) {
           observer.next({ error: true, minlength: true });
         } else if (control.value.length > 15) {
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


  //统计身份
  statisticalRole():void {
      this.roleData = [
        {value:this.sysAdmin,name:'系统管理员'},
        {value:this.comAdmin,name:'社区管理员'},
        {value:this.staff,name:'社区工作人员'},
        {value:this.volunteer,name:'志愿者'},
        {value:this.ordinary,name:'普通用户'}
      ]
      this.roleOption.series[0].data = this.roleData;
  }
  
  //统计年龄
  statisticalAge(arr:any):void {
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

  //统计性别
  statisticalGender(arr:any):void {
    let map = new Map();
    let num:number;
    arr.forEach((item:any)=>{
       if(!map.has(item.sex)) {
           num = 1;
         map.set(item.sex,1)
       } else {
         num = map.get(item.sex) + 1;
         map.delete(item.sex);
         map.set(item.sex,num);
       }
    })
    for (const [key,value] of map) {
      let obj:any = {};
      obj.value = value;
      obj.name = key;
      this.genderDara.push(obj);
     }
     this.genderOption.series[0].data = this.genderDara;
  }






}


