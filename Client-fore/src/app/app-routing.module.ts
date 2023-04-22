import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { UserComponent } from './components/user/user.component';
import { CreateComponent } from './components/create/create.component';
import { InformationComponent } from './components/information/information.component';
import { EditInfoComponent } from './components/edit-info/edit-info.component';
import { EditImgComponent } from './components/edit-img/edit-img.component';
import { ArticleComponent } from './components/article/article.component';
import { MyQuestionComponent } from './components/my-question/my-question.component';
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
  },{
    path:'information',component:InformationComponent
  },{
    path:'editInfo',component:EditInfoComponent
  },{
    path:'editImg',component:EditImgComponent
  },{
    path:'article',component:ArticleComponent
  },{
    path:'question',component:MyQuestionComponent
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
