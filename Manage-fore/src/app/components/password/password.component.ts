import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  
  //属性
 public phoneValidateForm: UntypedFormGroup;
 

  constructor(private fb: UntypedFormBuilder, private router: Router) {
    this.phoneValidateForm = this.fb.group({
      phoneNumber: ['',[Validators.required],[this.phoneAsyncValidator]],
    });
   }

  ngOnInit(): void {
  }

  //提交
  submitForm(): void {
    if (this.phoneValidateForm.valid) {
        //检验后无问题将电话传至后台，并跳转至登录界面
        this.router.navigate(['/login']);
    } else {
      Object.values(this.phoneValidateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  //回到登录页(防止误点到找回密码页)
  onBack() {
     this.router.navigate(['/login']);
  }
 
 //设置校验规则
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
