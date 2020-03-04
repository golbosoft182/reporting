import { Component, OnInit, Input,Output,EventEmitter,AfterViewInit } from '@angular/core';

import {AnalyticsQuery} from '../../services/analyticsquery.service';
import {DataService} from '../../services/Data.service';
import {Helper} from '../../Utils/Helper';

import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'cities',
  templateUrl: '../pages/cities.component.html',
})

export class CityComponent implements AfterViewInit {
    @Input()  current_month;  
    @Input()  compare_month;
    @Input()  first_year;
    @Input()  second_year;
    @Input() generateReport:Subject<boolean>;
    @Output() currentLoad:EventEmitter<any>;

    constructor(private query:AnalyticsQuery,public dataset:DataService,public helper:Helper) {
      this.currentLoad=new EventEmitter<any>();
    }
    
    ngAfterViewInit(){
      this.generateReport.subscribe(v => {
          if(v===true){
            this.loadTopCitiesData();
          }
      });
    }
    
    loadTopCitiesData(){
        this.query.getTopCities().then(result=>{
            this.dataset.setCurrentData("top_cities",result);
            //Set Last Year Once all component loaded
            this.currentLoad.emit({"component":"cities","loaded":true});
        });
    }
    
    loadClientData(){
        
    }
    
}