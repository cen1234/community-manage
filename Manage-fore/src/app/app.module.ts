import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//NG-ZORRO组件
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
//子组件
import { ErrorComponent } from './components/error/error.component';
import { NoLoginComponent } from './components/no-login/no-login.component';
import { LoginComponent } from './components/login/login.component';


registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    NoLoginComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule,
    NzDividerModule,
    NzFormModule,
    NzToolTipModule
    
  ],
  providers: [
    { provide: NZ_I18N, 
      useValue: zh_CN ,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
