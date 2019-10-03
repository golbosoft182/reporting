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
var Model_data_1 = require("../models/Model.data");
var Page_data_1 = require("../models/Page.data");
var City_data_1 = require("../models/City.data");
var Channel_data_1 = require("../models/Channel.data");
var Visit_data_1 = require("../models/Visit.data");
var Request_data_1 = require("../models/Request.data");
var Goal_data_1 = require("../models/Goal.data");
var GetGoalParameter_1 = require("../models/GetGoalParameter");
var AnalyticsQuery = (function () {
    function AnalyticsQuery(service, helper) {
        this.service = service;
        this.helper = helper;
        this.helper = helper;
        this.request_obj = new Request_data_1.Request();
        this.request_obj.setPageSize(10);
        this.request_obj.setEmptyRows(true);
        this.request = { viewId: 0, metrics: [], pageSize: 10, includeEmptyRows: true };
        this.request.dateRanges = [];
        this.batchRequest = [];
        this.request.dateRanges[0] = {};
        this.request.dateRanges[1] = {};
        // this.colors=["#576ea1","#2ebfac","#3f9ebf","#00cbe0","#00ade0","#2687cc","#1d8dd1","#108676"];
        this.colors = ["#00ade0", "#0000e0", "#e000ce", "#e00000", "#e0de00", "#00e010", "#e06f00", "#00d8e0"];
    }
    AnalyticsQuery.prototype.setViewId = function (viewId) {
        this.request.viewId = viewId;
        this.request_obj.setViewId(viewId);
    };
    AnalyticsQuery.prototype.setCurrentDate = function (startDate, endDate) {
        this.request.dateRanges[0] = {};
        this.request.dateRanges[0]["startDate"] = startDate;
        this.request.dateRanges[0]["endDate"] = endDate;
    };
    AnalyticsQuery.prototype.setCompareDate = function (startDate, endDate) {
        this.request.dateRanges[1] = {};
        this.request.dateRanges[1]["startDate"] = startDate;
        this.request.dateRanges[1]["endDate"] = endDate;
    };
    AnalyticsQuery.prototype.setSingleDate = function (startDate, endDate) {
        this.request["dateRanges"][0].startDate = this.helper.getPreviousYearDates(startDate);
        this.request["dateRanges"][0].endDate = this.helper.getPreviousYearDates(endDate);
        delete this.request["dateRanges"][1];
    };
    AnalyticsQuery.prototype.getRawQuery = function (request) {
        return this.queryAccount(request);
    };
    AnalyticsQuery.prototype.queryAccount = function (request) {
        return new Promise(function (resolve, reject) {
            gapi.client.request({
                path: '/v4/reports:batchGet',
                root: 'https://analyticsreporting.googleapis.com/',
                method: 'POST',
                body: {
                    reportRequests: [request]
                }
            }).then(resolve, reject);
        });
    };
    AnalyticsQuery.prototype.queryBatch = function (request) {
        return new Promise(function (resolve, reject) {
        });
    };
    AnalyticsQuery.prototype.getRequestObject = function () {
        return Object.assign({}, this.request);
    };
    AnalyticsQuery.prototype.getMonthlyVisit = function () {
        var _this = this;
        var request = this.getRequestObject();
        var arr = [];
        request.metrics = [{ "expression": "ga:sessions" }];
        request.dimensions = [{ "name": "ga:userType" }];
        return new Promise(function (resolve, reject) {
            _this.queryAccount(request).then(function (response) {
                var result = {};
                var current_visit, compare_visit;
                var data = response.result.reports[0].data;
                var item = data.rows;
                if (item) {
                    if (item[1].dimensions) {
                        current_visit = new Visit_data_1.Visit(item[0].metrics[0].values[0], item[1].metrics[0].values[0], data.totals[0].values[0]);
                        result["current"] = current_visit;
                        if (item[0].metrics[1] && item[1].metrics[1] && data.totals[1]) {
                            compare_visit = new Visit_data_1.Visit(item[0].metrics[1].values[0], item[1].metrics[1].values[0], data.totals[1].values[0]);
                            result["compare"] = compare_visit;
                        }
                    }
                    else {
                        if (item[0].dimensions[0] === "New Visitor") {
                            current_visit = new Visit_data_1.Visit(item[0].metrics[0].values[0], 0, data.totals[0].values[0]);
                            if (item[0].metrics[1] && data.totals[1]) {
                                compare_visit = new Visit_data_1.Visit(item[0].metrics[1].values[0], 0, data.totals[1].values[0]);
                                result["compare"] = compare_visit;
                            }
                        }
                        else {
                            current_visit = new Visit_data_1.Visit(0, item[0].metrics[0].values[0], data.totals[0].values[0]);
                            if (item[0].metrics[1] && data.totals[1]) {
                                compare_visit = new Visit_data_1.Visit(0, item[0].metrics[0].values[0], data.totals[1].values[0]);
                                result["compare"] = compare_visit;
                            }
                        }
                    }
                }
                resolve(result);
            }, function (err) { reject(err); });
        });
    };
    AnalyticsQuery.prototype.getEcommerceData = function () {
        var _this = this;
        var request = this.getRequestObject();
        var arr = [];
        request.metrics = [{ "expression": "ga:transactions" }, { "expression": "ga:transactionRevenue" }];
        return new Promise(function (resolve, reject) {
            var result = {};
            _this.queryAccount(request).then(function (response) {
                var data = response.result.reports[0].data;
                result["current"] = {};
                result["compare"] = {};
                if (data) {
                    var item = data.rows[0];
                    if (item) {
                        result["current"]["transactions"] = item.metrics[0].values[0];
                        result["current"]["revenue"] = item.metrics[0].values[1];
                        if (item.metrics[1]) {
                            result["compare"]["transactions"] = item.metrics[1].values[0];
                            result["compare"]["revenue"] = item.metrics[1].values[1];
                        }
                    }
                }
                resolve(result);
            }, function (err) { reject(err); });
        });
    };
    AnalyticsQuery.prototype.getChannel = function () {
        var _this = this;
        var request = this.getRequestObject();
        var arr = [];
        request.metrics = [{ "expression": "ga:sessions" }];
        request.dimensions = [{ "name": "ga:channelGrouping" }];
        return new Promise(function (resolve, reject) {
            _this.queryAccount(request).then(function (response) {
                var channels = new Array(), compare_channels = new Array();
                var result = {};
                var reports = response.result.reports[0];
                //checking for undefined data
                if (reports) {
                    if (reports.data["rows"]) {
                        var i = 0;
                        response.result.reports[0].data.rows.forEach(function (item) {
                            var key = item.dimensions[0];
                            var channel = new Channel_data_1.Channel(key, item.metrics[0].values[0], _this.colors[i]);
                            channels.push(channel);
                            if (item.metrics[1]) {
                                channel = new Channel_data_1.Channel(key, item.metrics[1].values[0], _this.colors[i]);
                                compare_channels.push(channel);
                            }
                            i++;
                        });
                    }
                }
                result["current"] = channels;
                if (compare_channels.length > 0) {
                    result["compare"] = compare_channels;
                }
                resolve(result);
            }, function (err) { reject(err); });
        });
    };
    AnalyticsQuery.prototype.getBounceRate = function () {
        var _this = this;
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:bounceRate" }];
        return new Promise(function (resolve, reject) {
            _this.queryAccount(request).then(function (response) {
                var result = {};
                //checking for undefined data
                if (response.result.reports[0].data["rows"]) {
                    var item = response.result.reports[0].data.rows[0];
                    result["current"] = Number(item.metrics[0].values[0]).toFixed(2);
                    if (item.metrics[1]) {
                        result["compare"] = Number(item.metrics[1].values[0]).toFixed(2);
                    }
                }
                resolve(result);
            }, function (err) { reject(err); });
        });
    };
    AnalyticsQuery.prototype.getMonthlyTraffic = function () {
        var _this = this;
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:sessions" }];
        request.dimensions = [{ "name": "ga:deviceCategory" }];
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                _this.queryAccount(request).then(function (response) {
                    var result = [], current = [], compare = [];
                    //checking for undefined data
                    if (response.result.reports[0]) {
                        var res = response.result.reports[0].data;
                        if (res["rows"]) {
                            var metric_length = res["rows"][0].metrics.length;
                            var i = 0;
                            res.rows.forEach(function (item, key) {
                                current.push(new Model_data_1.Model(item.dimensions[0], item.metrics[0].values[0], _this.colors[i]));
                                if (item.metrics[1]) {
                                    compare.push(new Model_data_1.Model(item.dimensions[0], item.metrics[1].values[0], _this.colors[i]));
                                }
                                i++;
                            });
                        }
                    }
                    result["current"] = current;
                    if (compare.length > 0) {
                        result["compare"] = compare;
                    }
                    resolve(result);
                }, function (err) { reject(err); });
            }, 4000);
        });
    };
    AnalyticsQuery.prototype.getAllGoalCompletion = function () {
        var _this = this;
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:goalCompletionsAll" }, { "expression": "ga:sessions" }];
        request.includeEmptyRows = false;
        return new Promise(function (resolve, reject) {
            var result = {};
            _this.queryAccount(request).then(function (response) {
                //checking for undefined data
                var reports = response.result.reports[0];
                if (reports) {
                    if (reports.data["rows"]) {
                        var item = reports.data.rows[0];
                        result["current"] = { goals: Number(item.metrics[0].values[0]), sessions: Number(item.metrics[0].values[1]) };
                        if (item.metrics[1]) {
                            result["compare"] = { goals: Number(item.metrics[1].values[0]), sessions: Number(item.metrics[1].values[1]) };
                        }
                    }
                }
                resolve(result);
            }, function (err) { reject(err); });
        });
    };
    AnalyticsQuery.prototype.getSiteGoalsViaChannel = function () {
        var _this = this;
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:goalCompletionsAll" }];
        request.dimensions = [{ "name": "ga:channelGrouping" }, { "name": "ga:userType" }];
        request.includeEmptyRows = true;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                _this.queryAccount(request).then(function (response) {
                    //checking for undefined data
                    if (response.result.reports[0]) {
                        var data = response.result.reports[0].data;
                        var result = {};
                        result["current"] = [];
                        result["compare"] = [];
                        if (data.rows) {
                            var current = data.rows.map(function (item) {
                                return (_a = { "Group": item.dimensions[0] }, _a[item.dimensions[1]] = Number(item.metrics[0].values[0]), _a);
                                var _a;
                            });
                            result["current"] = _this.reduceArray(current);
                            if (data.totals.length > 1) {
                                var compare = data.rows.map(function (item) {
                                    return (_a = { "Group": item.dimensions[0] }, _a[item.dimensions[1]] = Number(item.metrics[1].values[0]), _a);
                                    var _a;
                                });
                                result["compare"] = _this.reduceArray(compare);
                            }
                        }
                    }
                    resolve(result);
                }, function (err) { reject(err); });
            }, 3000);
        });
    };
    AnalyticsQuery.prototype.reduceArray = function (Goals) {
        var keys = [], result = [];
        Goals.forEach(function (item) {
            var key = item.Group;
            if (!keys.includes(key)) {
                keys.push(key);
                result.push(item);
            }
            else {
                // delete item.Group;
                var index = result.findIndex(function (channel) {
                    return channel.Group === key;
                });
                Object.assign(result[index], item);
            }
        });
        return result;
    };
    AnalyticsQuery.prototype.getAllEvents = function () {
        var _this = this;
        var request = this.getRequestObject();
        var result = {}, current = new Array(), compare = new Array();
        request.metrics = [{ "expression": "ga:totalEvents" }];
        request.dimensions = [{ "name": "ga:eventCategory" }];
        request.pageSize = 100;
        // request.filtersExpression="ga:eventLabel=@Phone,ga:eventLabel=@phone,ga:eventLabel=@contact,ga:eventLabel=@call,ga:eventLabel=@Call,ga:eventLabel=@Text",
        request.includeEmptyRows = true;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                _this.queryAccount(request).then(function (response) {
                    var data = response.result.reports[0].data;
                    result["current"] = [];
                    result["compare"] = [];
                    if ('rows' in data) {
                        data.rows.forEach(function (item) {
                            result["current"].push(new Model_data_1.Model(item.dimensions[0], item.metrics[0].values[0]));
                            if (item.metrics[1]) {
                                result["compare"].push(new Model_data_1.Model(item.dimensions[0], item.metrics[1].values[0]));
                            }
                        });
                    }
                    resolve(result);
                }, function (err) { reject(err); });
            }, 4000);
        });
    };
    AnalyticsQuery.prototype.getSocial = function () {
        var _this = this;
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:sessions" }];
        request.dimensions = [{ "name": "ga:socialNetwork" }];
        request.includeEmptyRows = true;
        return new Promise(function (resolve, reject) {
            setTimeout(function () {
                _this.queryAccount(request).then(function (response) {
                    var data = response.result.reports[0].data;
                    if ('rows' in data) {
                        var result = [];
                        var social = data.rows.filter(function (item) {
                            var key = item.dimensions[0];
                            if (["Facebook", "Instagram", "LinkedIn", "Twitter", "Blogger"].includes(key)) {
                                return true;
                            }
                        }).map(function (item) { return ({ "name": item.dimensions[0], "value": item.metrics[0].values[0] }); });
                        result["current"] = social;
                        if (data.rows[0].metrics[1] != undefined) {
                            social = data.rows.filter(function (item) {
                                var key = item.dimensions[0];
                                if (["Facebook", "Instagram", "LinkedIn", "Twitter", "Blogger"].includes(key)) {
                                    return true;
                                }
                            }).map(function (item) { return ({ "name": item.dimensions[0], "value": item.metrics[1].values[0] }); });
                            result["compare"] = social;
                        }
                        console.log(result);
                        resolve(result);
                    }
                }, function (err) { reject(err); });
            }, 4000);
        });
    };
    AnalyticsQuery.prototype.getGoalCompletionRate = function () {
        var _this = this;
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:goalConversionRateAll" }];
        return new Promise(function (resolve, reject) {
            _this.queryAccount(request).then(function (response) {
                var data = response.result.reports[0].data;
                if ('rows' in data) {
                    var result = {};
                    result["current"] = Number(data.rows[0].metrics[0].values[0]).toFixed(2);
                    if (data.rows[0].metrics[1]) {
                        result["compare"] = Number(data.rows[0].metrics[1].values[0]).toFixed(2);
                    }
                    resolve(result);
                }
            }, function (err) { reject(err); });
        });
    };
    AnalyticsQuery.prototype.getTopPages = function () {
        var _this = this;
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:pageviews" }];
        request.dimensions = [{ "name": "ga:pagePath" }];
        request.orderBys = [{ "fieldName": "ga:pageviews", "sortOrder": "DESCENDING" }];
        return new Promise(function (resolve, reject) {
            _this.queryAccount(request).then(function (response) {
                var result = response.result.reports[0].data.rows.map(function (item) { return (new Page_data_1.Page(item.dimensions[0], item.metrics[0].values[0])); });
                resolve(result);
            }, function (err) { reject(err); });
        });
    };
    AnalyticsQuery.prototype.getTopCities = function () {
        var _this = this;
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:sessions" }, { "expression": "ga:goalCompletionsAll" }];
        request.dimensions = [{ "name": "ga:city" }];
        request.pageSize = 10;
        request.orderBys = [{ "fieldName": "ga:sessions", "sortOrder": "DESCENDING" }];
        return new Promise(function (resolve, reject) {
            _this.queryAccount(request).then(function (response) {
                var result = response.result.reports[0].data.rows.map(function (item) { return (new City_data_1.City(item.dimensions[0], item.metrics[0].values[0], item.metrics[0].values[1])); });
                resolve(result);
            }, function (err) { reject(err); });
        });
    };
    AnalyticsQuery.prototype.getGoalNames = function () {
        var _this = this;
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:goalCompletionsAll" }];
        request.dimensions = [{ "name": "ga:goalCompletionLocation" }];
        request.orderBys = [{ "fieldName": "ga:goalCompletionLocation", "sortOrder": "ASCENDING" }];
        return new Promise(function (resolve, reject) {
            _this.queryAccount(request).then(function (response) {
                var data = response.result.reports[0].data;
                var result = {};
                result["current"] = [];
                result["compare"] = [];
                data.rows.forEach(function (item) {
                    result["current"].push(new Goal_data_1.Goal(item.metrics[0].values[0], item.dimensions[0]));
                    if (item.metrics[1]) {
                        result["compare"].push(new Goal_data_1.Goal(item.metrics[1].values[0], item.dimensions[0]));
                    }
                });
                resolve(result);
            }, function (err) { reject(err); });
        });
    };
    // Testing for values for goals
    AnalyticsQuery.prototype.getAllGoalsParameter = function (id) {
        var request = this.getRequestObject();
        request.metrics = [{ "expression": "ga:goal" + id + "Completions" }];
        request.dimensions = [{ "name": "ga:userType" }, { "name": "ga:channelGrouping" }];
        request.pageSize = 100;
        return request;
    };
    AnalyticsQuery.prototype.getBatchGoalsParameter = function (requests) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var result = {};
            result["current"] = [];
            result["compare"] = [];
            setTimeout(function () {
                _this.queryAccount(requests).then(function (response) {
                    var reports = response["result"].reports;
                    if (reports) {
                        reports.forEach(function (report, index) {
                            var key = report.columnHeader.metricHeader.metricHeaderEntries[0].name;
                            key = key.substring(key.indexOf(':') + 1);
                            result["current"][index] = [];
                            result["current"][index][0] = { "name": key };
                            result["current"][index][1] = [];
                            result["current"][index][2] = report.data.totals[0].values[0];
                            //Declaration fro compare data range
                            result["compare"][index] = [];
                            result["compare"][index][0] = { "name": key };
                            result["compare"][index][1] = [];
                            result["compare"][index][2] = report.data.totals[1].values[0];
                            report.data.rows.forEach(function (item) {
                                if (item.dimensions[0].indexOf("Returning Visitor") == -1) {
                                    var return_user = report.data.rows.find(function (obj) {
                                        return item.dimensions[1] === obj.dimensions[1] && obj.dimensions[0].indexOf("Returning Visitor") > -1;
                                    });
                                    var obj = void 0;
                                    if (return_user) {
                                        obj = new GetGoalParameter_1.GetGoalParameter(item.dimensions[1], item.metrics[0].values[0], return_user.metrics[0].values[0]);
                                        result["current"][index][1].push(obj);
                                    }
                                    else {
                                        obj = new GetGoalParameter_1.GetGoalParameter(item.dimensions[1], item.metrics[0].values[0], 0);
                                        result["current"][index][1].push(obj);
                                    }
                                }
                            });
                        });
                    }
                    resolve(result);
                });
            }, 6000);
        });
    };
    return AnalyticsQuery;
}());
AnalyticsQuery = __decorate([
    core_1.Injectable()
], AnalyticsQuery);
exports.AnalyticsQuery = AnalyticsQuery;
