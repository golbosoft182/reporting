import { Component, OnInit, Input } from '@angular/core';

import {AnalyticsQuery} from '../../services/analyticsquery.service';
import {DataService} from '../../services/Data.service';
import {ChartService} from '../../services/Chart.service';
import {Helper} from '../../Utils/Helper';
import {WebCEOService} from '../../services/webceo.service';

import {OrganicChannel} from '../../models/OrganicChannel.data';
import {Subject} from 'rxjs/Subject';

declare let d3: any;
declare let nvd3: any;

@Component({
  selector: 'webCeo',
  templateUrl: '../pages/webceo.component.html',
})

export class WebCEOComponent implements OnInit {
    @Input()  current_month;  
    @Input()  compare_month;
    @Input()  rankingAccount;
    @Input() generateReport:Subject<boolean>;
    @Input() generateOldReport:Subject<boolean>;
    
    private success:string;
    private code:string;
    
    
    constructor(private query:AnalyticsQuery,public dataset:DataService,public helper:Helper,private chart:ChartService,private webceo:WebCEOService) {
        
    }
    
    ngOnInit(){
      this.generateReport.subscribe(v => {
          if(v===true){
            this.setWebCEOData();
          }
      });
    }
    
    setWebCEOData(){
        let top_keyword=[];
        let keyword=[];
        this.webceo.getProject(this.rankingAccount).then((item)=>{
            var json=JSON.parse(item["_body"]);
            var count=0;
            json[0]["data"]["ranking_data"].forEach((item)=>{
                count++;
                var current_scan_history=item.positions[0].scan_history[1];
                var compare_scan_history=item.positions[0].scan_history[0];
                try{
                    var current_pos=current_scan_history.pos;
                    var previous_pos=compare_scan_history.pos;
                    var place_pos=0;
                    var diff=current_pos-previous_pos;
                    
                    //For mobile data 
                    var mob_current_pos=item.positions[1].scan_history[1].pos;
                    var mob_previous_pos=item.positions[1].scan_history[0].pos;
                    var mob_diff=mob_current_pos-mob_previous_pos;
                    var mob_place_pos=0;
                 
                    if(diff==0){previous_pos="";}
                    else if(current_pos!=0){
                         var sign=this.helper.getReturnSymbol(diff);
                         if(sign=="fa-arrow-up"){diff=-diff;}
                    }
                    else{
                        sign="fa-arrow-down";
                    }
                    
                    if(mob_diff==0){mob_current_pos="";}
                    else if(mob_current_pos!=0){
                         var sign_mob=this.helper.getReturnSymbol(mob_diff);
                         if(sign_mob=="fa-arrow-up"){mob_diff=-mob_diff;}
                    }
                    else{
                        sign_mob="fa-arrow-down";
                    }
                    
            //Logic for negative symbol in difference value 
                     if(sign=="fa-arrow-down"){
                         if(diff>0)
                         diff=-diff;
                     }
                     if(sign_mob=="fa-arrow-down"){
                         if(mob_diff>0)
                         mob_diff=-mob_diff;
                     }
            //Logic Ends here 
                    
                    
                    var obj={"key":item.kw,
                        "organic_data":current_pos,
                        "difference_value":diff,
                        "difference":sign,
                        "pages":this.helper.getPageDepth(current_pos),
                        "mobile":mob_current_pos,
                        "mobile_difference":mob_diff,
                        "mobile_sign":sign_mob,
                        "mobile_pages":this.helper.getPageDepth(mob_current_pos),   
                    };
                    //Checking for whether the keyword is from mobile or desktop
                    var obj_desktop={"key":item.kw,"organic_data":current_pos,
                        "difference_value":diff,
                        "difference":sign,
                        "flag":"fa-desktop fa-0.5x",
                        "location":item.local_searches[0].target_location,
                        "source":item.positions[0].se
                    }
                    
                    var obj_mobile={"key":item.kw,"organic_data":mob_current_pos,
                        "difference_value":mob_diff,
                        "difference":sign_mob,
                        "flag":"fa-mobile fa-1x",
                        "location":item.local_searches[0].target_location,
                        "source":item.positions[1].se
                    }
                    if(sign=="fa-arrow-up"){
                        top_keyword.push(obj_desktop);
                    }
                    if(sign_mob=="fa-arrow-up"){
                        top_keyword.push(obj_mobile);
                    }
                    //Logic ends here for whether the keyword is more from mobile or desktop     
             
                    if("place" in current_scan_history){
                      obj["place_current"]=current_scan_history.place.pos;
                        obj["place_current_pos"]=current_scan_history.place;
                     
                    }
                    if("place" in compare_scan_history){
                        var compare_place_pos=compare_scan_history.place.pos;
                        diff=current_scan_history-compare_scan_history.place;
                        sign=this.helper.getReturnSymbol(diff);
                        if(diff==0){
                            compare_place_pos="";
                        }
                        else if(current_scan_history!=0){
                            var sign=this.helper.getReturnSymbol(diff);
                            if(sign=="fa-arrow-up"){
                                diff=-diff;
                            }
                        }
                        else{
                            sign="fa-arrow-down";
                        }
                        if(sign=="fa-arrow-up"){
                            diff=-diff;
                        }
                        obj["place"]=true;
                        obj["place_difference_value"]=sign;
                        obj["place_difference"]=diff;
                        obj["place_pages"]=this.helper.getPageDepth(obj["place_current_pos"]);
                    }
                    keyword.push(obj);
                    
                }
                catch(e){
                    this.success="alert alert-danger";
                    this.code="Please check with webceo provider and consult with developer";
                }
                
            });
            
            keyword.sort(function(a,b){
                if(a.pages == 0){
                  return 1;
                }
                else if(b.pages == 0){
                  return -1;
                }
                else if(a.pages == b.pages){
                  return 0;
                }
                else {
                  return a.pages < b.pages ? -1 : 1;
                }
            });
            
            top_keyword.sort(function (a, b) {
                return b.difference_value-a.difference_value;
            });
            
            top_keyword=top_keyword.slice(0, 5);
            
            this.dataset.setCurrentData("keyword",keyword);
            this.dataset.setCurrentData("top_keyword",top_keyword);
        });
        // let data = d3.range(10).map(Math.random).sort(d3.descending);
    }
    
    
}