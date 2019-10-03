import { NgZone,Injectable } from '@angular/core';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Http }       from '@angular/http';
declare var gapi: any;

@Injectable()
export class AnalyticsService{
    instance;
    clientLoaded:boolean;
    authLoaded:boolean;
    GoogleAuth:any;
    initObj={
        'clientId':'991428848383-181dkg50fbj8vh8jbjadhgodvmbof1e5.apps.googleusercontent.com',
        'scope':'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit https://www.googleapis.com/auth/plus.login',
    };
    constructor(private http: Http,private zone: NgZone) {
       
    }
   
    loadClient(): Promise<any> {
         return new Promise((resolve, reject) => {
             this.zone.run(() => {
                    gapi.load('client:auth2', {
                        callback: resolve,
                        onerror: reject,
                        timeout: 1000, // 5 seconds.
                        ontimeout: reject
                    });
             });
        });
    }
    
    initAuth(){
        gapi.auth2.init(this.initObj);
        this.GoogleAuth=gapi.auth2.getAuthInstance();
    }
    
    authUser():boolean{
        return this.GoogleAuth.isSignedIn.get();
    }
    
    authorize():Promise<any>{
        return new Promise((resolve,reject)=>{
            gapi.auth2.authorize(this.initObj,function(res){
                if(res.error){
                    reject(res.err);
                }
                else{
                    resolve(res);
                }
            });
        })
    }
    
    authenticate():Promise<any>{
        return new Promise((resolve,reject)=>{
            this.GoogleAuth.then(() => {
                this.GoogleAuth.signIn(this.initObj).then(googleUser => {
                    resolve(googleUser);
                },reject);
            });
        })
        
    }
    
    getUser():any{
        return this.GoogleAuth;
    }
    
    initAnalytics():Promise<any>{
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                gapi.client.load('analytics', 'v3').then(resolve,reject);
            });
        });
    }
    
    getCompanyList():Promise<any>{
        return new Promise((resolve, reject) => {
            this.zone.run(() => {
                 gapi.client.analytics.management.accounts.list().then(response=>{
                    var companies=response.result.items.map(item => ({ "id": item.id,"name":item.name}));
                    resolve(companies);
                 },err=>{
                     reject(err);
                 });
            });
        });
    }
    
    getCompanyProperties(id):Promise<any>{
        return new Promise((resolve,reject)=>{
            this.zone.run(()=>{
                gapi.client.analytics.management.webproperties.list({'accountId': id})
    	        .then(function(data){
    	        	if (data.result.items && data.result.items.length) 
    	        	{
    	        	    var properties=data.result.items.map(item=>({"id":item.id,"name":item.name}));
    	        	    resolve(properties);
    	        	}
    	        },err=>{
    	            reject(err);
    	        });
            })
        })
    }
    
    getViewList(accountId,webPropertyId):Promise<any>{
        return new Promise((resolve,reject)=>{
            gapi.client.analytics.management.profiles.list({
                'accountId': accountId,
                'webPropertyId': webPropertyId
            }).then(response=>{
                // console.log(response);
                var views=response.result.items.map(item=>({"id":item.id,"name":item.name}));
                resolve(views);
            },err=>{
                reject(err);
            })
        });
        
    }


    getGoalList(accountId,webPropertyId,profileId):Promise<any>{
        return new Promise((resolve,reject)=>{
            gapi.client.analytics.management.goals.list({
                'accountId': accountId,
                'webPropertyId': webPropertyId,
                'profileId':profileId
                
            }).then(response=>{
                var views=response.result.items.map(item=>({"id":item.id,"name":item.name}));
                var result=views.filter(view=> !(view.name).match("VT"));
                resolve(result);
            },err=>{
                console.log(err);
                // reject(err);
            })
        });
    }
    
   
    
    
}