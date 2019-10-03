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
  selector: 'organic',
  templateUrl: '../pages/organic.component.html',
})

export class OrganicComponent implements AfterViewInit {
    @Input()  current_month;  
    @Input()  compare_month;
    @Input() compare_index_month;
    @Input()  first_year;
    @Input()  second_year;
    @Input() generateReport:Subject<boolean>;
    @Input() changeOrganic:Subject<boolean>;
    private data;
    public bar_graph:any;
    public organic;
    
    constructor(private query:AnalyticsQuery,public dataset:DataService,public helper:Helper,private chart:ChartService) {
        
        //graph data initialization
        this.bar_graph=this.chart.setChartOption({showXAxis:false,
            noData:true,stacked:false,showControls:false, 
            yAxis: { axisLabel: "Value",ticks: 5},showValues:true});
        this.bar_graph=this.bar_graph.setChartType("multiBarHorizontalChart").
        setXaxis({showMaxMin: false}).
        setYAxis({ axisLabel: 'Values',
                    tickFormat: function(d){
                        return d3.format(',.0f')(d);
                    }}).getChart();
        
    }
    
    ngAfterViewInit(){
      this.generateReport.subscribe(v => {
          if(v===true){
            this.setOrganic();
            //Set Last Year Once all component loaded
          }
      });
      this.changeOrganic.subscribe(v => {
          if(v===true){
            this.setOrganic();
            //Set Last Year Once all component loaded
          }
      });
    }
    
    setOrganic(){
      this.organic=[this.dataset.getCurrentData("organic"),this.dataset.getComparedData("organic")?this.dataset.getComparedData("organic"):new OrganicChannel(this.compare_month+" "+this.second_year,"#000",[])];
      let current_value=this.dataset.getCurrentData("organic")?this.dataset.getCurrentData("organic").values[0].value:[];
      let compare_value=this.dataset.getComparedData("organic")?this.dataset.getComparedData("organic").values[0].value:[];
      var max_value=Math.max(current_value,compare_value);
      this.bar_graph.chart.forceY=[0,max_value];
    }
}