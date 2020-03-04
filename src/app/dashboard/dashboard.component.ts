import { Component,OnInit, ViewEncapsulation,AfterViewInit,ViewChild } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import {AnalyticsService} from '../services/analytics.service';
import {AnalyticsQuery} from '../services/analyticsquery.service';
import {WebCEOService} from '../services/webceo.service';
import {DataService} from '../services/Data.service';
import {AuthManagementService} from '../services/AuthManagement.service';

import {Helper} from '../Utils/Helper';
import {Subject} from 'rxjs/Subject';

// d3 and nvd3 should be included somewhere
declare let d3: any;
declare let nvd3: any;

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './dashboard.component.html',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  styleUrls: ['./dashboard.component.css',
    '../../../node_modules/ng-pick-datetime/assets/style/picker.min.css',
    '../../../node_modules/nvd3/build/nv.d3.min.css'],
  encapsulation:ViewEncapsulation.None
})

export class DashboardComponent implements AfterViewInit {
  title = 'dashboard';
  //Default
  public location: Location;
  //Models
  public events:any;
  public goalsName:any;
  //Charts
  public current_month:string;
  public compare_month:string;
  // public Math: any;
  //select options
  public packages:Array<any>;
  public companies:Array<any>;
  public companies_properties:Array<any>;
  public companies_views:Array<any>;
  public ranking_account:Array<any>;
  public web_ceo_list:Array<any>;
  public goal_channel_parameter:Array<any>;
  // array for testing purpose
  public test_data:Array<any>;
  // ----------------------

  public top_pages_ranking:Array<any>;
  public goalSelection:Array<any>;
  public goalExcluded:Array<any>;
  //program variables
  public my_Class:boolean;
  public sign_in:string;
  public body:string;
  public success:string;
  private error_messages:Array<any>;
  public code:string;
  private month:Array<any>;
  // public data:any;
  // public SiteGoalIndex:number;
  // public comment:any;
  // private organic:Array<any>;
  //two way binding variable
  public AccountValue:number;
  public PropertyValue:number;
  public ViewValue:number;
  public rankingAccount:string;
  public client_name:string;
  public client_id:number;
  public message_name:string;
  public package:string;
  public eventIndex:any;

  public first_month:any;
  public second_month:any;

  public first_month_start:any;
  public second_month_start:any;
  public first_month_end:any;
  public second_month_end:any;

  public compare_year_start:any;
  public compare_year_end:any;

  public compare_index_month;
  public first_year:string;
  public second_year:string;

  public compare_year:string;
  //Observers
  public enabledComponent:Array<any>;
  public enableGlance: Subject<boolean>;
  public enableSocial: Subject<boolean>;
  public enableOrganic: Subject<boolean>;
  public generateOld:Subject<boolean>;
  public loadCompareData:Subject<boolean>;
  public loadedComponent:Array<any>;

  // @ViewChild('nvd3') nvd3;

