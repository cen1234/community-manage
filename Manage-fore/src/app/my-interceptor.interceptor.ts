import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MyInterceptorInterceptor implements HttpInterceptor {
  
  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
     //request: HttpRequest<unknown>表示请求对象，包含了和请求相关的所有信息,unkonow指定请求体body的类型
    //next: HttpHandler 当将请求对象修改完成之后，将修改后的请求对象通过next中的handle方法传回真正发送请求的方法中
    let user:any = localStorage.getItem("user");
    user = JSON.parse(user);
     if (!user.token) {
      let req = request.clone({
        setHeaders:{
          'Content-Type': 'application/json'
        }
      })//在请求头中增加token
      console.log('1')
      return next.handle(req)//将修改后的请求返回给应用
     } else {
      let req = request.clone({
        setHeaders:{
          token: user.token,
          'Content-Type': 'application/json'
        }
      })//在请求头中增加token
      console.log('2')
      return next.handle(req)//将修改后的请求返回给应用
     }
  }
}
