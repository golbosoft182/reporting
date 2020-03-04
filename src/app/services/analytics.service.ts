import { NgZone,Injectable } from '@angular/core';

import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient }  from '@angular/common/http';
declare var gapi: any;

@Injectable()
export class AnalyticsService{
  instance;
  clientLoaded:boolean;
  authLoaded:boolean;
  GoogleAuth:any;
  excludedGoals:any;
  initObj={
    'clientId':'991428848383-181dkg50fbj8vh8jbjadhgodvmbof1e5.apps.googleusercontent.com',
    'scope':'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit https://www.googleapis.com/auth/plus.login',
  };
  constructor(private http: HttpClient,private zone: NgZone) {
    this.excludedGoals=[];
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
          sessionStorage.setItem("googleUser",googleUser["Zi"]["id_token"]);
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
          let companies=response.result.items.map(item => ({ "id": item.id,"name":item.name}));
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
              let properties=data.result.items.map(item=>({"id":item.id,"name":item.name}));
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
        // console.log(accountId);
        // console.log(response.result.items);
        let views=response.result.items.filter(item=>{
            if(item.active===true){
              return {"id":item.id,"name":item.name};
            }
        });

        let result=views.filter(view=> {
          return !(view.name).match("Phone Clicks")&&!(view.name).match("Phone Calls")
        });
        // console.log(result);
        this.excludedGoals=response.result.items.filter(item=>{
          if(item.active!==true){
            return {"id":item.id,"name":item.name};
          }
        });

        // console.log(this.excludedGoals);

        result=result.filter(view=> {
          return !(view.name).match("VT")
        });

        resolve({
          "goals":result,
          "excludedGoals":this.excludedGoals
        });
      },err=>{
        console.log(err);
        // reject(err);
      })
    });
  }




}
