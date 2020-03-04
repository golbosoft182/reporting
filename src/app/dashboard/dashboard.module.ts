import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NvD3Module } from 'ng2-nvd3';

//custom services
import {AnalyticsQuery} from '../services/analyticsquery.service'
import {AnalyticsService} from '../services/analytics.service'
import {WebCEOService} from '../services/webceo.service'
import {ChartService} from '../services/Chart.service'
import {DataService} from '../services/Data.service'
import {AuthManagementService} from '../services/AuthManagement.service';

//custom component for module
import {DashboardComponent} from './dashboard.component'
//custom child componenet for module
import {GlanceComponent} from './components/glance.component'
import {SocialComponent} from './components/social.component'
import {OrganicComponent} from './components/organic.component'
import {TrafficComponent} from './components/traffic.component'
import {ChannelComponent} from './components/channel.component'
import {SiteGoalComponent} from './components/siteGoal.component'
import {PagesComponent} from './components/pages.component'
import {CityComponent} from './components/cities.component'
import {WebCEOComponent} from './components/WebCEO.component'
import {HeaderComponent} from './components/header.component'
//custom provider for module
import {AuthGuard} from '../authentication/auth.guard';
import {InlineEditorModule} from 'ng2-inline-editor';
import {ArrayPipe} from '../Pipe/ArrayPipe';

//TimePicker
import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';

//custom routes
const routes: Routes = [
  {path: 'dashboard',  component: DashboardComponent,canActivate: [AuthGuard]}
];
// d3 and nvd3 should be included somewhere
import 'd3';
import 'nvd3';

export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};

//init modules
@NgModule({
  declarations: [
    DashboardComponent,
    GlanceComponent,
    SocialComponent,
    OrganicComponent,
    TrafficComponent,
    ChannelComponent,
    SiteGoalComponent,
    PagesComponent,
    CityComponent,
    WebCEOComponent,
    HeaderComponent,
    ArrayPipe // th
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    NvD3Module,
    InlineEditorModule,
    OwlDateTimeModule,
    OwlMomentDateTimeModule,
    // DateTimePickerModule,
    RouterModule.forRoot(
      routes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    AnalyticsService,
    AnalyticsQuery,
    WebCEOService,
    ChartService,
    DataService,
    AuthManagementService,
    {provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS}
  ]
})
export class DashboardModule { }
