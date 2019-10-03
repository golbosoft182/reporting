import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
 
@Injectable()
export class AnonymousGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate() {
        if (sessionStorage.getItem('currentUser')) {
            // not logged in so redirect to login page
            this.router.navigate(['/dashboard']);
            // logged in so return false
            return false;
        }
        
        return true;
    }
}