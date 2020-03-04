export class Request{
    private viewId:number;
    public metrics:Array<any>;
    private pageSize:number;
    private includeEmptyRows:boolean;
    public dimensions:Array<any>;
    public dateRanges:Array<any>;
    
    constructor(){
        this.viewId=0;
        this.metrics=new Array<any>();
        this.dimensions=new Array<any>();
        this.dateRanges=new Array<any>();
        this.dateRanges[0]={};
        this.dateRanges[1]={};
    }
    
    setViewId(viewId:number){
        this.viewId=viewId;
    }
    
    setPageSize(size:number){
        this.pageSize=size;
    }
    
    setEmptyRows(empty_rows:boolean){
        this.includeEmptyRows=empty_rows;
    }
    
    setMetrics(metrics:Array<any>){
        this.metrics=metrics;
    }
    
    setDimensions(dimensions:Array<any>){
        this.dimensions=dimensions;
    }
}