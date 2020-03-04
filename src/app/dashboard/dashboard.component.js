"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var OrganicChannel_data_1 = require("../models/OrganicChannel.data");
// import {Webceo} from '../Webceo/webceo.component'
var DashboardComponent = (function () {
    // result=new Object();
    // top_pages_ranking=[]; 
    function DashboardComponent(analytics, query, webceo, chart, helper) {
        var _this = this;
        this.analytics = analytics;
        this.query = query;
        this.webceo = webceo;
        this.chart = chart;
        this.helper = helper;
        this.title = 'dashboard';
        this.SiteGoalIndex = 0;
        this.retrievedData = [];
        //initialize selection variable
        this.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        this.error_messages = ["Success", "Error"];
        this.packages = ["Starter", "Standard", "Advanced", "Premium"];
        this.companies = new Array();
        this.companies_properties = new Array();
        this.companies_views = new Array();
        this.ranking_account = new Array();
        this.web_ceo_list = new Array();
        this.goal_channel_parameter = new Array();
        // Array for testing 
        this.test_data = new Array();
        this.goalSelection = new Array();
        this.symbol = {};
        this.percentage = {};
        //initialize the variable
        this.eventIndex = {};
        // this.comment={};
        // this.comment["organic"]="Demo";
        this.channels = {};
        this.my_Class = false;
        this.sign_in = "show btn btn-default";
        this.body = "hide";
        this.success = "hide";
        this.package = this.packages[0];
        //data for database entries
        this.data = {};
        this.data["current"] = {};
        this.data["compare"] = {};
        this.data["last_year"] = {};
        this.compare = {};
        this.comment = {};
        this.comment.glance = "Comment";
        this.comment.organic = "Comment";
        this.comment.traffic = "Comment";
        this.comment.channels = "Comment";
        this.comment.sitegoals = "Comment";
        this.comment.social = "Comment";
        this.comment.toppages = "Comment";
        this.comment.topcities = "Comment";
        this.comment.topsearch = "Comment";
        this.comment.topkeyword = "Comment";
        this.organic = new Array();
        //graph data initialization
        this.bar_graph = this.chart.setChartOption({ showXAxis: false,
            noData: true, stacked: false, showControls: false,
            yAxis: { axisLabel: "Value", ticks: 5 }, showValues: true });
        this.bar_graph = this.bar_graph.setChartType("multiBarHorizontalChart").
            setXaxis({ showMaxMin: false }).
            setYAxis({ axisLabel: 'Values',
            tickFormat: function (d) {
                return d3.format(',.2f')(d);
            } }).
            getChart();
        // this.bar_graph.update();
        this.pie_chart = this.chart.setChartType("pieChart").getChart();
        this.donut_chart = this.chart.setChartOption({ donut: true, pie: { startAngle: null,
                endAngle: null } });
        this.donut_chart = this.donut_chart.setChartType("pieChart").addRender(function (e) {
            //for each text
            d3.selectAll(".nv-legend text")[0].forEach(function (d) {
                //get the data
                var t = d3.select(d).data()[0];
                //set the new data in the innerhtml
                if (t.value != undefined) {
                    //set the new data in the innerhtml
                    d3.select(d).html(t.key + " - " + t.value);
                }
            });
        }).getChart();
        this.webceo.getList().then(function (data) {
            var json = JSON.parse(data["_body"]);
            json[0]["data"].forEach(function (item) {
                _this.web_ceo_list.push(item);
            });
            _this.rankingAccount = _this.web_ceo_list[0].project;
        });
        this.first_month_start = "2018-02-01";
        this.second_month_start = "2018-01-01";
        this.first_month_end = "2018-02-28";
        this.second_month_end = "2018-01-31";
    }
    DashboardComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.analytics.loadClient().then(function (result) {
            _this.analytics.initAnalytics().then(function (res) { }, function (err) { console.log(err); });
            _this.analytics.initAuth();
        }, function (err) {
            console.log(err);
        });
    };
    DashboardComponent.prototype.findReport = function () {
    };
    DashboardComponent.prototype.authenticateUser = function () {
        var _this = this;
        this.analytics.authenticate().then(function (res) {
            _this.loadList();
            _this.body = "row";
            _this.sign_in = "hide";
        }, function (err) {
            throw "cannot load data";
        });
    };
    DashboardComponent.prototype.loadList = function () {
        var _this = this;
        try {
            if (this.analytics.authUser()) {
                this.analytics.getCompanyList().then(function (result) {
                    _this.companies = result;
                    if (_this.companies.length == 0) {
                        _this.body = "hide";
                        _this.sign_in = "row";
                        _this.success = "alert alert-danger";
                        _this.code = "Please Check Your E-mail Id ";
                    }
                    else {
                        _this.AccountValue = result[0].id;
                        _this.getDetails(0);
                    }
                }, function (err) {
                    console.log(err);
                });
            }
        }
        catch (err) {
            console.log(err);
        }
    };
    DashboardComponent.prototype.getDetails = function (value) {
        var _this = this;
        this.client_id = this.companies[value].id;
        this.client_name = this.companies[value].name;
        this.analytics.getCompanyProperties(this.client_id).then(function (result) {
            _this.companies_properties = result;
            if (result != null) {
                _this.PropertyValue = result[0].id;
                _this.getView();
            }
        });
    };
    DashboardComponent.prototype.getView = function () {
        var _this = this;
        this.analytics.getViewList(this.client_id, this.PropertyValue).then(function (result) {
            _this.companies_views = result;
            if (result != null) {
                _this.ViewValue = result[0].id;
                _this.getGoal();
                // this.getEachDetailsGoal();
            }
        }, function (err) { console.log(err); });
    };
    DashboardComponent.prototype.getGoal = function () {
        var _this = this;
        try {
            this.analytics.getGoalList(this.companies[this.AccountValue].id, this.PropertyValue, this.ViewValue).then(function (result) {
                _this.goalSelection = result;
                console.log(_this.goalSelection);
                _this.data["listofGoalSelection"] = result;
            }, function (err) { console.log(err); });
        }
        catch (e) {
            console.log(e);
        }
    };
    DashboardComponent.prototype.validate = function () {
        try {
            if (this.first_month_start == null) {
                throw "Please Check your Date";
            }
            if (this.first_month_end == null) {
                throw "Please Check your Date";
            }
            if (this.second_month_start == null) {
                throw "Please Check your Date";
            }
            if (this.second_month_end == null) {
                throw "Please Check your Date";
            }
            if (this.rankingAccount == null) {
                throw "You haven't selected the ranking account yet";
            }
        }
        catch (e) {
            this.success = "alert alert-danger";
            this.code = e;
            throw e;
        }
    };
    DashboardComponent.prototype.loadAnalytics = function () {
        var _this = this;
        this.validate();
        try {
            this.data["current"] = {};
            this.data["compare"] = {};
            this.data["last_year"] = {};
            this.query.setViewId(this.ViewValue);
            this.first_year = new Date(this.first_month_start).getFullYear().toString();
            this.second_year = new Date(this.second_month_start).getFullYear().toString();
            this.current_month = this.helper.getMonthString(this.first_month_start);
            this.compare_month = this.helper.getMonthString(this.second_month_start);
            this.compare_index_month = this.compare_month;
            this.query.setCurrentDate(this.first_month_start, this.first_month_end);
            this.query.setCompareDate(this.second_month_start, this.second_month_end);
            //track all promises complete then start new query for last year current month
            var promises = [this.query.getChannel(), this.query.getMonthlyVisit(), this.query.getBounceRate(),
                this.query.getMonthlyTraffic(), this.query.getAllGoalCompletion(), this.query.getSiteGoalsViaChannel(),
                this.query.getSocial(), this.query.getTopPages(), this.query.getTopCities(), this.query.getGoalCompletionRate(), this.query.getAllEvents(), this.query.getGoalNames(),
                this.query.getBatchGoalsParameter(requests),
            ];
            //all data sequence based on above array 
            Promise.all(promises).then(function (result) {
                //Channels
                _this.data["current"].channels = result[0]["current"];
                console.log(_this.helper.getOrganicData(_this.data.current.channels));
                _this.data["current"].organic = new OrganicChannel_data_1.OrganicChannel(_this.current_month, "#3CBA54", _this.helper.getOrganicData(_this.data.current.channels));
                _this.data["compare"].channels = result[0]["compare"];
                _this.data["compare"].organic = new OrganicChannel_data_1.OrganicChannel(_this.compare_month, "#EDA025", _this.helper.getOrganicData(_this.data.compare.channels));
                //Visits Data
                _this.data["current"].visits = result[1]["current"];
                _this.data["compare"].visits = result[1]["compare"];
                //Bounce Rate
                _this.data["current"].bounceRate = Math.abs(result[2]["current"]);
                _this.data["compare"].bounceRate = Math.abs(result[2]["compare"]);
                //Monthly traffic
                _this.data["current"].traffic = result[3]["current"];
                _this.data["compare"].traffic = result[3]["compare"];
                //AllCompletion
                //  console.log(result[4]);
                _this.data["current"].goalCompletion = result[4]["current"]["goals"];
                _this.data["compare"].goalCompletion = result[4]["compare"]["goals"];
                _this.data["current"].sessions = result[4]["current"]["sessions"];
                _this.data["compare"].sessions = result[4]["compare"]["sessions"];
                _this.data["current"].goalConversionRate = (_this.data.current.goalCompletion / _this.data.current.sessions) * 100;
                _this.data["compare"].goalConversionRate = (_this.data.compare.goalCompletion / _this.data.compare.sessions) * 100;
                _this.data["current"].goalConversionRate = _this.data["current"].goalConversionRate.toFixed(1);
                _this.data["compare"].goalConversionRate = _this.data["compare"].goalConversionRate.toFixed(1);
                //sitegoalsviachannel
                _this.data["current"].goalCompletionByChannel = result[5]["current"];
                _this.data["compare"].goalCompletionByChannel = result[5]["compare"];
                //social
                _this.data["current"].social = result[6]["current"];
                _this.data["compare"].social = result[6]["compare"];
                //top pages
                _this.data["current"].top_pages = result[7];
                //top cities
                _this.data["current"].top_cities = result[8];
                //Goal Completion Rate
                // this.data["current"].goalCompletionRate=result[9]["current"];
                // this.data["compare"].goalCompletionRate=result[9]["compare"];
                //events
                _this.data["current"].events = result[10]["current"];
                _this.data["compare"].events = result[10]["compare"];
                //add month variable to switch between two year
                _this.data["compare"].month = _this.compare_month;
                //goals name
                _this.data["current"].goalCompletionByLocation = result[11]["current"];
                _this.data["compare"].goalCompletionByLocation = result[11]["compare"];
                console.log(_this.data["current"].goalCompletionByLocation);
                //All batch data
                _this.compare = _this.data["compare"];
                _this.siteGoalLocationUpdate(0);
                //event index for two binding
                _this.setEvent();
                //organic index for two binding
                _this.setOrganic();
                //social index for two binding
                _this.setPercentageandSymbol();
                // testing for goal and its channel
                //Can't use above promises because it will cache old request data
                //Fetch new Data For Previous year current month
                _this.query.setSingleDate(_this.first_month_start, _this.first_month_end);
                _this.query.getChannel().then(function (item) {
                    _this.data.last_year.channels = item["current"];
                    _this.data.last_year.organic = new OrganicChannel_data_1.OrganicChannel(_this.current_month, "#0000A0", _this.helper.getOrganicData(_this.data.last_year.channels));
                });
                _this.query.getMonthlyVisit().then(function (item) {
                    _this.data.last_year.visits = item["current"];
                });
                _this.query.getBounceRate().then(function (item) {
                    _this.data.last_year.bounceRate = item["current"];
                });
                _this.query.getMonthlyTraffic().then(function (item) {
                    _this.data.last_year.traffic = item["current"];
                });
                _this.query.getAllGoalCompletion().then(function (item) {
                    _this.data.last_year.goalCompletion = item["current"]["goals"];
                    _this.data.last_year.sessions = item["current"]["sessions"];
                    _this.data.last_year.goalConversionRate = (item["current"]["goals"] / item["current"]["sessions"]) * 100;
                    _this.data.last_year.goalConversionRate = _this.data.last_year.goalConversionRate.toFixed(1);
                });
                _this.query.getSiteGoalsViaChannel().then(function (item) {
                    _this.data.last_year.goalCompletionByChannel = item["current"];
                });
                _this.query.getSocial().then(function (item) {
                    _this.data.last_year.social = item["current"];
                });
                _this.query.getAllEvents().then(function (item) {
                    _this.data.last_year.events = item["current"];
                });
                _this.query.getGoalCompletionRate().then(function (item) {
                    _this.data.last_year.goalCompletionRate = item["current"];
                });
                _this.data["compare"].month = _this.current_month;
            })["catch"](function (e) {
                console.log(e);
                throw e;
            });
            // Data for goal and its respective channels 
            var result = [];
            var requests = [];
            var index = 1, i = 0;
            requests[i] = [];
            result[i] = [];
            //break
            this.goalSelection.forEach(function (item) {
                if (index % 5 == 0) {
                    i++;
                    requests[i] = [];
                }
                requests[i].push(_this.query.getAllGoalsParameter(item["id"]));
                index++;
            });
            this.data["current"].goalEvents = [];
            // this.data["compare"].goalEvent=[];
            requests.forEach(function (request) {
                _this.query.getBatchGoalsParameter(request).then(function (result) {
                    _this.data["current"].goalEvents = _this.data["current"].goalEvents.concat(result.current);
                    // this.data["compare"].goalEvent=this.data["compare"].goalEvent.concat(result.compare);
                    console.log(result);
                    _this.goalDetailsViaChannel(0);
                });
            });
            this.webceo.getProject(this.rankingAccount).then(function (item) {
                var json = JSON.parse(item["_body"]);
                _this.data.current.top_keyword = [];
                _this.data.current.keyword = [];
                json[0]["data"]["ranking_data"].forEach(function (item) {
                    var current_scan_history = item.positions[0].scan_history[1];
                    var compare_scan_history = item.positions[0].scan_history[0];
                    try {
                        var current_pos = current_scan_history.pos;
                        var previous_pos = compare_scan_history.pos;
                        var place_pos = 0;
                        var diff = current_pos - previous_pos;
                        if (diff == 0) {
                            previous_pos = "";
                        }
                        else if (current_pos != 0) {
                            var sign = _this.helper.getReturnSymbol(diff);
                            if (sign == "fa-arrow-up") {
                                diff = -diff;
                            }
                        }
                        else {
                            sign = "fa-arrow-down";
                        }
                        var obj = { "key": item.kw,
                            "organic_data": current_pos,
                            "difference_value": diff,
                            "difference": sign,
                            "pages": _this.helper.getPageDepth(current_pos),
                            "mobile": item.positions[0].mobile,
                            "mobile_pages": _this.helper.getPageDepth(item.positions[0].mobile)
                        };
                        if (sign == "fa-arrow-up") {
                            diff = -diff;
                            _this.data.current.top_keyword.push(obj);
                        }
                        if ("place" in current_scan_history) {
                            obj["place_current"] = current_scan_history.place.pos;
                            obj["place_current_pos"] = current_scan_history.place;
                        }
                        if ("place" in compare_scan_history) {
                            var compare_place_pos = compare_scan_history.place.pos;
                            diff = current_scan_history - compare_scan_history.place;
                            sign = _this.helper.getReturnSymbol(diff);
                            if (diff == 0) {
                                compare_place_pos = "";
                            }
                            else if (current_scan_history != 0) {
                                var sign = _this.helper.getReturnSymbol(diff);
                                if (sign == "fa-arrow-up") {
                                    diff = -diff;
                                }
                            }
                            else {
                                sign = "fa-arrow-down";
                            }
                            if (sign == "fa-arrow-up") {
                                diff = -diff;
                            }
                            obj["place"] = true;
                            obj["place_difference_value"] = sign;
                            obj["place_difference"] = diff;
                            obj["place_pages"] = _this.helper.getPageDepth(obj["place_current_pos"]);
                        }
                        _this.data.current.keyword.push(obj);
                    }
                    catch (e) {
                        _this.success = "alert alert-danger";
                        _this.code = "Please check with webceo provider and consult with developer";
                    }
                });
                _this.data.current.top_keyword.sort(function (a, b) {
                    return b.difference_value - a.difference_value;
                });
                _this.data.current.top_keyword = _this.data.current.top_keyword.slice(0, 5);
            });
            this.my_Class = true;
        }
        catch (e) {
            console.log(e);
        }
    };
    DashboardComponent.prototype.saveProject = function () {
        var _this = this;
        this.data["comment"] = this.comment;
        this.data["package"] = this.package;
        console.log("ok");
        this.webceo.saveProject({
            "current_date": this.first_month_start,
            "end_current_date": this.first_month_end,
            "previous_date": this.second_month_start,
            "end_previous_date": this.second_month_end,
            "client_name": this.client_name,
            "data": this.data
        }).then(function (res) {
            var body = JSON.parse(res._body);
            _this.success = "alert alert-success";
            _this.message_name = _this.error_messages[0];
            _this.code = "You Generated URL:" + window.location.origin + "/client/" + body.random_code;
        }, function (err) {
            console.log(err);
        });
    };
    DashboardComponent.prototype.siteGoalUpdate = function (value) {
        this.data["currentSiteGoal"] = this.data.goalCompletion[value].current_value;
        this.data["compareSiteGoal"] = this.data.goalCompletion[value].compare_value;
        this.data["goalCompare"] = this.helper.calculatePercentage(this.data["currentSiteGoal"], this.data["compareSiteGoal"]);
        this.data["symbol"] = this.helper.getSymbol(this.eventIndex.currentEvent, this.eventIndex.compareEvent);
        this.data["goalCompare"] = Math.abs(this.eventIndex.eventCompare);
    };
    DashboardComponent.prototype.siteEventUpdate = function (value) {
        this.eventIndex["currentEvent"] = this.events[value].current;
        this.eventIndex["compareEvent"] = this.events[value].compare;
        this.eventIndex["eventCompare"] = this.helper.calculatePercentage(this.eventIndex.currentEvent, this.eventIndex.compareEvent);
        this.eventIndex["symbol"] = this.helper.getSymbol(this.eventIndex.currentEvent, this.eventIndex.compareEvent);
        this.eventIndex["eventCompare"] = Math.abs(this.eventIndex.eventCompare);
    };
    DashboardComponent.prototype.siteGoalLocationUpdate = function (value) {
        this.eventIndex["currentEventGoalNumber"] = this.data["current"].goalCompletionByLocation[value].goalCompletionNumber;
        this.eventIndex["compareEventGoalNumber"] = this.data["compare"].goalCompletionByLocation[value].goalCompletionNumber;
        this.eventIndex["goalLocationCompare"] = this.helper.calculatePercentage(this.eventIndex.currentEventGoalNumber, this.eventIndex.compareEventGoalNumber);
        this.eventIndex["symbol"] = this.helper.getSymbol(this.eventIndex.currentEvent, this.eventIndex.compareEvent);
        this.eventIndex["goalCompare"] = Math.abs(this.eventIndex.eventCompare);
    };
    DashboardComponent.prototype.goalDetailsViaChannel = function (id) {
        console.log(id);
        var t = Number(id) + 1;
        this.retrievedData["current"] = this.data["current"].goalEvents.filter(function (goal) { return goal[0].name === "goal" + t + "Starts"; })[0][1];
        // this.retrievedData["compare"]=this.data["compare"].goalEvent.filter(goal=>goal[0].name==="goal"+t+"Starts")[0][1];
        console.log(this.retrievedData["current"]);
    };
    DashboardComponent.prototype.toggleMonth = function (month) {
        if (month == this.compare_month) {
            this.compare = this.data.compare;
            this.compare_index_month = this.compare_month;
            this.second_year = (Number(this.second_year) + 1).toString();
        }
        else if (month == this.current_month) {
            this.compare = this.data.last_year;
            this.compare_index_month = this.current_month.concat("-Last Year");
            this.second_year = (Number(this.second_year) - 1).toString();
        }
        this.setEvent();
        this.setOrganic();
    };
    DashboardComponent.prototype.setEvent = function () {
        var _this = this;
        this.events = new Array();
        this.events = this.data.current.events.map(function (val) {
            return _this.compare.events.filter(function (v) {
                return v.key === val.key;
            }).map(function (item) { return ({ "key": val.key, "current": val.value, "compare": item.value }); })[0];
        }).filter(function (item) {
            if (item) {
                return item;
            }
        });
        if (this.events.length > 0) {
            this.siteEventUpdate(0);
        }
    };
    DashboardComponent.prototype.setOrganic = function () {
        this.organic = [this.data.current.organic, this.compare.organic];
        console.log(this.bar_graph);
    };
    DashboardComponent.prototype.setPercentageandSymbol = function () {
        var _this = this;
        this.social = this.data.current.social.map(function (val) {
            return _this.compare.social.filter(function (v) {
                return v.name == val.name;
            }).map(function (item) { return ({ "key": val.name, "current": val.value, "compare": item.value }); })[0];
        });
        this.social.forEach(function (item) {
            _this.percentage[item.key] = _this.helper.getPositivePercentage(item.current, item.compare);
            _this.symbol[item.key] = _this.helper.getSymbol(item.current, item.compare);
        });
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: './dashboard.component.html',
        providers: [common_1.Location, { provide: common_1.LocationStrategy, useClass: common_1.PathLocationStrategy }],
        styleUrls: ['./dashboard.component.css',
            '../../../node_modules/ng-pick-datetime/assets/style/picker.min.css',
            '../../../node_modules/nvd3/build/nv.d3.min.css'],
        encapsulation: core_1.ViewEncapsulation.None
    })
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
