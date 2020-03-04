import { NgZone,Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Helper} from '../Utils/Helper'

@Injectable()
export class WebCEOService{
    private url:string;
    private user_token:string;
    constructor(private http: HttpClient,private helper:Helper){
      let user=JSON.parse(sessionStorage.getItem('currentUser'));
      this.user_token=user.token;
      this.url="https://socialanalytics.twmg.com.au/";
      this.helper=helper;
    }

    getList(): Promise<any> {
          return this.http.post(this.url+'api/getceolist',{"token":this.user_token})
          .toPromise();
    }

    getProject(project_id):Promise<any>{
        return this.http.post(this.url+'api/getceoproject',{"token":this.user_token,"project":project_id})
          .toPromise();
    }

    getTopKeyword(project_id):Promise<any>{
        return this.http.post(this.url+'api/gettopkeyword',{"token":this.user_token,"project":project_id})
          .toPromise();
    }

    saveProject(request):Promise<any>{
        return this.http.post(this.url+'api/saveproject',{"token":this.user_token,"json_data":request})
          .toPromise();
    }

    getAllData(key):Promise<any>{
         return this.http.post(this.url+'api/getceolist',{"token":this.user_token})
          .toPromise();
    }

}
