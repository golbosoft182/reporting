import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
//custom modules
import {AuthenticationModule} from './authentication/authentication.module'
import {DashboardModule} from './dashboard/dashboard.module'
import {ClientModule} from './client/client.module'

//custom helpers
import {ChartService} from './services/Chart.service'
import {Helper} from './Utils/Helper'



const routes: Routes = [
  {path: '',redirectTo: '/dashboard',pathMatch: 'full' }

];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthenticationModule,
    DashboardModule,
    ClientModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [ChartService,Helper],
  bootstrap: [AppComponent]
})
export class AppModule { }
