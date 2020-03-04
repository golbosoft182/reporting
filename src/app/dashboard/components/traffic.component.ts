import { Component, OnInit, Input,Output,EventEmitter,AfterViewInit } from '@angular/core';
import {AnalyticsQuery} from '../../services/analyticsquery.service';
import {DataService} from '../../services/Data.service';
import {ChartService} from '../../services/Chart.service';
import {Helper} from '../../Utils/Helper';

import {OrganicChannel} from '../../models/OrganicChannel.data';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'traffic',
  templateUrl: '../pages/traffic.component.html',
})

export class TrafficComponent implements AfterViewInit {
    @Input()  current_month;  
    @Input()  compare_month;
    @Input() compare_index_month;
    @Input()  first_year;
    @Input()  second_year;
    @Input() generateReport;
    @Input() generateOldReport:Subject<boolean>;
    @Output() currentLoad:EventEmitter<any>;
   
    private percentage;
    public pie_chart;
    
    constructor(private query:AnalyticsQuery,public dataset:DataService,public helper:Helper,private chart:ChartService) {
        this.currentLoad= new EventEmitter<any>(); 
        //Legend text for pie chart 
        this.pie_chart=this.chart.setChartType("pieChart").addRender(function(e){
            d3.selectAll(".nv-legend text")[0].forEach(function(d){
                var u=d3.select(d).data()[0];
                if(u.value!=undefined && u.key!= undefined){
                 //set the new data in the innerhtml
                     d3.select(d).html(u.key + " - " + u.value);
                 }
            }); 
        }).getChart();
    }
    
    ngAfterViewInit(){
        this.generateReport.subscribe(v => {
            if(v===true){
                this.getTrafficData();
            }
        });
        this.generateOldReport.subscribe(v => {
            if(v===true){
                this.getLastTrafficData();
            }
        });
    }
    
    getTrafficData(){
        this.query.getMonthlyTraffic().then((result)=>{
            this.dataset.setCurrentData("traffic",result["current"]);
            this.dataset.setCompareData("traffic",result["compare"]);
            //Set Last Year Once all component loaded
            this.currentLoad.emit({"component":"traffic","loaded":true});
        });
    }
    
    getLastTrafficData(){
        this.query.getMonthlyTraffic().then((result)=>{
            this.dataset.setLastYear("traffic",result["current"]);
            // this.dataset.setCompareData("traffic",result["compare"]);
        });
    }
}