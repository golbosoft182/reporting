import { Component, OnInit, Input,AfterViewInit } from '@angular/core';
import {AnalyticsService} from '../../services/analytics.service';
import {AnalyticsQuery} from '../../services/analyticsquery.service';
import {WebCEOService} from '../../services/webceo.service';
import {DataService} from '../../services/Data.service';
import {Helper} from '../../Utils/Helper';

import {OrganicChannel} from '../../models/OrganicChannel.data';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'header',
  templateUrl: '../pages/header.component.html',
})

export class HeaderComponent implements AfterViewInit {
    public body;
     //select options
    public packages:Array<any>;
    public companies:Array<any>;
    public companies_properties:Array<any>;
    public companies_views:Array<any>;
    public ranking_account:Array<any>;
    public web_ceo_list:Array<any>;
    public goal_channel_parameter:Array<any>;
    
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
    
    public code:string;
    public success:string;
    
    public sign_in:string;
    private error_messages;
    public goalSelection;
    constructor(private analytics:AnalyticsService,private query:AnalyticsQuery,private webceo:WebCEOService,
                private helper:Helper,private dataset:DataService) {
    // this.data=dataset; 
        this.success="hide";
        this.error_messages=["Success","Error"];
    }
    
    ngOnInit(){
        
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
    
    loadAnalytics(){
    
        
    }
    
}