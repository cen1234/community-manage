import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Observer } from 'rxjs';
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

 //用户属性
  public user_name:string = '';//用户名
  public user_realname:string = '';//用户真实姓名
  public user_phone:string = '';//用户电话号码
  public user_age:number|string = 0;//用户年龄
  public user_sex:string = '';//用户姓名
  public user_address:string = '';//用户地址
  public user_img:string = '';//用户图像
  public user_role:string = '';//用户身份
  public user_password:string = '';//用户密码
  //属性
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public isVisible:boolean = false;//新增|编辑用户弹窗是否出现
  public userMoadl:string = '新增用户';//新增|编辑用户弹窗标题
  public isOkLoading:boolean = false;///新增|编辑用户弹窗提交数据是否加载
  public inputValue: string | null = null;//搜索框输入值
  public UservalidateForm: UntypedFormGroup;//用户表格
  public passwordVisible = false;//密码输入框可视
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
 
  constructor(private fb: UntypedFormBuilder) {
    this.UservalidateForm = this.fb.group({
      user_realname: ['', [Validators.required],[this.userRealnameAsyncValidator]],
      user_name: ['', [Validators.required],[this.userNameAsyncValidator]],
      user_age: ['', [Validators.required],[this.ageValidator]],
      user_sex:['',[Validators.required]],
      user_password:['',[Validators.required],[this.pwdValidator]],
      user_address:['',[Validators.required],[this.addressAsyncValidator]],
      user_phone:['',[Validators.required],[this.phoneAsyncValidator]]
    });
   }

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
    console.log(this.setOfCheckedId)
  }

  //新增用户
  add():void {
    this.isVisible = true;
  }

  //编辑用户
  edit(data:any):void {
    this.isVisible = true;
    this.user_realname = data.userRealName;
    this.user_name = data.userName;
    this.user_age = data.age;
    this.user_sex = data.sex;
    this.user_phone = data.phone;
    this.user_address = data.address;
    
  }

  //删除用户
  Singleconfirm(id:number) {
     console.log(id)
  }

  //新增|编辑用户数据确认提交
  handleOk(): void {
    this.isOkLoading = true;
    if (this.UservalidateForm.valid) {

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
  






}
