import { NgZone,Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable }     from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClientService{
    url="https://socialanalytics.twmg.com.au/";
    constructor(private http: HttpClient){

    }

    getAllData(key):Promise<any>{
         return this.http.post(this.url+'api/getClientData',{"code":key},{

         })
          .toPromise();
    }
}
