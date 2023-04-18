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
  available:string;
  score:number;
  workCount:number;
  skill:string;
  formal:string;
}
interface TaskData {
  id:number;
  implementerId:number;
  comId:number;
  name:string;
  content:string;
  score:number;
  getscore:number;
  founder:string;
  implementer:string;
  comment:string;
  creatTime:string;
  finishTime:string;
}
@Component({
  selector: 'app-volunteer-info',
  templateUrl: './volunteer-info.component.html',
  styleUrls: ['./volunteer-info.component.css']
})
export class VolunteerInfoComponent implements OnInit {
 
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public availableData:any =[];//统计空闲数组
  public genderData:any =[];//统计性别数组
  public ageData:any= [];//统计年龄数组
  public inputValue: string = '';//搜索框输入值
  public selectType:string = 'name';//搜索框搜索类型
  checked = false;//所属志愿者
  checkedTask = false;
  indeterminate = false;//所属志愿者
  indeterminateTask = false;
  listOfCurrentPageData:readonly  ItemData[] = [];//所属志愿者
  listOfCurrentPageDataTask:readonly  TaskData[] = [];
  listOfData: readonly ItemData[] = [];//所属志愿者表格数据
  listOfDataTask: readonly TaskData[] = [];
  setOfCheckedId = new Set<number>();//所属志愿者多选框选中集合
  setOfCheckedIdTask = new Set<number>();
  pageIndex:number = 1;//所属志愿者当前页
  pageIndexTask:number = 1;
  pageSize:number = 5;
  pageSizeTask:number = 5;//所属志愿者每页展示多少数据
  total:number = 10;
  totalTask:number = 10;//所属志愿者表格数据总数
  communityId:number = 1;//存储社区id
  founder:string = '';//存储当前登录社区管理员姓名
  volunteerId:number = 0;//存储当前查看的志愿者id
  isShow:boolean = false;//是否显示任务表格
  expandSet = new Set<number>();
  public isVisible:boolean = false;//打分弹窗是否出现
  public isOkLoading:boolean = false;//打分弹窗提交数据是否加载
  public validateForm: UntypedFormGroup;//打分表单
  public isVisibleTask:boolean = false;//派发任务弹窗是否出现
  public isOkLoadingTask:boolean = false;//派发任务弹窗提交数据是否加载
  public validateFormTask: UntypedFormGroup;//派发任务表单
  tooltips = ['terrible', 'bad', 'normal', 'good', 'wonderful'];//打分提示
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
            text: '志愿者年龄统计',
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
                name: '志愿者年龄信息',
                type: 'pie',
                radius: '60%',
                roseType: 'area',//是否表现为南丁格尔图
                data:this.ageData,
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
        text: '志愿者性别统计',
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
            name: '志愿者性别信息',
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
   //志愿者空闲统计图
   availableOption = {
    color:[ '#caadd5',
            '#b38fc2',
            "#9278b9",
        ],
        title: {
            text: '志愿者空闲统计',
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
                name: '志愿者空闲信息',
                type: 'pie',
                radius: '60%',
                roseType: 'area',//是否表现为南丁格尔图
                data: this.availableData,
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
      getscore: [0],
      comment: ['']
    });
    this.validateFormTask = this.fb.group({
      id:[''],
      implementerId: [0],
      comId: [1],
      name:['',[Validators.required]],
      content: ['',[Validators.required]],
      score: [0,[Validators.required]],
      founder:[''],
      implementer: [''],
      creatTime: [''],
    });
  }

  ngOnInit(): void {
      //获取社区管理员所在社区的id
      let user:any = localStorage.getItem('user');
      user = JSON.parse(user);
      this.communityId = user.comId;
      this.founder = user.userRealName;
      this.findAll();
      this.onload();
  }
 
   //所属志愿者获取当前社区所有正式志愿者信息
   findAll():void {
    let url = 'api/volunteer/findAll';
    this.http.get(url,{params:{
      comId:this.communityId,
      formal:'正式'
    }}).subscribe((res:any) => {
      this.statisticalAge(res);
      this.statisticalGrnder(res);
      this.statisticalAvailable(res);
    })
   }
  
  
   //所属志愿者分页获取数据
   onload(): void {
    let url = 'api/volunteer/pageFormal';
    this.http.get(url,{
      params:{
        pageNum:this.pageIndex,
        pageSize:this.pageSize,
        search:this.inputValue,
        type:this.selectType,
        comId:this.communityId,
        formal:'正式'
      }}).subscribe((res:any) => {
       this.listOfData = res.records;
       this.total = res.total;
    })
  }
   

    //所属志愿者删除单个
    Singleconfirm(id:number) {
      let url = 'api/volunteer/delete/'+id;
      this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('志愿者删除成功！', {
              nzDuration: 500
            });
            this.onload();
         }
      })
    }

    //所属志愿者取消批量删除
    cancel(): void {}

    //所属志愿者批量删除二次确认
     confirm(): void {
       let delList:any = [];
       this.setOfCheckedId.forEach(item => {
         delList.push(item);
       })
       let url = 'api/volunteer/deleteSelect/'+delList;
       this.http.post(url,{headers:this.headers}).subscribe(res => {
         if (res === true) {
            this.message.success('志愿者删除成功！', {
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

    //导出正式志愿者
    export() {
      window.open('http://localhost:9000/volunteer/exportFormal/'+this.communityId);
   }

   //所属志愿者当前页发生改变
  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  //所属志愿者页码改变
  nzPageIndexChange(newPageIndex:number):void{
      this.pageIndex = newPageIndex;
      this.onload();
  }

  //所属志愿者页大小改变
  nzPageSizeChange(newPageSize:number) {
    this.pageSize = newPageSize;
    this.onload();
  }

   //所属志愿者刷新选中状态
   refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  //所属志愿者更新选中集合
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

 //所属志愿者单个选中
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

 //所属志愿者全部选中
  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
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

    //统计正式志愿者空闲与否
    statisticalAvailable(arr: any) {
      let map = new Map();
      let num:number;
      arr.forEach((item:any)=>{
         if(!map.has(item.available)) {
             num = 1;
           map.set(item.available,1)
         } else {
          num = map.get(item.available) + 1;
           map.delete(item.available);
           map.set(item.available,num+1);
         }
      })
      for (const [key,value] of map) {
        let obj:any = {};
        obj.value = value;
        obj.name = key;
        this.availableData.push(obj);
       }
       this.availableOption.series[0].data = this.availableData;
   }

   //打开创建任务弹窗
   createTask(data:any):void {
      this.isVisibleTask = true;
      this.validateFormTask.controls['implementerId'].setValue(data.id);
      this.validateFormTask.controls['comId'].setValue(this.communityId);
      this.validateFormTask.controls['founder'].setValue(this.founder);
      this.validateFormTask.controls['implementer'].setValue(data.name);
      this.validateFormTask.controls['creatTime'].setValue(this.getCurrentTime());
   }

    //派发任务取消
    handleCancelTask(): void {
    this.isVisibleTask = false;
    this.validateFormTask.reset();
    for (const key in this.validateFormTask.controls) {
      if (this.validateFormTask.controls.hasOwnProperty(key)) {
        this.validateFormTask.controls[key].markAsPristine();
        this.validateFormTask.controls[key].updateValueAndValidity();
      }
    }
  }

  //派发任务数据确认提交
  handleOkTask(): void {
    this.isOkLoadingTask = true;
    if (this.validateFormTask.valid) {
      let url = 'api/task';
      this.http.post(url,JSON.stringify(this.validateFormTask.value),{headers:this.headers}).subscribe(res => {
        if( res === true) {
          this.message.success('用户操作成功！', {
            nzDuration: 500
          });
        }
      },err => {
        this.message.error('用户操作失败！', {
          nzDuration: 500
        });
      })
      setTimeout(() => {
        this.isVisibleTask = false;
        this.isOkLoadingTask = false;
      }, 500);
    } else {
        this.isVisibleTask = true;
        this.isOkLoadingTask = false;
        Object.values(this.validateFormTask.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
    }
  }
  

   //根据实施者id分页获取任务信息
   loadTask(id:number):void {
    let url = 'api/task/pageImplementer';
    this.http.get(url,{
      params:{
        pageNum:this.pageIndexTask,
        pageSize:this.pageSizeTask,
        implementerId:id
      }
    }).subscribe((res:any) => {
        if (res) {
          this.listOfDataTask = res.records;
          this.totalTask = res.total;
        }
    })
   }


  //查看任务
  check(id:number):void {
      setTimeout(() => {
        this.loadTask(id);
        this.isShow = true;
      },1000)
      this.volunteerId = id;

  }

  //关闭查看任务
  close():void {
    this.isShow = false;
  }

  //是否完成任务
  finish(data:any):void {
    //结束本任务
    let obj:any = {};
    obj['id'] = data.id;
    obj['finishTime'] = this.getCurrentTime();
    let url = 'api/task';
    this.http.post(url,JSON.stringify(obj),{headers:this.headers}).subscribe((res:any) => {
       if (res) {
        this.message.success('已结束本任务！', {
          nzDuration: 500
        });
       }
    })
    //获取志愿者表的任务数及总分
    let count:number = 0;
    let score:number = 0;
    let taskUrl = 'api/volunteer/getInfo/'+ this.volunteerId;
    this.http.get(taskUrl).subscribe((res:any) => {
          if (res) {
            count = res.workCount + 1;
            score = res.score + data.getscore;
            //修改志愿者表的任务数及总分
            let updateUrl = 'api/volunteer';
            let UpdateObj:any = {};
            UpdateObj['id'] =  this.volunteerId; 
            UpdateObj['workCount'] = count; 
            UpdateObj['score'] = score;
            this.http.post(updateUrl,JSON.stringify(UpdateObj),{headers:this.headers}).subscribe((res:any) => {
                if (res) {
                  this.onload();
                }
            }) 
          }
    })
  }

  rate(id:number):void {
    this.isVisible = true;
    this.validateForm.controls['id'].setValue(id);
  }
  
  //打分取消
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

  //打分数据确认提交
  handleOk(): void {
    this.isOkLoading = true;
    if (this.validateForm.valid) {
      let url = 'api/task';
      this.http.post(url,JSON.stringify(this.validateForm.value),{headers:this.headers}).subscribe(res => {
        if( res === true) {
          this.message.success('用户操作成功！', {
            nzDuration: 500
          });
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
  
 
   

  //所属任务当前页发生改变
  onCurrentPageDataChangeTask($event: readonly TaskData[]): void {
    this.listOfCurrentPageDataTask = $event;
    this.refreshCheckedStatusTask();
  }

  //所属任务页码改变
  nzPageIndexChangeTask(newPageIndex:number):void{
      this.pageIndexTask = newPageIndex;
      // this.onload();
  }

  //所属任务页大小改变
  nzPageSizeChangeTask(newPageSize:number) {
    this.pageSizeTask = newPageSize;
    // this.onload();
  }

   //所属任务刷新选中状态
   refreshCheckedStatusTask(): void {
    this.checkedTask = this.listOfCurrentPageDataTask.every(item => this.setOfCheckedIdTask.has(item.id));
    this.indeterminateTask = this.listOfCurrentPageDataTask.some(item => this.setOfCheckedIdTask.has(item.id)) && !this.checkedTask;
  }

  //所属任务更新选中集合
  updateCheckedSetTask(id: number, checkedTask: boolean): void {
    if (checkedTask) {
      this.setOfCheckedIdTask.add(id);
    } else {
      this.setOfCheckedIdTask.delete(id);
    }
  }

 //所属任务单个选中
  onItemCheckedTask(id: number, checkedTask: boolean): void {
    this.updateCheckedSetTask(id, checkedTask);
    this.refreshCheckedStatusTask();
  }

 //所属任务全部选中
  onAllCheckedTask(value: boolean): void {
    this.listOfCurrentPageDataTask.forEach(item => this.updateCheckedSetTask(item.id, value));
    this.refreshCheckedStatusTask();
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
