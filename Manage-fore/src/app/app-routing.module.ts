import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NoLoginComponent } from './components/no-login/no-login.component';
import { ErrorComponent } from './components/error/error.component';
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

const routes: Routes = [
  {
    path:'',redirectTo:'login',pathMatch:'full'
  },
  {
    path:'login',component:LoginComponent
  },
  {
    path:'no-login',component:NoLoginComponent
  },
  {
    path:'error',component:ErrorComponent
  },
   {
     path:'password',component:PasswordComponent
   },
   {
     path:'individual',component:IndividualComponent
   },
   {
     path:'user',component:UserComponent
   },
   {
    path:'role',component:RoleComponent
   },
   {
    path:'community',component:CommunityComponent
   },
   {
     path:'materials',component:MaterialsComponent
   },
   {
    path:'staffInfo',component:StaffInfoComponent
   },
   {
    path:'volunteerInfo',component:VolunteerInfoComponent
   },
   {
    path:'apply',component:ApplyComponent
   },
   {
    path:'inneedInfo',component:InneedInfoComponent
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
