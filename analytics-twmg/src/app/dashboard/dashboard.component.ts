import { Component,OnInit, ViewEncapsulation,AfterViewInit,ViewChild } from '@angular/core';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
    
import {AnalyticsService} from '../services/analytics.service';
import {AnalyticsQuery} from '../services/analyticsquery.service';
import {WebCEOService} from '../services/webceo.service';
import {DataService} from '../services/Data.service';
import {Helper} from '../Utils/Helper';
import {Subject} from 'rxjs/Subject';

//custom child componenet for module
// import {GlanceComponent} from './components/glance.component'
// import {SocialComponent} from './components/social.component'

// // d3 and nvd3 should be included somewhere
// import 'd3';
// import 'nvd3';
declare let d3: any;
declare let nvd3: any;

//Data Models

import {Model} from '../models/Model.data';
import {Page} from '../models/Page.data';
import {City} from '../models/City.data';
import {OrganicChannel} from '../models/OrganicChannel.data';
// import {Webceo} from '../Webceo/webceo.component'
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
    public first_month_start:any;
    public second_month_start:any;
    public first_month_end:any;
    public second_month_end:any;
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
    public changeOrganic:Subject<boolean>;
    
    public loadedComponent:Array<any>;
    
    // @ViewChild('nvd3') nvd3;

    constructor(private analytics:AnalyticsService,private query:AnalyticsQuery,private webceo:WebCEOService,
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
        //initialize the variable
        this.eventIndex={};

        this.my_Class= true;
        this.sign_in="show btn btn-default";
        this.body="hide";
        this.success="hide";
        this.package=this.packages[0];
                    
        this.webceo.getList().then((data)=>{
            var json=JSON.parse(data["_body"]);
            json[0]["data"].forEach((item)=>{   
                this.web_ceo_list.push(item); 
                
            });
            this.rankingAccount=this.web_ceo_list[0].project;
        });
       
       this.enableGlance=new Subject();
       this.enableSocial=new Subject();
       this.enableOrganic=new Subject();
       this.generateOld=new Subject();
       this.changeOrganic=new Subject();
       this.loadedComponent=new Array<any>();
    }
  
    ngAfterViewInit() {
        this.analytics.loadClient().then((result) => {
            this.analytics.initAnalytics().then(res=>{},err=>{console.log(err);});
            this.analytics.initAuth();
        },(err)=>{
            console.log(err);
        });
    }
  
    authenticateUser(){
        this.analytics.authenticate().then((res)=>{
            this.loadList();
            this.body="row";
            this.sign_in ="hide";
        },(err)=>{
            throw "cannot load data";
        });
    }
  
    loadList(){   
        try{
            if(this.analytics.authUser()){
                this.analytics.getCompanyList().then(result=>{
                    this.companies=result;
                    if(this.companies.length==0){
                        this.body="hide";
                        this.sign_in ="row";
                        this.success="alert alert-danger";
                        this.code="Please Check Your E-mail Id ";
                    }
                    else{
                        this.AccountValue=result[0].id;
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
                this.ViewValue=result[0].id;
                this.getGoal();
                // this.getEachDetailsGoal();
            }
        },err=>{console.log(err);});
    }
    
    getGoal(){
        try{
        this.analytics.getGoalList(this.companies[this.AccountValue].id,this.PropertyValue,this.ViewValue).then(result=>{
          this.goalSelection=result;
        //   this.data["listofGoalSelection"]=result;
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
        console.log(data);
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
            this.query.setSingleDate(this.first_month_start,this.first_month_end);
            this.generateOld.next(true);
        }
    }
  
    loadAnalytics(){
        this.validate();
        try{
            this.my_Class=false;
            this.query.setViewId(this.ViewValue);
            let first_selected_date=new Date(this.first_month_start);
            let last_selected_date=new Date(this.second_month_start);
            this.first_year=first_selected_date.getFullYear().toString();
            this.compare_year=this.second_year=last_selected_date.getFullYear().toString();
            let compare_date=null;
            if(!this.first_month_end){
                compare_date=new Date(first_selected_date.getFullYear(),first_selected_date.getMonth()+1,0);
                this.first_month_end=new Date(compare_date-compare_date.getTimezoneOffset()*60*1000).toISOString().slice(0,10);
            }
            if(!this.second_month_end){
                compare_date=new Date(last_selected_date.getFullYear(),last_selected_date.getMonth()+1,0);
                this.second_month_end=new Date(compare_date-compare_date.getTimezoneOffset()*60*1000).toISOString().slice(0,10);
            }
            this.current_month=this.helper.getMonthString(this.first_month_start);
            this.compare_month=this.helper.getMonthString(this.second_month_start);
            this.compare_index_month=this.compare_month;
            this.query.setCurrentDate(this.first_month_start,this.first_month_end);
            this.query.setCompareDate(this.second_month_start,this.second_month_end);
            this.enableGlance.next(true);
        }
        catch(e){
            console.log(e);
        }
        
    }
  
    saveProject(){
        let data={};
        data["current"]=this.dataset.getAllCurrentData();
        data["compare"]=this.dataset.getAllCompareData();
        data["last_year"]=this.dataset.getLastYearData();
        data["comment"]=this.dataset.getAllComment();
        data["package"]=this.package;
        data["listofGoalSelection"]=this.goalSelection;
        console.log(data["current"]);
        this.webceo.saveProject({      
            "current_date":this.first_month_start,
            "end_current_date":this.first_month_end,
            "previous_date":this.second_month_start,
            "end_previous_date":this.second_month_end,
            "client_name":this.client_name,
            "data":data
        }).then((res)=>{
            var body=JSON.parse(res._body);
            this.success="alert alert-success";
            this.message_name=this.error_messages[0];
            this.code="You Generated URL:"+window.location.origin+"/new-analytics/client/"+body.random_code;
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
        this.changeOrganic.next(true);
    }
}
