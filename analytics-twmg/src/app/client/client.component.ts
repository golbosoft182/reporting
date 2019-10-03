import { Component, Input, OnInit,ViewEncapsulation, ViewChild,ViewChildren } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }                 from '@angular/common';
import * as jsPDF from 'jspdf';

//services
import {ClientService} from './client.service';
import {ChartService} from '../services/Chart.service';
import {Helper} from '../Utils/Helper';
import {Model} from '../models/Model.data';
// d3 and nvd3 should be included somewhere
import 'd3';
import 'nvd3';

@Component({
  selector: 'app-root',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css',
  '../../../node_modules/nvd3/build/nv.d3.min.css'],
  encapsulation:ViewEncapsulation.None
})

export class ClientComponent implements OnInit {
  private bar_graph:any;
  private pie_chart:any; 
  private donut_chart:any;
  private compare:any;
  private organic:any;
  public events:any;
  public client_name:string;
  private month:any;
  private data:any;
  private compare_index_month:string;
  public SiteGoalIndex:number;
  private symbol:any;
  private social;
  private percentage;
  // data;
  public comment={};
  public colour:any;

  private eventIndex:any;
  private goalEventIndex:any;
  private goalChannelUpdate:any;
  private retrievedData:any;
  public current_month:string;
  public compare_month:string;
  
  private second_year:any;
  public first_year_date:string;
  public second_year_date:string;
  
  
  public isValid=false;
  @ViewChild('nvd3') nvd3;
  
  public client_data={};
  constructor(private route: ActivatedRoute,private location: Location,private client_service:ClientService,private helper:Helper,private chart:ChartService){
      this.symbol={};
      this.percentage={};
      this.retrievedData=[];
      this.bar_graph=this.chart.setChartOption({height: 450,
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                showControls: false,
                showValues: true,
                duration: 500,
                xAxis: {
                    showMaxMin: false
                },
                yAxis: {
                    axisLabel: 'Values',
                    tickFormat: function(d){
                        return d3.format(',.2f')(d);
                    }
                }});
              
      this.bar_graph=this.bar_graph.setChartType("multiBarHorizontalChart").getChart();
      this.pie_chart=this.chart.setChartOption({showLegend:false}).setChartType("pieChart").setColor(this.colour).getChart();
      this.donut_chart=this.chart.setChartOption({showLegend:false}).setChartOption({donut:true,pie: {startAngle:null,
                  endAngle: null}}).setColor(this.colour);
      this.donut_chart=this.donut_chart.setChartOption({showLegend:false}).setChartType("pieChart").setColor(this.colour).getChart();
      this.data={};
      this.organic=[];
      this.eventIndex={};
      this.goalEventIndex={};
      this.goalChannelUpdate={};
      this.first_year_date="";
      this.second_year_date="";
      this.month=["January","February","March","April","May","June","July","August","September",
                   "October","November","December"];
      var self=this;     
      setTimeout(function(){
          var max_value=Math.max(self.data.current.organic.values[0].value,self.compare.organic.values[0].value);
      },1000);
      // this.nvd3.changes.subscribe((r) => { 
      //   console.log(r);
      //     // var max_value=Math.max(this.data.current.organic.values[0].value,this.compare.organic.values[0].value);
      //     // r.chart.forceY([0,max_value]);
      // });
  }
  
  setColor(color){
      return {
        'color':color
      };
  }
  
  ngOnInit(): void {
     this.route.params.subscribe((params: Params) => {
        let id = params['id'];
        this.client_service.getAllData(id).then((res)=>{
            //Data coming from database 
          var request_data=JSON.parse(res._body);
          console.log(request_data);
          this.isValid=true;
          this.client_data["client_name"]=request_data.client_name;
          this.client_data["package"]=request_data.data.package;
          this.client_data["generated_date"]=request_data.created_at;
          this.client_data["current_date_range"]=this.getDateRange(request_data.current_date,request_data.end_current_date);
          this.client_data["compare_date_range"]=this.getDateRange(request_data.previous_date,request_data.end_previous_date);
          this.current_month=this.getMonth(request_data.current_date);
          this.compare_month=this.getMonth(request_data.previous_date);
          // console.log(this.second_year_date);
          // this.first_year_date=this.first_year_date;
          // this.second_year_date=this.second_year_date;
          this.compare_index_month=this.compare_month;
          this.data=request_data.data;
          this.compare=request_data.data.compare;
          this.comment=this.data["comment"];
          this.data.current["top_cities"]=this.data.current["top_cities"].filter((item)=>{
              return item.key!=="Surabaya";
          });
          this.data.current["transactions"]=!this.data.current["transactions"]?0:Number(this.data.current["transactions"]);
          this.data.compare["transactions"]=!this.data.compare["transactions"]?0:Number(this.data.compare["transactions"]);
          this.data.last_year["transactions"]=!this.data.last_year["transactions"]?0:Number(this.data.last_year["transactions"]);
          this.data.current["revenue"]=!this.data.current["revenue"]?0:Number(this.data.current["revenue"]);
          this.data.compare["revenue"]=!this.data.compare["revenue"]?0:Number(this.data.compare["revenue"]);
          this.data.last_year["revenue"]=!this.data.last_year["revenue"]?0:Number(this.data.last_year["revenue"]);
          //Set date
          this.setYear(request_data.current_date,request_data.previous_date);
           //event index for two binding
          this.setEvent();
          //organic index for two binding
          this.setOrganic();
          this.goalEventUpdate(0);
          this.goalViaChannelUpdate(1);
          this.setPercentageandSymbol();
          //change bar graph as comparing max value from two organic series.
        },(err)=>{
          console.log(err);
        });
      });
  }
  
