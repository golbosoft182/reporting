import { Injectable } from '@angular/core';

@Injectable()
export class Helper{
    calculatePercentage(new_value,old_value):any{
        let percentage;
        if(old_value!=null&&new_value!=null){
            if(new_value!=0&&old_value!=0){
                percentage=new_value-old_value;
                percentage=percentage/old_value*100;
            }
            else if(new_value>0&&old_value==0){
                percentage=100;
            }
            else if(old_value>0&&new_value==0){
                percentage=-100;
            }
            if(!isNaN(percentage)){percentage=Math.round(percentage * 100) / 100;} else{percentage=0;}

            return percentage;
        }
        else if(new_value>0&&old_value==null){
            percentage=100;
            return percentage;
        }
        else if(old_value>0&&new_value==null){
            percentage=-100;
            return percentage;
        }
        else{
            return 0;
        }
    }

    getMonthShortName(month_name){
      let months = {
        'January':"Jan",
        'February':"Feb",
        'March':"Mar",
        'April':"Apr",
        'May':"May",
        'June':"Jun",
        'July':"Jul",
        'August':"Aug",
        'September':"Sept",
        'October':"Oct",
        'November':"Nov",
        'December':"Dec"
      };
      return months[month_name];
    }

    getPositivePercentage(new_value,old_value):any{
        let value=this.calculatePercentage(Number(new_value),Number(old_value));
        if(value!==0){
            value=Math.abs(value);
        }
        else{
            value="No Change";
        }
        return value;
    }

    getSymbol(new_value,old_value,name=""):string{
        let result;
        let value=this.calculatePercentage(Number(new_value),Number(old_value));
        if(name!=""){
            // console.log(old_value);
        }
        if(value>0){result="fa-arrow-up arrow";}
        else if(value<0){result="fa-arrow-down arrow";}
        else{result="no-change";}
        return result;
    }

    getEventSymbol(new_value,old_value):string{
        let result;
        let value=this.calculatePercentage(Number(new_value),Number(old_value));

        if(value>0){result="fa-arrow-up arrow";}
        else if(value<0){result="fa-arrow-down arrow";}
        else{result="no-change";}
        return result;
    }

    getReturnSymbol(value):string{
        var result;
        if(value<0){result="fa-arrow-up";}
        else if(value>0){result="fa-arrow-down";}
        else{result="";}
        return result;
    }

    //create good logic through math, improvision needed
    getPageDepth(current_pos):number{
        var pages;
        if(current_pos==0){pages=0;}
        else if(current_pos<=10&&current_pos>0){pages=1;}
        else if(current_pos<=20){pages=2;}
        else if(current_pos<=30){pages=3;}
        else if(current_pos<=40){pages=4;}
        else{pages=5;}
        return pages;
    }

    getMonthString(date:string):string{
        var month=["January","February","March","April","May","June","July","August","September","October","November","December"]
        return month[new Date(date).getMonth()];
    }

    getName(date):number{
        return new Date(date).getFullYear();
    }

    getPreviousYearDates(start_date:string):string{
        var result=[];
        var date=new Date(start_date);
        date.setFullYear(date.getFullYear()-1);
        console.log(date);
        return date.toISOString().slice(0,10);
    }

    getOrganicData(data){
        var result=data.filter(item=>{
            if(item.key==="Organic Search"){
                return true;
            }
        }).map(item=>({"value":item.value}));
        if(result.length==0){
            result=[{"value":0}];
        }
        return result;
    }

    getSocialPercentage(key){
        console.log(key);
    }

    calculateGoalConversionRate(currentValue,compareValue,totalSessionCurrent,totalSessionCompare){
        if(currentValue!= null && totalSessionCurrent!=null){
            var currentPercentage=(currentValue/totalSessionCurrent)*100;
        }
        else{
            var currentPercentage=0;
        }
        if(compareValue!=null && totalSessionCompare!=null){
            var comparePercentage=(compareValue/totalSessionCompare)*100;
        }
        else{
            var comparePercentage=0;
        }
        return this.getPositivePercentage(currentPercentage,comparePercentage);
    }

    getHelpText(channel_name):string{
        let arr=[{
                name:"Direct",
                text:"URL was typed directly into the search bar"},
            {
                name:"Organic Search",
                text:"Site was found using a search engine by users"
            },
            {
                name:"Paid Search",
                text:"Site was found by an ad on a search engine"
            },
            {
                name:"Referral",
                text:"method of reporting visits that came to your site from sources outside of its search engine"
            },
            {
                name:"Social",
                text:"Site was accessed directly from one of your social media accounts"
            }

        ];
        var obj=arr.filter(function(val){
           return val.name===channel_name;
        });
        let str="";
        if(obj.length>0){
            str=obj[0]["text"];
        }
        return str;
    }

}

