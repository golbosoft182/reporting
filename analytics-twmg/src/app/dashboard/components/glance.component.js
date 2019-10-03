"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var OrganicChannel_data_1 = require("../../models/OrganicChannel.data");
var GlanceComponent = (function () {
    // private data;
    function GlanceComponent(query, dataset, helper) {
        this.query = query;
        this.dataset = dataset;
        this.helper = helper;
        // this.data=dataset; 
        // console.log(this.data);
        this.glanceLoad = new core_1.EventEmitter();
    }
    GlanceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.generateReport.subscribe(function (v) {
            if (v === true) {
                _this.getGlanceData();
            }
        });
        this.generateOldReport.subscribe(function (v) {
            if (v === true) {
                _this.getLastGlanceData();
            }
        });
    };
    GlanceComponent.prototype.setGlanceData = function () {
    };
    GlanceComponent.prototype.getGlanceData = function () {
        var _this = this;
        var promises = [this.query.getChannel(), this.query.getMonthlyVisit(), this.query.getBounceRate(),
            this.query.getAllGoalCompletion(), this.query.getEcommerceData()];
        Promise.all(promises).then(function (result) {
            // this.data["current"].channels=result[0]["current"];
            // this.data["current"].organic=new OrganicChannel(this.current_month+" "+this.first_year,"#2e86bf",this.helper.getOrganicData(this.data.current.channels));
            // this.data["compare"].channels=result[0]["compare"];
            // this.data["compare"].organic=new OrganicChannel(this.compare_month+" "+(this.second_year),"#2ebfac",this.helper.getOrganicData(this.data.compare.channels));
            //Visits Data
            // this.dataset["current"].bounceRate=Math.abs(result[2]["current"]);
            // this.dataset["compare"].bounceRate=Math.abs(result[2]["compare"]);
            // //Monthly traffic
            // this.dataset["current"].traffic=result[3]["current"];
            // this.dataset["compare"].traffic=result[3]["compare"];
            //AllCompletion
            // this.dataset["current"].goalCompletion=result[4]["current"]["goals"];
            // this.dataset["compare"].goalCompletion=result[4]["compare"]["goals"];
            // this.dataset["current"].sessions=result[4]["current"]["sessions"];
            // this.dataset["compare"].sessions=result[4]["compare"]["sessions"];
            // this.data["current"].visits=result[1]["current"];
            // this.data["compare"].visits=result[1]["compare"];
            // this.dataset.setCompareData("goalConversionRate",result[4]["compare"]);
            // this.dataset["current"].goalConversionRate=(this.dataset.current.goalCompletion/this.dataset.current.sessions)*100;
            // this.dataset["compare"].goalConversionRate=(this.dataset.compare.goalCompletion/this.dataset.compare.sessions)*100;
            // this.dataset["current"].goalConversionRate=this.dataset["current"].goalConversionRate.toFixed(1);
            // this.dataset["compare"].goalConversionRate=this.dataset["compare"].goalConversionRate.toFixed(1);
            _this.dataset.setCurrentData("channels", result[0]["current"]);
            _this.dataset.setCompareData("channels", result[0]["compare"]);
            _this.dataset.setCurrentData("organic", new OrganicChannel_data_1.OrganicChannel(_this.current_month + " " + _this.first_year, "#2e86bf", _this.helper.getOrganicData(result[0]["current"])));
            _this.dataset.setCompareData("organic", new OrganicChannel_data_1.OrganicChannel(_this.compare_month + " " + (_this.second_year), "#2ebfac", _this.helper.getOrganicData(result[0]["compare"])));
            _this.dataset.setCurrentData("visits", result[1]["current"]);
            _this.dataset.setCompareData("visits", result[1]["compare"]);
            _this.dataset.setCurrentData("bounceRate", result[2]["current"]);
            _this.dataset.setCompareData("bounceRate", result[2]["compare"]);
            _this.dataset.setCurrentData("goalCompletion", result[3]["current"]["goals"]);
            _this.dataset.setCompareData("goalCompletion", result[3]["compare"]["goals"]);
            _this.dataset.setCurrentData("sessions", result[3]["current"]["sessions"]);
            _this.dataset.setCompareData("sessions", result[3]["compare"]["sessions"]);
            _this.dataset.setCurrentData("goalConversionRate", (_this.dataset.getCurrentData("goalCompletion") / _this.dataset.getCurrentData("sessions")) * 100);
            _this.dataset.setCompareData("goalConversionRate", (_this.dataset.getComparedData("goalCompletion") / _this.dataset.getComparedData("sessions")) * 100);
            _this.dataset.setCurrentData("goalConversionRate", _this.dataset.getCurrentData("goalConversionRate").toFixed(1));
            _this.dataset.setCompareData("goalConversionRate", _this.dataset.getComparedData("goalConversionRate").toFixed(1));
            //transaction
            _this.dataset.setCurrentData("transactions", result[4]["current"]["transactions"]);
            _this.dataset.setCompareData("transactions", result[4]["compare"]["transactions"]);
            _this.dataset.setCompareData("revenue", result[4]["compare"]["revenue"]);
            _this.dataset.setCompareData("revenue", result[4]["compare"]["revenue"]);
            // this.dataset["current"].transactions=result[6]["current"]["transactions"];
            // this.dataset["compare"].transactions=result[6]["compare"]["transactions"];
            // this.dataset["current"].revenue=result[6]["current"]["revenue"];
            // this.dataset["compare"].revenue=result[6]["compare"]["revenue"];
            _this.glanceLoad.emit(true);
            // this.data=dataset;
        })["catch"](function (e) {
            throw e;
        });
    };
    GlanceComponent.prototype.getLastGlanceData = function () {
        var _this = this;
        this.query.getChannel().then(function (item) {
            _this.dataset.setLastYear("channels", item["current"]);
            _this.dataset.setLastYear("organic", new OrganicChannel_data_1.OrganicChannel(_this.current_month + (Number(_this.second_year) - 1).toString(), "#0000A0", _this.helper.getOrganicData(_this.dataset.last_year.channels)));
        });
        this.query.getMonthlyVisit().then(function (item) {
            _this.dataset.setLastYear("visits", item["current"]);
        });
        this.query.getBounceRate().then(function (item) {
            _this.dataset.setLastYear("bounceRate", item["current"]);
        });
        this.query.getMonthlyTraffic().then(function (item) {
            _this.dataset.setLastYear("traffic", item["current"]);
        });
        this.query.getAllGoalCompletion().then(function (item) {
            if (item["current"]["goals"]) {
                _this.dataset.last_year.goalCompletion = item["current"]["goals"];
            }
            _this.dataset.last_year.sessions = item["current"]["sessions"];
            _this.dataset.last_year.goalConversionRate = (item["current"]["goals"] / item["current"]["sessions"]) * 100;
            _this.dataset.last_year.goalConversionRate = _this.dataset.last_year.goalConversionRate.toFixed(1);
        });
    };
    return GlanceComponent;
}());
__decorate([
    core_1.Input()
], GlanceComponent.prototype, "current_month");
__decorate([
    core_1.Input()
], GlanceComponent.prototype, "compare_month");
__decorate([
    core_1.Input()
], GlanceComponent.prototype, "first_year");
__decorate([
    core_1.Input()
], GlanceComponent.prototype, "second_year");
__decorate([
    core_1.Input()
], GlanceComponent.prototype, "generateReport");
__decorate([
    core_1.Input()
], GlanceComponent.prototype, "generateOldReport");
__decorate([
    core_1.Output()
], GlanceComponent.prototype, "glanceLoad");
GlanceComponent = __decorate([
    core_1.Component({
        selector: 'glance',
        templateUrl: '../pages/glance.component.html'
    })
], GlanceComponent);
exports.GlanceComponent = GlanceComponent;
