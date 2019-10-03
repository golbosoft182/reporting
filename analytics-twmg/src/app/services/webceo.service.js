"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
var WebCEOService = (function () {
    function WebCEOService(http, helper) {
        this.http = http;
        this.helper = helper;
        this.url = "https://socialanalytics.twmg.com.au/";
        this.helper = helper;
    }
    WebCEOService.prototype.getList = function () {
        var json = JSON.parse(sessionStorage.getItem('currentUser'));
        return this.http.post(this.url + 'api/getceolist', { "token": json.token }, new http_1.Headers({ 'Content-Type': 'application/json' }))
            .toPromise();
    };
    WebCEOService.prototype.getProject = function (project_id) {
        var json = JSON.parse(sessionStorage.getItem('currentUser'));
        return this.http.post(this.url + 'api/getceoproject', { "token": json.token, "project": project_id }, new http_1.Headers({ 'Content-Type': 'application/json' }))
            .toPromise();
    };
    WebCEOService.prototype.getTopKeyword = function (project_id) {
        var json = JSON.parse(sessionStorage.getItem('currentUser'));
        return this.http.post(this.url + 'api/gettopkeyword', { "token": json.token, "project": project_id }, new http_1.Headers({ 'Content-Type': 'application/json' }))
            .toPromise();
    };
    WebCEOService.prototype.saveProject = function (request) {
        var json = JSON.parse(sessionStorage.getItem('currentUser'));
        return this.http.post(this.url + 'api/saveproject', { "token": json.token, "json_data": request }, new http_1.Headers({ 'Content-Type': 'application/json' }))
            .toPromise();
    };
    WebCEOService.prototype.getAllData = function (key) {
        return this.http.post(this.url + 'api/getceolist', new http_1.Headers({ 'Content-Type': 'application/json' }))
            .toPromise();
    };
    return WebCEOService;
}());
WebCEOService = __decorate([
    core_1.Injectable()
], WebCEOService);
exports.WebCEOService = WebCEOService;
