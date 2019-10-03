import { Component, OnInit, Input,Output,EventEmitter,AfterViewInit } from '@angular/core';

import {AnalyticsQuery} from '../../services/analyticsquery.service';
import {DataService} from '../../services/Data.service';
import {Helper} from '../../Utils/Helper';

import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'pages',
  templateUrl: '../pages/pages.component.html',
})

export class PagesComponent implements AfterViewInit {
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
            this.loadTopPagesData();
          }
      });
    }
    
    loadTopPagesData(){
        this.query.getTopPages().then(result=>{
            console.log(result);
            this.dataset.setCurrentData("top_pages",result);
            this.currentLoad.emit({"component":"pages","loaded":true});
        });
    }
}