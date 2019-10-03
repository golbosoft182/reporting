import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from './auth.guard';
import {AnonymousGuard} from './anonymous.guard';

import { FormsModule } from '@angular/forms';
import {AuthenticationService} from './authentication.service';
import {LoginComponent} from './login.component';

const routes: Routes = [
  {path: 'login',  component: LoginComponent,canActivate: [AnonymousGuard] }
];
@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    FormsModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [AuthenticationService,AuthGuard,AnonymousGuard]
})
export class AuthenticationModule { }
