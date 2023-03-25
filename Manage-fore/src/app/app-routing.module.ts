import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NoLoginComponent } from './components/no-login/no-login.component';
import { ErrorComponent } from './components/error/error.component';
import { PasswordComponent } from './components/password/password.component';
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
   }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
