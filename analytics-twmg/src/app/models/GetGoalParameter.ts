

export class GetGoalParameter{
   
    newVisits:number;
    returnVisits:number;
    totalVisit:number;
    userType:string;
    total:number;
   
    constructor(userType,newVisits,returnVisits){
        this.userType=userType;
        this.newVisits=newVisits;
        this.returnVisits=returnVisits;
        this.total=Number(this.newVisits)+Number(this.returnVisits);
    }
    
}