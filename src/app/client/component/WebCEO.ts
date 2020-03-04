import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'webCEO',
  templateUrl: '../views/WebCEO.html',
})
export class WebCEO implements OnInit {
  @Input() webData: any;
  @Input() comment:any;
  ngOnInit(){

  }

  getCountryName(location){
    if (location.indexOf(',') > -1) {
      let location_arr=location.split(',');
      location=location_arr.length>0?location_arr[location_arr.length-1]:location;
    }
    return location;
  }
}
