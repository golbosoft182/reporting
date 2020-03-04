import { Injectable } from '@angular/core';

@Injectable()
export class ChartService{
    private default:any;
    private chart:any;
    constructor(){
      this.default={
        height: 400,
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        duration: 700,
        labelThreshold: 0.8,
        labelSunbeamLayout: true,
        showValues: true,
        showLabels:true,
        transition:100,
        ease:"bounce",
        legend: {
            margin: {
                top: 5,
                right: 10,
                bottom: 5,
                left: 35
            },
            padding:150,
            rightAlign: false,
        }
      };
      this.chart=Object.assign({},this.default);

    }

    setChartOption(obj){
        this.chart=Object.assign(this.chart,obj);
        return this;
    }

    setChartType(type:string){
        this.chart.type=type;
        return this;
    }

    setXaxis(xAxis){
        this.chart.xAxis=xAxis;
        return this;
    }

    setYAxis(yAxis){
        this.chart.yAxis=yAxis;
        return this;
    }

    setColor(colors){
        this.chart.colors=colors;
        return this;
    }

    setPieRender(){
        this.chart.pie={
            dispatch:{
                renderEnd:function(e){

                }
            }
        };
        return this;
    }

    addStatechange(state:any){
        this.chart.dispatch={"stateChange":state};
        return this;
    }

    addRender(render:any){
        this.chart.dispatch={"renderEnd":render};
        return this;
    }

    addCallback(func:any){
        this.chart.callback=func;
        return this;
    }

    getChart():any{
        var return_value={"chart":this.chart};
        this.chart=Object.assign({},this.default);
        return return_value;
    }

    updateChart():any{
        // this.chart.
        return this;
    }

}
