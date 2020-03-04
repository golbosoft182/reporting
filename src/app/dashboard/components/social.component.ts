import { Component, OnInit, Input,Output,EventEmitter,AfterViewInit } from '@angular/core';
import {AnalyticsQuery} from '../../services/analyticsquery.service';
import {DataService} from '../../services/Data.service';
import {Helper} from '../../Utils/Helper';

import {OrganicChannel} from '../../models/OrganicChannel.data';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'social',
  templateUrl: '../pages/social.component.html',
})

export class SocialComponent implements AfterViewInit {
  @Input()  current_month;  
  @Input()  compare_month;
  @Input()  first_year;
  @Input()  second_year;
  @Input() generateReport:Subject<boolean>;
  @Input() generateOldReport:Subject<boolean>;
  @Output() currentLoad:EventEmitter<any>;
  // private data;
  public percentage;
  public social;
  public symbol;
  
  constructor(private query:AnalyticsQuery,public dataset:DataService,public helper:Helper) {
    // this.data=dataset; 
    this.currentLoad=new EventEmitter<any>();
    this.percentage=[];
    this.symbol=[];
  }
 
  ngAfterViewInit(){
      //this is emitted by dashboard for current and compare month
      this.generateReport.subscribe(v => {
          if(v===true){
            this.getSocialData();
          }
      });
      //this is emitted by dashboard for last year 
      this.generateOldReport.subscribe(v => {
          if(v===true){
            this.getOldSocialData();
          }
      });
  }
  
  getSocialData(){
      this.query.getSocial().then((result)=>{
          console.log(result);
          this.dataset.setCurrentData("social",result["current"]);
          this.dataset.setCompareData("social",result["compare"]);
          this.currentLoad.emit({"component":"social","loaded":true});
          this.setPercentageandSymbol();
      });
      
  }
  
  getOldSocialData(){
    this.query.getSocial().then(item=>{
      this.dataset.setLastYear("social",item["current"]);
      // this.dataset.last_year.social=item["current"];
    });
  }
  
  setPercentageandSymbol(){
    this.social=this.dataset.getCurrentData("social").map(val=>{
        return this.dataset.getComparedData("social").filter(v=>{
            return v.name==val.name;
        }).map(item=>({"key":val.name,"current":val.value,"compare":item.value}))[0];
    });
     
    this.social.forEach(item=>{
      let percentage=this.helper.getPositivePercentage(item.current,item.compare);
       this.percentage[item.key]=percentage===0?"No Change":percentage; 
       this.symbol[item.key]=this.helper.getSymbol(item.current,item.compare);
    });
  }
}