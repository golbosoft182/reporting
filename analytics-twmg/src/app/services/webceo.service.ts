import { NgZone,Injectable } from '@angular/core';
import { Http, Headers, Response,RequestOptions, URLSearchParams } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import {Helper} from '../Utils/Helper'

@Injectable()
export class WebCEOService{
    private url:string;
    constructor(private http: Http,private helper:Helper){
      this.url="https://socialanalytics.twmg.com.au/";
      this.helper=helper;
    }
    
    getList(): Promise<any> {
        var json=JSON.parse(sessionStorage.getItem('currentUser'));
          return this.http.post(this.url+'api/getceolist',{"token":json.token},
          new Headers({ 'Content-Type': 'application/json' }))
          .toPromise();
    }
    
    getProject(project_id):Promise<any>{
        var json=JSON.parse(sessionStorage.getItem('currentUser'));
        return this.http.post(this.url+'api/getceoproject',{"token":json.token,"project":project_id},
          new Headers({ 'Content-Type': 'application/json' }))
          .toPromise();
    }
    
    getTopKeyword(project_id):Promise<any>{
       var json=JSON.parse(sessionStorage.getItem('currentUser'));
        return this.http.post(this.url+'api/gettopkeyword',{"token":json.token,"project":project_id},
          new Headers({ 'Content-Type': 'application/json' }))
          .toPromise();
    }
    
    saveProject(request):Promise<any>{
        var json=JSON.parse(sessionStorage.getItem('currentUser'));
        return this.http.post(this.url+'api/saveproject',{"token":json.token,"json_data":request},
          new Headers({ 'Content-Type': 'application/json' }))
          .toPromise();
    }
    
    getAllData(key):Promise<any>{
         return this.http.post(this.url+'api/getceolist',new Headers({ 'Content-Type': 'application/json' }))
          .toPromise();
    }
}