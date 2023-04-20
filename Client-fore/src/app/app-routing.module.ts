import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { CreateComponent } from './components/create/create.component';

const routes: Routes = [
  {
    path:'',redirectTo:'home',pathMatch:'full'
  },{
    path:'login',component:LoginComponent
  },{
    path:'home',component:HomeComponent
  },{
    path:'create',component:CreateComponent
  },{
    path:'user',component:UserComponent
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
