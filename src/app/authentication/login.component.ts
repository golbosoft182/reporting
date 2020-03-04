import { Component,ViewEncapsulation } from '@angular/core';
import {AuthenticationService} from './authentication.service'
import { Router } from '@angular/router';
// import {AuthGuard} from './auth.guard'
@Component({
  selector: 'app-root',
  templateUrl: './login.component.html',
  encapsulation:ViewEncapsulation.None
})
export class LoginComponent {
    email:string;
    password:string;
    loading = false;
    error_message = '';
    error='';
    alert_class='d-none';

    constructor(private router: Router,public authservice:AuthenticationService){

    }

    authenticate(){
      this.authservice.login(this.email,this.password)
        .subscribe(result => {
          console.log(result);
            if (result === true) {
                // login successful
                this.router.navigate(['/']);
            } else {
                // login failed
            }
        },err =>{
          console.log(err);
          this.alert_class="show";
          this.error="has-danger";
          this.error_message = 'Username or password is incorrect';
          this.loading = false;
        });
    }

}
