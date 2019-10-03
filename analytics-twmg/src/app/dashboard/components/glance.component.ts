import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

import {AnalyticsQuery} from '../../services/analyticsquery.service';
import {DataService} from '../../services/Data.service';
import {ChartService} from '../../services/Chart.service';
import {Helper} from '../../Utils/Helper';

import {Model} from '../../models/Model.data';
import {OrganicChannel} from '../../models/OrganicChannel.data';
import {Subject} from 'rxjs/Subject';

declare let d3: any;
declare let nvd3: any;

@Component({
  selector: 'glance',
  templateUrl: '../pages/glance.component.html',
})

export class GlanceComponent implements OnInit {
    @Input()  current_month;  
    @Input()  compare_month;
    @Input() compare_index_month;
    @Input()  first_year;
    @Input()  second_year;
    @Input() generateReport:Subject<boolean>;
    @Input() generateOldReport:Subject<boolean>;
    @Output() currentLoad:EventEmitter<any>;
   
    private glanceLoad;
    public events;
    public eventIndex;
    constructor(private query:AnalyticsQuery,public dataset:DataService,public helper:Helper){
        this.glanceLoad=new EventEmitter();
        this.eventIndex={};
        this.currentLoad=new EventEmitter();
    }
    
    ngOnInit(){
        this.generateReport.subscribe((v)=>{
            if (v === true) {
                this.getGlanceData();
            }
        });
        this.generateOldReport.subscribe((v)=>{
            if (v === true) {
                this.getLastGlanceData();
            }
        });
    }
    
    getGlanceData() {
        var promises = [this.query.getChannel(), this.query.getMonthlyVisit(), this.query.getBounceRate(),
            this.query.getAllGoalCompletion(), this.query.getEcommerceData(),this.query.getAllEvents()];
        Promise.all(promises).then((result)=>{
            this.dataset.setCurrentData("channels", result[0]["current"]);
            this.dataset.setCompareData("channels", result[0]["compare"]);
            this.dataset.setCurrentData("organic", new OrganicChannel(this.current_month + " " + this.first_year, "#2e86bf", this.helper.getOrganicData(result[0]["current"])));
            this.dataset.setCompareData("organic", new OrganicChannel(this.compare_month + " " + (this.second_year), "#2ebfac", this.helper.getOrganicData(result[0]["compare"])));
            this.dataset.setCurrentData("visits", result[1]["current"]);
            this.dataset.setCompareData("visits", result[1]["compare"]);
            this.dataset.setCurrentData("bounceRate", result[2]["current"]);
            this.dataset.setCompareData("bounceRate", result[2]["compare"]);
            this.dataset.setCurrentData("goalCompletion", result[3]["current"]["goals"]);
            this.dataset.setCompareData("goalCompletion", result[3]["compare"]["goals"]);
            this.dataset.setCurrentData("sessions", result[3]["current"]["sessions"]);
            this.dataset.setCompareData("sessions", result[3]["compare"]["sessions"]);
            this.dataset.setCurrentData("goalConversionRate", (this.dataset.getCurrentData("goalCompletion") / this.dataset.getCurrentData("sessions")) * 100);
            this.dataset.setCompareData("goalConversionRate", (this.dataset.getComparedData("goalCompletion") / this.dataset.getComparedData("sessions")) * 100);
            this.dataset.setCurrentData("goalConversionRate", this.dataset.getCurrentData("goalConversionRate").toFixed(1));
            this.dataset.setCompareData("goalConversionRate", this.dataset.getComparedData("goalConversionRate").toFixed(1));
            //transaction
            this.dataset.setCurrentData("transactions", result[4]["current"]["transactions"]?Number(result[4]["current"]["transactions"]):0);
            this.dataset.setCompareData("transactions", result[4]["compare"]["transactions"]?Number(result[4]["current"]["transactions"]):0);
            
            this.dataset.setCurrentData("revenue", result[4]["current"]["revenue"]?Number(Number(result[4]["current"]["revenue"]).toFixed(2)):0);
            this.dataset.setCompareData("revenue", result[4]["current"]["revenue"]?Number(Number(result[4]["compare"]["revenue"]).toFixed(2)):0);
            
            this.dataset.setCurrentData("events",result[5]["current"]);
            this.dataset.setCompareData("events",result[5]["compare"]);
            this.setEvent();
            this.currentLoad.emit({"component":"glance","loaded":true});
            // this.data=dataset;
        })["catch"](function (e) {
            throw e;
        });
    }
    
    getLastGlanceData(){
        this.query.getChannel().then((item)=>{
            this.dataset.setLastYear("channels", item["current"]);
            this.dataset.setLastYear("organic", new OrganicChannel(this.current_month + (Number(this.second_year) - 1).toString(), "#0000A0", this.helper.getOrganicData(item["current"])));
        });
        this.query.getMonthlyVisit().then((item)=>{
            this.dataset.setLastYear("visits", item["current"]);
        });
        this.query.getBounceRate().then((item)=>{
            this.dataset.setLastYear("bounceRate", item["current"]);
        });
        this.query.getMonthlyTraffic().then((item)=>{
            this.dataset.setLastYear("traffic", item["current"]);
        });
        this.query.getAllGoalCompletion().then((item)=>{
            let ConversionRate;
            if (item["current"]["goals"]) {
                this.dataset.setLastYear("goalCompletion", item["current"]["goals"]);
            }
            else{
                this.dataset.setLastYear("goalCompletion",0);
            }
            this.dataset.setLastYear("sessions", item["current"]["sessions"]);
            ConversionRate = (item["current"]["goals"] / item["current"]["sessions"]) * 100;
            this.dataset.setLastYear("goalConversionRate", ConversionRate.toFixed(1));
        });
        this.query.getAllEvents().then((item)=>{
            this.dataset.setLastYear("events",item["current"]);
        });
    }
    
    setEvent(){
        this.events=new Array<Model>();
        this.events = this.dataset.getCurrentData("events").map(val => {
            return this.dataset.getComparedData("events").filter(v => {
                    return v.key === val.key;
                }).map(item=>({"key":val.key,"current":val.value,"compare":item.value}))[0];
        }).filter(item=>{
           if(item){
               return item;
           } 
        });
        if(this.events.length>0){
            this.siteEventUpdate(0);
        }
    }
    
    siteEventUpdate(value){
        this.eventIndex["currentEvent"]=this.events[value].current;
        this.eventIndex["compareEvent"]=this.events[value].compare;
        this.eventIndex["eventCompare"]=this.helper.calculatePercentage(this.eventIndex.currentEvent,this.eventIndex.compareEvent);
        this.eventIndex["symbol"]=this.helper.getSymbol(this.eventIndex.currentEvent,this.eventIndex.compareEvent);
        this.eventIndex["eventCompare"]=Math.abs(this.eventIndex.eventCompare);
    }
}