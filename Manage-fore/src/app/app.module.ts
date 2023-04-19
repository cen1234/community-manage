import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { zh_CN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxEchartsModule } from 'ngx-echarts';//引入部分
import { MyInterceptorInterceptor } from './my-interceptor.interceptor';
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
import { NzBackTopModule } from 'ng-zorro-antd/back-top';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzRateModule } from 'ng-zorro-antd/rate';
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
import { RoleComponent } from './components/role/role.component';
import { CommunityComponent } from './components/community/community.component';
import { MaterialsComponent } from './components/materials/materials.component';
import { StaffInfoComponent } from './components/staff-info/staff-info.component';
import { VolunteerInfoComponent } from './components/volunteer-info/volunteer-info.component';
import { InneedInfoComponent } from './components/inneed-info/inneed-info.component';
import { ApplyComponent } from './components/apply/apply.component';
import { WorkComponent } from './components/work/work.component';
import { HospitalComponent } from './components/hospital/hospital.component';
import { HealthComponent } from './components/health/health.component';
import { QuestionComponent } from './components/question/question.component';





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
    AsideComponent,
    RoleComponent,
    CommunityComponent,
    MaterialsComponent,
    StaffInfoComponent,
    VolunteerInfoComponent,
    InneedInfoComponent,
    ApplyComponent,
    WorkComponent,
    HospitalComponent,
    HealthComponent,
    QuestionComponent
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
    NzBackTopModule,
    NzUploadModule,
    NzMessageModule,
    NzTreeModule,
    NzTimelineModule,
    NzRateModule,
    //引入部分
    NgxEchartsModule.forRoot({ //引入部分
      echarts: () => import('echarts') //引入部分
    }), //引入部分
    
  ],
  providers: [
    { provide: NZ_I18N, 
      useValue: zh_CN ,
    }
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: MyInterceptorInterceptor,
    //   multi: true
    // },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
