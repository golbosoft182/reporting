// export class City{
//     key:string;
//     visits:number;
//     goalAchieved:number;
//     constructor(key,visits,goalAchieved){
//         this.key=key;
//         this.visits=visits;
//         this.goalAchieved=goalAchieved;
//     }
// }


export class Goal{
    goalCompletionNumber:number;
    goalLocation:string;
    
    constructor(goalCompletionNumber,goalLocation){
        this.goalCompletionNumber=goalCompletionNumber;
        this.goalLocation=goalLocation;
        
    }
    
}