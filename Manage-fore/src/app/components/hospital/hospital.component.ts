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
  belongCommunity: string;
  phone:string;
  address: string;
  remarks:string;
}
interface DoctorData {
  id:number;
  hospitalId:number;
  name:string;
  age:number;
  sex:string;
  phone:string;
  belongDepartment:string;
  remarks:string;
}
@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {
  
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public inputValue: string = '';//搜索框输入值
  checked = false;//所属医院
  checkedDoctor = false;
  indeterminate = false;//所属医院
  indeterminateDoctor = false;
  listOfCurrentPageData:readonly  ItemData[] = [];//所属医院
  listOfCurrentPageDataDoctor:readonly  DoctorData[] = [];
  listOfData: readonly ItemData[] = [];//所属医院表格数据
  listOfDataDoctor: readonly DoctorData[] = [];
  setOfCheckedId = new Set<number>();//所属医院多选框选中集合
  setOfCheckedIdDoctor = new Set<number>();
  pageIndex:number = 1;//所属医院当前页
  pageIndexDoctor:number = 1;
  pageSize:number = 5;//所属医院每页展示多少数据
  pageSizeDoctor:number = 5;
  total:number = 10;//所属医院表格数据总数
  totalDoctor:number = 10;
  communityId:number = 1;//存储社区id
  hospitalId:number = 0;//存储当前正在查看医生的医院id
  communityName:string = '';//存储当前登录社区管理员所在社区名
  isShow:boolean = false;//是否显示医生表格
  expandSet = new Set<number>();
  public isVisible:boolean = false;//新增|编辑医院弹窗是否出现
  public isOkLoading:boolean = false;//新增|编辑医院弹窗提交数据是否加载
  public validateForm: UntypedFormGroup;//新增|编辑医院表单
  public modal:string = '新增社区医院';//新增|编辑医院弹窗标题
  public isVisibleDoctor:boolean = false;//编辑医生弹窗是否出现
  public isOkLoadingDoctor:boolean = false;//编辑医生弹窗提交数据是否加载
  public validateFormDoctor: UntypedFormGroup;//编辑医生医院表单

  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头

   constructor(private fb: UntypedFormBuilder,private http:HttpClient,private message: NzMessageService) { 
    this.validateForm = this.fb.group({
      id:[''],
      comId:[1],
      name: ['',[Validators.required]],
      belongCommunity: [''],
      phone:['',[Validators.required],[this.phoneAsyncValidator]],
      address:['',[Validators.required],[this.addressAsyncValidator]],
      remarks:['']
    });
    this.validateFormDoctor = this.fb.group({
      id:[''],
      hospitalId:[1],
      name: ['',[Validators.required]],
      age: [0,[Validators.required],[this.ageValidator]],
      sex: ['',[Validators.required]],
      phone:['',[Validators.required],[this.phoneAsyncValidator]],
      belongDepartment:[''],
      remarks:['']
    });
  }

  ngOnInit(): void {
    //获取社区管理员所在社区的id
    let user:any = localStorage.getItem('user');
    user = JSON.parse(user);
    this.communityId = user.comId;
    this.onload();
  }
  
  //分页获取本社区所有医院
  onload(): void {
    let url = 'api/hospital/pageHospital';
    this.http.get(url,{
      params:{
        pageNum:this.pageIndex,
        pageSize:this.pageSize,
        comId:this.communityId, 
        search:this.inputValue    
      }}).subscribe((res:any) => {
       this.listOfData = res.records;
       this.total = res.total;
    })
  }

  //获取本社区所有医院


  //新增医院
  add():void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(key)) {
        this.validateForm.controls[key].markAsPristine();
        this.validateForm.controls[key].updateValueAndValidity();
      }
    }
    this.isVisible = true;
    this.modal = '新增医院';
    this.validateForm.controls['comId'].setValue(this.communityId);
    this.validateForm.controls['belongCommunity'].setValue(this.communityName);
  }

  //编辑医院
  edit(data:ItemData) {
    this.isVisible = true;
    this.modal = '编辑医院';
    //将要编辑的这一行用户数据绑定到表单上
    this.validateForm.controls['id'].setValue(data.id);
    this.validateForm.controls['comId'].setValue(Number(data.comId));
    this.validateForm.controls['name'].setValue(data.name);
    this.validateForm.controls['belongCommunity'].setValue(this.communityName);
    this.validateForm.controls['phone'].setValue(Number(data.phone));
    this.validateForm.controls['address'].setValue(data.address);
    this.validateForm.controls['remarks'].setValue(data.remarks);
  }

  //新增|编辑取消
  handleCancel(): void {
    console.log(2222)
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
      let url = 'api/hospital';
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
  
  
    //医院删除单个
    Singleconfirm(id:number) {
      let url = 'api/hospital/deleteHospital/'+id;
      this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('社区医院删除成功！', {
              nzDuration: 500
            });
            this.onload();
         }
      })
    }

   //医院取消批量删除
   cancel(): void {}

   //医院批量删除二次确认
    confirm(): void {
      let delList:any = [];
      this.setOfCheckedId.forEach(item => {
        delList.push(item);
      })
      let url = 'api/hospital/deleteSelectHospital/'+delList;
      this.http.post(url,{headers:this.headers}).subscribe(res => {
        if (res === true) {
           this.message.success('社区医院删除成功！', {
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

      //导出社区医院
      export() {
        window.open('http://localhost:9000/hospital/exportHospital/'+this.communityId);
     }

    //查看医生
    check(id:number):void {
      let url = 'api/hospital/pageDoctor';
      this.http.get(url,{
        params:{
          pageNum:this.pageIndexDoctor,
          pageSize:this.pageSizeDoctor,
          hospitalId:id  
        }}).subscribe((res:any) => {
         this.listOfDataDoctor = res.records;
         this.totalDoctor = res.total;
         this.isShow = true;
         this.hospitalId = id;
      })
    }

    //关闭查看医生
    close():void {
      this.isShow = false;
    }

    //编辑医生
    editDoctor(data:DoctorData):void {
      this.isVisibleDoctor = true;
      //将要编辑的这一行用户数据绑定到表单上
      this.validateFormDoctor.controls['id'].setValue(data.id);
      this.validateFormDoctor.controls['hospitalId'].setValue(this.hospitalId);
      this.validateFormDoctor.controls['name'].setValue(data.name);
      this.validateFormDoctor.controls['age'].setValue(data.age);
      this.validateFormDoctor.controls['sex'].setValue(data.sex);
      this.validateFormDoctor.controls['phone'].setValue(Number(data.phone));
      this.validateFormDoctor.controls['belongDepartment'].setValue(data.belongDepartment);
      this.validateFormDoctor.controls['remarks'].setValue(data.remarks);
    }
    
    //编辑医生取消
    handleCancelDoctor(): void {
    this.isVisibleDoctor = false;
    this.validateFormDoctor.reset();
    for (const key in this.validateFormDoctor.controls) {
      if (this.validateFormDoctor.controls.hasOwnProperty(key)) {
        this.validateFormDoctor.controls[key].markAsPristine();
        this.validateFormDoctor.controls[key].updateValueAndValidity();
      }
    }
  }

  //新增|编辑数据确认提交
  handleOkDoctor(): void {
    this.isOkLoadingDoctor = true;
    if (this.validateFormDoctor.valid) {
      let url = 'api/hospital/editDoctor';
      this.http.post(url,JSON.stringify(this.validateFormDoctor.value),{headers:this.headers}).subscribe(res => {
        if( res === true) {
          this.message.success('用户操作成功！', {
            nzDuration: 500
          });
          this.check(this.hospitalId);
        }
      },err => {
        this.message.error('用户操作失败！', {
          nzDuration: 500
        });
      })
      setTimeout(() => {
        this.isVisibleDoctor = false;
        this.isOkLoadingDoctor = false;
      }, 500);
    } else {
        this.isVisibleDoctor = true;
        this.isOkLoadingDoctor = false;
        Object.values(this.validateFormDoctor.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
    }
  }


    //删除医生
    deleteDoctor(id:number):void {
      let url = 'api/hospital/deleteDoctor/'+id;
      this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('社生删除成功！', {
              nzDuration: 500
            });
            this.check(id);
         }
      })
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
  
    //所属医院当前页发生改变
  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  //所属医院页码改变
  nzPageIndexChange(newPageIndex:number):void{
      this.pageIndex = newPageIndex;
      this.onload();
  }

  //所属医院页大小改变
  nzPageSizeChange(newPageSize:number) {
    this.pageSize = newPageSize;
    this.onload();
  }

   //所属医院刷新选中状态
   refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  //所属医院更新选中集合
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

 //所属医院单个选中
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

 //所属医院全部选中
  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  //所属医生当前页发生改变
  onCurrentPageDataChangeDoctor($event: readonly DoctorData[]): void {
    this.listOfCurrentPageDataDoctor = $event;
    this.refreshCheckedStatusDoctor();
  }

  //所属医生页码改变
  nzPageIndexChangeDoctor(newPageIndex:number):void{
      this.pageIndexDoctor = newPageIndex;
      this.check(this.hospitalId);
  }

  //所属医生页大小改变
  nzPageSizeChangeDoctor(newPageSize:number) {
    this.pageSizeDoctor = newPageSize;
    this.check(this.hospitalId);
  }

   //所属医生刷新选中状态
   refreshCheckedStatusDoctor(): void {
    this.checkedDoctor = this.listOfCurrentPageDataDoctor.every(item => this.setOfCheckedIdDoctor.has(item.id));
    this.indeterminateDoctor = this.listOfCurrentPageDataDoctor.some(item => this.setOfCheckedIdDoctor.has(item.id)) && !this.checkedDoctor;
  }

  //所属医生更新选中集合
  updateCheckedSetDoctor(id: number, checkedDoctor: boolean): void {
    if (checkedDoctor) {
      this.setOfCheckedIdDoctor.add(id);
    } else {
      this.setOfCheckedIdDoctor.delete(id);
    }
  }

 //所属任务单个选中
  onItemCheckedDoctor(id: number, checkedDoctor: boolean): void {
    this.updateCheckedSetDoctor(id, checkedDoctor);
    this.refreshCheckedStatusDoctor();
  }

 //所属任务全部选中
  onAllCheckedDoctor(value: boolean): void {
    this.listOfCurrentPageDataDoctor.forEach(item => this.updateCheckedSetDoctor(item.id, value));
    this.refreshCheckedStatusDoctor();
  }

  //表格展开折叠
  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  //获取yyyy-MM-dd hh:mm:ss格式的时间字符串
  getCurrentTime():string {
    let currentTime:string = '';
    let time = new Date();
    let yyyy = time.getFullYear().toString();
    let MM = time.getMonth()+1;
    let dd = time.getDate();
    let hh = time.getHours();
    let mm = time.getMinutes();
    let ss = time.getSeconds();
    currentTime = yyyy + '-' + MM + '-'+ dd + ' '+ hh + ':' + mm + ':' + ss;
    return currentTime;  
  }

}
