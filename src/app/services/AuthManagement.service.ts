import { NgZone,Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { HttpClient }  from '@angular/common/http';
declare var gapi: any;

@Injectable()
export class AuthManagementService{

  authLoaded:boolean;
  public GoogleAuth:any;
  public loggedIn:boolean;
  initObj={
    'clientId':'991428848383-181dkg50fbj8vh8jbjadhgodvmbof1e5.apps.googleusercontent.com',
    'scope':'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit https://www.googleapis.com/auth/plus.login',
  };

  constructor(private http: HttpClient,private zone: NgZone) {
    this.loggedIn=false;
  }

  public getLoginState(){
    return this.loggedIn;
  }

  initAuth(){
    this.GoogleAuth =gapi.auth2.init(this.initObj);
     return this.GoogleAuth;
  }

  isAlreadyLoggedIn(){

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
          // sessionStorage.setItem("googleUser",googleUser["Zi"]["id_token"]);
          resolve(googleUser);
        },reject);
      });
    })
  }

  authUser():boolean{
    return this.GoogleAuth.isSignedIn.get();
  }

  getUser():any{
    return this.GoogleAuth;
  }

}