  constructor(private analytics:AnalyticsService,private auth:AuthManagementService,private query:AnalyticsQuery,private webceo:WebCEOService,
              public helper:Helper,public dataset:DataService){
    this.month=["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.error_messages=["Success","Error"];
    this.packages=["Starter","Standard","Advanced","Premium"];
    this.companies=new Array<any>();
    this.companies_properties=new Array<any>();
    this.companies_views=new Array<any>();
    this.ranking_account=new Array<any>();
    this.web_ceo_list=new Array<any>();
    this.goal_channel_parameter=new Array<any>();

    // Array for testing
    this.test_data=new Array<any>();
    this.goalSelection=new Array<any>();
    this.goalExcluded=new Array<any>();
    //initialize the variable
    this.eventIndex={};

    this.my_Class= true;
    this.sign_in="show btn btn-default";
    this.body="hide";
    this.success="hide";
    this.package=this.packages[0];

    this.webceo.getList().then((res)=>{
      this.web_ceo_list=res[0]["data"];
      this.rankingAccount=this.web_ceo_list[0].project;
    });

    this.enableGlance=new Subject();
    this.enableSocial=new Subject();
    this.enableOrganic=new Subject();
    this.generateOld=new Subject();
    this.loadCompareData=new Subject();
    this.loadedComponent=new Array<any>();
  }

  ngAfterViewInit() {
    this.analytics.loadClient().then((result) => {
      this.analytics.initAnalytics().then(res=>{},err=>{console.log(err);});
      this.auth.initAuth().then((GoogleAuth)=>{
          if(GoogleAuth.isSignedIn.get()){
            GoogleAuth.signIn().then((res)=>{
              this.loadList();
              this.body="row";
              this.sign_in ="hide";
            });
          }
      });
    },(err)=>{
      this.success="alert alert-danger";
      this.code=err;
      console.log(err);
    });

  }

  authenticateUser(){
    this.auth.authenticate().then((res)=>{
      this.loadList();
      this.body="row";
      this.sign_in ="hide";
    },(err)=>{
      throw "cannot load data";
    });
  }

  loadList(){
    try{
      if(this.auth.authUser()){
        this.analytics.getCompanyList().then(result=>{
          this.companies=result;
          if(this.companies.length==0){
            this.body="hide";
            this.sign_in ="row";
            this.success="alert alert-danger";
            this.code="Please Check Your E-mail Id ";
          }
          else{
            this.AccountValue=0;
            this.getDetails(0);
          }
        },err=>{
          console.log(err);
        });
      }
    }
    catch(err){
      console.log(err);
    }
  }

  getDetails(value){
    this.client_id=this.companies[value].id;
    this.client_name=this.companies[value].name;
    this.analytics.getCompanyProperties(this.client_id).then(result=>{
      this.companies_properties=result;
      if(result!=null){
        this.PropertyValue=result[0].id;
        this.getView();
      }
    });
  }

  getView(){
    this.analytics.getViewList(this.client_id,this.PropertyValue).then(result=>{
      this.companies_views=result;
      if(result!=null){
        this.ViewValue=result[0]["id"];
        this.getGoal();
      }
    },err=>{console.log(err);});
  }

  getGoal(){
    try{
      this.analytics.getGoalList(this.companies[this.AccountValue].id,this.PropertyValue,this.ViewValue).then(result=>{
        this.goalSelection=result.goals;
        console.log(result.excludedGoals);
        // this.dataset.setExcludedGoal(result.excludedGoals)
        this.goalExcluded=result.excludedGoals;
        console.log(this.goalExcluded);
      },err=>{console.log(err);});
    }
    catch(e){
      console.log(e);
    }

  }

  validate(){
    try{
      if(this.first_month_start==null){
        throw "Please Check your Date";
      }
      if(this.second_month_start==null){
        throw "Please Check your Date";
      }
      if(this.rankingAccount==null){
        throw "You haven't selected the ranking account yet"
      }
    }
    catch(e){
      this.success="alert alert-danger";
      this.code=e;
      throw e;
    }
  }

  loadChannelData(data:any){
    if(data["component"]==="glance"){
      this.enableOrganic.next(true);
    }
    this.loadedComponent.push(data);
    this.checkLoad();
  }

  checkLoad(){
    //Load Data only after loading compare and current data
    if(this.loadedComponent.length===7){
      //Can't use above promises because it will cache old request data
      //Fetch new Data For Previous year current month
      this.query.setSingleDate(this.compare_year_start,this.compare_year_end);
      this.generateOld.next(true);
    }
  }

  loadAnalytics(){
    try{
      this.my_Class=false;
      this.query.setViewId(this.ViewValue);

      let first_year=moment(this.first_month[0]);
      let second_year=moment(this.second_month[0]);


      let first_year_end=moment(this.first_month[1]);
      let second_year_end=moment(this.second_month[1]);

      this.first_month_start=first_year.format("YYYY-MM-DD");
      this.second_month_start=second_year.format("YYYY-MM-DD");

      this.first_month_end=first_year_end.format("YYYY-MM-DD");
      this.second_month_end=second_year_end.format("YYYY-MM-DD");


      this.first_year=first_year.format("YYYY");
      this.compare_year=this.second_year=second_year.format("YYYY");

      this.current_month=first_year.format('MMMM');
      this.compare_month=second_year.format('MMMM');

      this.compare_index_month=this.compare_month;

      this.query.setCurrentDate(this.first_month_start,this.first_month_end);
      this.query.setCompareDate(this.second_month_start,this.second_month_end);

      //subtract year after the query
      let last_year=first_year.subtract(1,'years');
      let last_year_end=first_year_end.subtract(1,'years');

      this.compare_year_start=last_year.format("YYYY-MM-DD");
      this.compare_year_end=last_year_end.format("YYYY-MM-DD");

      this.enableGlance.next(true);
    }
    catch(e){
      console.log(e);
    }

  }

  filterGoalList(){

  }

  saveProject(){
    let data={};
    data["current"]=this.dataset.getAllCurrentData();
    data["compare"]=this.dataset.getAllCompareData();
    data["last_year"]=this.dataset.getLastYearData();
    data["comment"]=this.dataset.getAllComment();
    data["package"]=this.package;
    data["listofGoalSelection"]=this.goalSelection;
    this.webceo.saveProject({
      "current_date":this.first_month_start,
      "end_current_date":this.first_month_end,
      "previous_date":this.second_month_start,
      "end_previous_date":this.second_month_end,
      "client_name":this.client_name,
      "data":data
    }).then((res)=>{
      this.success="alert alert-success";
      this.message_name=this.error_messages[0];
      this.code="You Generated URL:"+window.location.origin+"/new-analytics/client/"+res["random_code"];
    },err=>{
      console.log(err);
    });
  }

  toggleMonth(month){
    if(month==this.compare_month){
      // this.compare=this.data.compare;
      this.compare_index_month=this.compare_month;
      this.second_year=this.compare_year;
      this.dataset.setCurrentIndex(0);
    }
    else if(month==this.current_month){
      // this.compare=this.data.last_year;
      this.compare_index_month=this.current_month;
      this.compare_year=this.second_year;
      this.second_year=(Number(this.first_year)-1).toString();
      this.dataset.setCurrentIndex(1);
    }
    this.loadCompareData.next(true);
  }
}
