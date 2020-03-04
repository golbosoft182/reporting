import { Component, OnInit, Input,Output,EventEmitter,AfterViewInit } from '@angular/core';

import {AnalyticsQuery} from '../../services/analyticsquery.service';
import {DataService} from '../../services/Data.service';
import {ChartService} from '../../services/Chart.service';
import {Helper} from '../../Utils/Helper';

import {OrganicChannel} from '../../models/OrganicChannel.data';
import {Subject} from 'rxjs/Subject';

declare let d3: any;
declare let nvd3: any;

@Component({
  selector: 'channel',
  templateUrl: '../pages/channel.component.html',
})

export class ChannelComponent implements AfterViewInit {
    @Input()  current_month;  
    @Input()  compare_month;
    @Input() compare_index_month;
    @Input()  first_year;
    @Input()  second_year;
    @Input() generateReport:Subject<boolean>;
    @Input() generateOldReport:Subject<boolean>;
    @Output() currentLoad:EventEmitter<any>;
    
    // private data;
    public bar_graph:any;
    public organic;
    public donut_chart:any;
    
    constructor(private query:AnalyticsQuery,public dataset:DataService,public helper:Helper,private chart:ChartService) {
        this.currentLoad= new EventEmitter<any>(); 
        //Legend text for donut chart 
        this.donut_chart=this.chart.setChartOption({donut:true,pie: {startAngle:null,
                    endAngle: null}});
        this.donut_chart=this.donut_chart.setChartType("pieChart").getChart();
    }
    
    ngAfterViewInit(){
      this.generateReport.subscribe(v => {
          if(v===true){
            this.setChannel();
            //Set Last Year Once all component loaded
            this.currentLoad.emit({"component":"channel","loaded":true});
          }
      });
      this.generateOldReport.subscribe(v => {
          if(v===true){
            this.setLastChannel();
          }
      });
    }
    
    setChannel(){
        this.query.getSiteGoalsViaChannel().then((result)=>{
            this.dataset.setCurrentData("channel",result["current"]);
            this.dataset.setCompareData("channel",result["compare"]);    
        });
    }
    
    setLastChannel(){
        this.query.getSiteGoalsViaChannel().then(item=>{
            this.dataset.setLastYear("channel",item["current"]); 
        });
    }
}