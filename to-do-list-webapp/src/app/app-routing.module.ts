import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import {MainComponent} from "./components/main/main.component";
import {AngularFireAuthGuard, redirectUnauthorizedTo} from "@angular/fire/compat/auth-guard";

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {path: '', component:IndexComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'main', component: MainComponent, canActivate: [AngularFireAuthGuard], data: {authGuardPipe: redirectUnauthorizedToLogin}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
