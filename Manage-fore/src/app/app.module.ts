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
import { NgxEchartsModule } from 'ngx-echarts';//引入部分
//NG-ZORRO组件
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
//公共组件
import { HeaderComponent } from './layout/header/header.component';
import { AsideComponent } from './layout/aside/aside.component';
//子组件
import { ErrorComponent } from './components/error/error.component';
import { NoLoginComponent } from './components/no-login/no-login.component';
import { LoginComponent } from './components/login/login.component';
import { PasswordComponent } from './components/password/password.component';
import { IndividualComponent } from './components/individual/individual.component';
import { UserComponent } from './components/user/user.component';




registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent,
    NoLoginComponent,
    LoginComponent,
    PasswordComponent,
    IndividualComponent,
    UserComponent,
    HeaderComponent,
    AsideComponent
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
    NzToolTipModule,
    NzDropDownModule,
    NzSelectModule,
    NzPageHeaderModule,
    NzAvatarModule,
    NzTagModule,
    NzDescriptionsModule,
    NzModalModule,
    NzInputNumberModule,
    NzRadioModule,
    NzLayoutModule,
    NzBreadCrumbModule,
    NzBadgeModule,
    NzCardModule,
    NzStatisticModule,
    NzPopoverModule,
    NzPopconfirmModule,
    NzTabsModule,
    NzTableModule,
    //引入部分
    NgxEchartsModule.forRoot({ //引入部分
      echarts: () => import('echarts') //引入部分
    }), //引入部分
    
  ],
  providers: [
    { provide: NZ_I18N, 
      useValue: zh_CN ,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
