import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { map, Observable, Observer, toArray } from 'rxjs';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-edit-img',
  templateUrl: './edit-img.component.html',
  styleUrls: ['./edit-img.component.css']
})
export class EditImgComponent implements OnInit {

  public user:any;//存储用户信息
  visible = false;//编辑头像抽屉是否可见
  avatarUrl?: string;//上传的头像
  data:any;//上传文件携带的参数
  loading = false;//上传头像加载
  userImg:string = '';//缓存里的头像

  constructor(private router: Router,private message: NzMessageService,private fb: UntypedFormBuilder,private http:HttpClient) { }

  ngOnInit(): void {
    //从浏览器缓存取出用户信息
    this.user  =localStorage.getItem("user");
    this.user = JSON.parse(this.user);
    this.data = () => {
      return {"username":this.user.username};
    }
    this.open(); 
  }

  //打开
  open():void {
    this.visible = true;
    
  }

 //关闭
 close(): void {
  this.visible = false;
  this.router.navigate(['/user']);
} 

//确认编辑头像
ok():void {
  this.user.userImg = this.userImg;
  localStorage.clear();
  localStorage.setItem("user",JSON.stringify(this.user));
  this.visible = false;
  this.router.navigate(['/user']);
}

  //设置头像上传格式，大小
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
  new Observable((observer: Observer<boolean>) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      this.message.error('You can only upload JPG file!');
      observer.complete();
      return;
    }
    const isLt2M = file.size! / 1024 / 1024 < 2;
    if (!isLt2M) {
      this.message.error('Image must smaller than 2MB!');
      observer.complete();
      return;
    }
    observer.next(isJpgOrPng && isLt2M);
    observer.complete();
  });

  //说明，在上传完图片后，也拿到了fileuuid,但是不知道为什么info.file.status是error,所有直接从error里取fileuuid了
  handleChange(info: { file: NzUploadFile }): void {
  switch (info.file.status) {
    case 'uploading':
      this.loading = true;
      break;
    case 'done':
          break;
    case 'error':
      this.avatarUrl ='api/file/'+ info.file.error.error.text;
      this.userImg = info.file.error.error.text;
      this.loading = false;
      break;
  }
  }

}
