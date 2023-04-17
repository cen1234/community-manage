import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http'; 
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';

interface ItemData {
  id: number;
  role:number;
  description: string;
  isshow:string
}
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
 
  public isCollapsed:boolean = false;//侧边栏是否折叠
  public isVisible:boolean = false;//编辑弹窗是否出现
  public isRoleVisible:boolean = false;//权限修改弹窗是否出现
  public isOkLoading:boolean = false;///编辑弹窗提交数据是否加载
  public isRoleOkLoading:boolean = false;//权限修改弹窗提交数据是否加载
  public validateForm: UntypedFormGroup;//用户表格
  listOfData: readonly ItemData[] = [];//表格数据
  headers = new HttpHeaders({'Content-Type': 'application/json'});;//请求头
  defaultCheckedKeys:any = [];//指定选中复选框的树节点
  defaultSelectedKeys:any = [];//指定选中的树节点
  defaultExpandedKeys:any = [];//展开指定的树节点
  nodes = [];//存储所有菜单信息
  roleId:number = 0;
  checkedKey:any = [];//存储用户选择的菜单
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent!: NzTreeComponent;

  constructor(private fb: UntypedFormBuilder,private http:HttpClient,private message: NzMessageService) { 
    this.validateForm = this.fb.group({
      id:[''],
      role:['',[Validators.required]],
      description:['',[Validators.required]],
    });
  }

  ngOnInit(): void {
    this.onload();
  }

  //获取身份信息
  onload():void {
     let url = 'api/role';
     this.http.get(url).subscribe((res:any) => {
       this.listOfData = res;
     })
  }

  //导出
  export():void {
    window.open('http://localhost:9000/role/export');
  }

  //修改
  edit(data:any):void {
    this.isVisible = true;
    this.validateForm.controls['id'].setValue(data.id);
    this.validateForm.controls['role'].setValue(data.role);
    this.validateForm.controls['description'].setValue(data.description);
  }

   //编辑身份数据确认提交
   handleOk(): void {
    this.isOkLoading = true;
    if (this.validateForm.valid) {
      let url = 'api/role';
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

  //修改权限
  role(data:any):void {
    this.roleId = data.id;
    //获取所有菜单
    let url = 'api/menu';
    this.http.get(url).subscribe((res:any) => {
       this.nodes = res.map((item:any) => {
          let obj:any = {};
          if (item.children.length == 0) {
              obj['title'] = item.name;
              obj['key'] = item.id;
              obj['isLeaf'] = true;
          } else {
              obj['title'] = item.name;
              obj['key'] = item.id;
              obj['children'] = item.children.map((child:any) => {
                  let objChild:any = {};
                  objChild['title'] = child.name;
                  objChild['key'] = child.id;
                  objChild['isLeaf'] = true;
                  return objChild;
              })
          }
          return obj;
       })
       //展开所有的一级菜单
       this.defaultExpandedKeys = this.nodes.map((item:any) => {
           return item.key;
       })
       //获取修改权限当前角色所有的菜单
     let url1 = 'api/role/roleMenu';
     this.http.get(url1,{params:{
      roleId: data.id
     }}).subscribe((res:any) => {
        this.defaultCheckedKeys = res;
        this.defaultSelectedKeys = res;
        this.isRoleVisible = true;
     })
    })
  }

  nzEvent(event: NzFormatEmitEvent): void {
    // console.log('1',event)
    console.log(event.keys);
  }

  nzSelect(keys: string[]): void {
    console.log(keys, this.nzTreeComponent.getSelectedNodeList());
  }
  
  //权限修改确认提交
  RolehandleOk():void {
    this.isRoleOkLoading = true;
    let url = 'api/role/roleMenu/'+this.roleId;
    this.checkedKey = this.getSelectedNode();
    this.http.post(url,JSON.stringify(this.checkedKey[0]),{headers:this.headers}).subscribe((res:any) => {
        if (res.code === '200') {
          this.isOkLoading = false;
          this.isRoleOkLoading = false;
          this.isRoleVisible = false;
        }
    })
  }

  //获取选中的所有菜单节点
   getSelectedNode():any {
    let temp = [];
    let arr:number[] = [];
    return this.nzTreeComponent.getCheckedNodeList().map((item:any) => {
        if (item._children.length === 0) {
           arr.push(item.key);
        } else {
            arr.push(item.key);
            let t = [];
             t = item._children.map((child:any) => {
                 arr.push(child.key);
                 return child.key;
            })
        }
        return arr;
     })
     
   }


   //新增|编辑用户取消
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

 //权限修改取消
  RolehandleCancel():void {
    this.isRoleVisible = false;
  }

}
