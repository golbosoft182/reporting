import { NgZone,Injectable } from '@angular/core';

@Injectable()
export class DataService{
    public current;
    private compare;
    private last_year;
    private current_index;
    public comments;
    
    constructor(){
        this.current={};
        this.compare={};
        this.last_year={};
        this.current_index=0;
        this.comments={};    
    }
    
    setCurrentData(key:string,value:any){
        this.current[key]=value;
    }
    
    setCompareData(key:string,value:any,index:any=0){
        this.compare[key]=value;
    }
    
    setLastYear(key:string,value:any){
        this.last_year[key]=value;
    }
    
    setCurrentIndex(index){
        this.current_index=index;
    }
    
    setComment(key:string,comment:string){
        this.comments[key]=comment;
    }
    
    getCurrentData(key:string){
        return this.current[key];
    }
    
    getComparedData(key:string){
        if(this.current_index===0){
            return this.compare[key];
        }
        else{
            return this.last_year[key];
        }
    }
    
    getComment(key:string){
        return this.comments[key];
    }
    
    getAllCurrentData(){
        return this.current;
    }
    
    getAllCompareData(){
        return this.compare;
    }
    
    getLastYearData(){
        return this.last_year;
    }
    
    getAllComment(){
        return this.comments;
    }
    
}