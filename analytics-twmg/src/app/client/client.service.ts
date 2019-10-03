import { NgZone,Injectable } from '@angular/core';
import { Http, Headers, Response,RequestOptions, URLSearchParams } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClientService{
    url="https://socialanalytics.twmg.com.au/";
    constructor(private http: Http){
      
    }
    
    getAllData(key):Promise<any>{
         return this.http.post(this.url+'api/getClientData',{"code":key},
         new Headers({ 'Content-Type': 'application/json' }))
          .toPromise();
    }
}