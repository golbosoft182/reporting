"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
var AnalyticsService = (function () {
    function AnalyticsService(http, zone) {
        this.http = http;
        this.zone = zone;
        this.initObj = {
            'clientId': '991428848383-181dkg50fbj8vh8jbjadhgodvmbof1e5.apps.googleusercontent.com',
            'scope': 'https://www.googleapis.com/auth/analytics https://www.googleapis.com/auth/analytics.readonly https://www.googleapis.com/auth/analytics.edit https://www.googleapis.com/auth/plus.login'
        };
    }
    AnalyticsService.prototype.loadClient = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.zone.run(function () {
                gapi.load('client:auth2', {
                    callback: resolve,
                    onerror: reject,
                    timeout: 1000,
                    ontimeout: reject
                });
            });
        });
    };
    AnalyticsService.prototype.initAuth = function () {
        gapi.auth2.init(this.initObj);
        this.GoogleAuth = gapi.auth2.getAuthInstance();
    };
    AnalyticsService.prototype.authUser = function () {
        return this.GoogleAuth.isSignedIn.get();
    };
    AnalyticsService.prototype.authorize = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            gapi.auth2.authorize(_this.initObj, function (res) {
                if (res.error) {
                    reject(res.err);
                }
                else {
                    resolve(res);
                }
            });
        });
    };
    AnalyticsService.prototype.authenticate = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.GoogleAuth.then(function () {
                _this.GoogleAuth.signIn(_this.initObj).then(function (googleUser) {
                    resolve(googleUser);
                }, reject);
            });
        });
    };
    AnalyticsService.prototype.getUser = function () {
        return this.GoogleAuth;
    };
    AnalyticsService.prototype.initAnalytics = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.zone.run(function () {
                gapi.client.load('analytics', 'v3').then(resolve, reject);
            });
        });
    };
    AnalyticsService.prototype.getCompanyList = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.zone.run(function () {
                gapi.client.analytics.management.accounts.list().then(function (response) {
                    var companies = response.result.items.map(function (item) { return ({ "id": item.id, "name": item.name }); });
                    resolve(companies);
                }, function (err) {
                    reject(err);
                });
            });
        });
    };
    AnalyticsService.prototype.getCompanyProperties = function (id) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.zone.run(function () {
                gapi.client.analytics.management.webproperties.list({ 'accountId': id })
                    .then(function (data) {
                    if (data.result.items && data.result.items.length) {
                        var properties = data.result.items.map(function (item) { return ({ "id": item.id, "name": item.name }); });
                        resolve(properties);
                    }
                }, function (err) {
                    reject(err);
                });
            });
        });
    };
    AnalyticsService.prototype.getViewList = function (accountId, webPropertyId) {
        return new Promise(function (resolve, reject) {
            gapi.client.analytics.management.profiles.list({
                'accountId': accountId,
                'webPropertyId': webPropertyId
            }).then(function (response) {
                // console.log(response);
                var views = response.result.items.map(function (item) { return ({ "id": item.id, "name": item.name }); });
                resolve(views);
            }, function (err) {
                reject(err);
            });
        });
    };
    AnalyticsService.prototype.getGoalList = function (accountId, webPropertyId, profileId) {
        return new Promise(function (resolve, reject) {
            gapi.client.analytics.management.goals.list({
                'accountId': accountId,
                'webPropertyId': webPropertyId,
                'profileId': profileId
            }).then(function (response) {
                var views = response.result.items.map(function (item) { return ({ "id": item.id, "name": item.name }); });
                var result = views.filter(function (view) { return !(view.name).match("VT"); });
                resolve(result);
            }, function (err) {
                console.log(err);
                // reject(err);
            });
        });
    };
    return AnalyticsService;
}());
AnalyticsService = __decorate([
    core_1.Injectable()
], AnalyticsService);
exports.AnalyticsService = AnalyticsService;