  getDateRange(current,compare){
    var current_date=new Date(current);
    var compare_date=new Date(compare);
    var c_date=current_date.getDate()+" "+this.month[current_date.getMonth()]+" "+current_date.getFullYear();
    var com_date=compare_date.getDate()+" "+this.month[compare_date.getMonth()]+" "+compare_date.getFullYear();
    this.second_year=Number(compare_date.getFullYear().toString());
    
    
    return c_date+" To "+com_date;
  }
  
  setYear(current,compare){
    var current_date=new Date(current);
    var compare_date=new Date(compare);
    this.first_year_date=current_date.getFullYear().toString();
    this.second_year_date=compare_date.getFullYear().toString();
  }
  
  getMonth(date){
    var current_date=new Date(date);
    return this.month[current_date.getMonth()];
  }
  
  siteEventUpdate(value){
      this.eventIndex["currentEvent"]=this.events[value].current;
      this.eventIndex["compareEvent"]=this.events[value].compare;
      this.eventIndex["eventCompare"]=this.helper.calculatePercentage(this.eventIndex.currentEvent,this.eventIndex.compareEvent);
      this.eventIndex["symbol"]=this.helper.getEventSymbol(this.eventIndex.currentEvent,this.eventIndex.eventCompare);
      if(this.eventIndex["eventCompare"]>0){this.eventIndex["symbol"]="fa-arrow-up arrow";}
      else if(this.eventIndex["eventCompare"]<0){this.eventIndex["symbol"]="fa-arrow-down arrow";}
      else{this.eventIndex["symbol"]="no-change";}
      this.eventIndex["eventCompare"]=Math.abs(this.eventIndex["eventCompare"]);
  }
  
  goalEventUpdate(value){
    // this.goalEventIndex["currentVal"]=this.data.current.goalCompletionByLocation[value];
    // this.goalEventIndex["compareVal"]=this.data.compare.goalCompletionByLocation[value];
    // this.goalEventIndex["goalLocationCompare"]=this.helper.getPositivePercentage(this.eventIndex.currentEventGoalNumber,this.eventIndex.compareEventGoalNumber);
    // this.goalEventIndex["symbol"]=this.helper.getSymbol(this.eventIndex.currentEvent,this.eventIndex.compareEvent);
  }
  
  goalViaChannelUpdate(id){
    this.goalChannelUpdate=this.data["listofGoalSelection"];
    this.retrievedData=this.data.current.goalEvents.filter(goal=>goal[0].name==="goal"+id+"Completions")[0][1];
    this.retrievedData["currentTotal"]=this.data.current.goalEvents.filter(goal=>goal[0].name==="goal"+id+"Completions")[0][2];
    this.retrievedData["compareTotal"]=this.data.compare.goalEvent.filter(goal=>goal[0].name==="goal"+id+"Completions")[0][2];
  }
  
  setEvent(){
      this.events=new Array<Model>();
      this.events = this.data.current.events.map(val => {
          return this.compare.events.filter(v => {
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
  
  setOrganic(){
      this.organic=[this.data.current.organic,this.compare.organic];
      var max_value=Math.max(this.data.current.organic.values[0].value,this.compare.organic.values[0].value);
      this.bar_graph.chart.forceY=[0,max_value];
  }
  
  toggleMonth(month){
    // console.log();/**/
      if(month==this.compare_month){
          this.compare=this.data.compare;
          // console.log(this.compare.organic.values[0].series);
          this.compare_index_month=this.compare_month;
          this.second_year_date=(this.second_year).toString();
      }
      else if(month==this.current_month){
          this.compare=this.data.last_year;
        //   console.log(this.checkData(this.compare.visits));
        //   console.log(this.data.last_year);
          if(this.checkData(this.compare.visits)===false){
              this.compare.visits=0;
          }
          if(this.checkData(this.compare.bounceRate)===false){
              this.compare.bounceRate=0;
          }
          if(this.checkData(this.compare.eventIndex)===false){
              this.compare.eventIndex=0;
          }
          this.compare_index_month=this.current_month;
          this.second_year_date=(Number(this.first_year_date)-1).toString();
          
      }
      this.setEvent();
      this.setOrganic();
      //change bar graph as comparing max value from two organic series.
      // var max_value=Math.max(this.data.current.organic.values[0].value,this.compare.organic.values[0].value);
      // this.nvd3.chart.forceY([0,max_value]);
      
    }
    checkData(data){
        return(data!=null);
    }
    
    setPercentageandSymbol(){
        this.social=this.data.current.social.map(val=>{
            return this.compare.social.filter(v=>{
                return v.name==val.name;
            }).map(item=>({"key":val.name,"current":val.value,"compare":item.value}))[0];
        });
       
        this.social.forEach(item=>{
           this.percentage[item.key]=this.helper.getPositivePercentage(item.current,item.compare); 
           this.symbol[item.key]=this.helper.getSymbol(item.current,item.compare);
        });
    }
    
//      public downloadPDF(){
//     let doc=new jsPDF();
//     let specialElementHandlers ={
//       '#editor': function(element, renderer){
//         return true;
//       }
//     }
    
//     let content=this.content.nativeElement;
//     doc.fromHTML(content.innerHTML,10,10,{
//       'width': 400,
//       'elementHandlers':specialElementHandlers
//     });
    
//     doc.save("test.pdf");
    
//   }
    
    
  
}
