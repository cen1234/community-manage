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
import { MaterialsComponent } from './components/materials/materials.component';
import { BorrowComponent } from './components/borrow/borrow.component';
import { ApplyComponent } from './components/apply/apply.component';
import { InNeedComponent } from './components/in-need/in-need.component';

const routes: Routes = [
  {
    path:'',redirectTo:'login',pathMatch:'full'
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
  },{
    path:'material',component:MaterialsComponent
  },{
    path:'borrow',component:BorrowComponent
  },{
    path:'apply',component:ApplyComponent
  },{
    path:'need',component:InNeedComponent
  }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
