import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable,throwError } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AuthenticationService {
    public token: string;

    url="https://socialanalytics.twmg.com.au/";

    constructor(private http: HttpClient) {
        // set token if saved in local storage
        let currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    };

    login(username: string, password: string): Observable<boolean> {
        return this.http.post(this.url+'api/auth/login',{ email: username, password: password })
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response["token"];
                if (token!=="") {
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
                // let details = err.json();
                return throwError(err);
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        sessionStorage.removeItem('currentUser');
    }
}
