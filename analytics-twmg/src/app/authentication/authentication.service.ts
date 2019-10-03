import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'
 
@Injectable()
export class AuthenticationService {
    public token: string;
    url="https://socialanalytics.twmg.com.au/";
    constructor(private http: Http) {
        // set token if saved in local storage
        var currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }
 
    login(username: string, password: string): Observable<boolean> {
        return this.http.post(this.url+'api/auth/login',{ email: username, password: password },new Headers({ 'Content-Type': 'application/json' }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // set token property
                    this.token = token;
 
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify({ email: username, token: token }));
 
                    // return true to indicate successful login
                    return true;
                } else {
                    console.log(response);
                    // return false to indicate failed login
                    return false;
                }
            }).catch((err:Response) => {
                let details = err.json();
                return Observable.throw(details);
            });;
    }
 
    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        sessionStorage.removeItem('currentUser');
    }
}