"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var TrafficComponent = (function () {
    function TrafficComponent(query, dataset, helper, chart) {
        this.query = query;
        this.dataset = dataset;
        this.helper = helper;
        this.chart = chart;
        this.data = dataset;
        //Legend text for pie chart 
        this.pie_chart = this.chart.setChartType("pieChart").addRender(function (e) {
            d3.selectAll(".nv-legend text")[0].forEach(function (d) {
                var u = d3.select(d).data()[0];
                if (u.value != undefined && u.key != undefined) {
                    //set the new data in the innerhtml
                    d3.select(d).html(u.key + " - " + u.value);
                }
            });
        }).getChart();
    }
    TrafficComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.generateReport.subscribe(function (v) {
            if (v === true) {
                _this.getTrafficData();
            }
        });
        this.generateOldReport.subscribe(function (v) {
            if (v === true) {
                _this.getLastTrafficData();
            }
        });
    };
    TrafficComponent.prototype.getTrafficData = function () {
        var _this = this;
        this.query.getMonthlyTraffic().then(function (result) {
            _this.dataset.setCurrentData("traffic", result["current"]);
            _this.dataset.setCompareData("traffic", result["compare"]);
        });
    };
    return TrafficComponent;
}());
__decorate([
    core_1.Input()
], TrafficComponent.prototype, "current_month");
__decorate([
    core_1.Input()
], TrafficComponent.prototype, "compare_month");
__decorate([
    core_1.Input()
], TrafficComponent.prototype, "first_year");
__decorate([
    core_1.Input()
], TrafficComponent.prototype, "second_year");
__decorate([
    core_1.Input()
], TrafficComponent.prototype, "generateReport");
__decorate([
    core_1.Input()
], TrafficComponent.prototype, "generateOldReport");
TrafficComponent = __decorate([
    core_1.Component({
        selector: 'traffic',
        templateUrl: '../pages/traffic.component.html'
    })
], TrafficComponent);
exports.TrafficComponent = TrafficComponent;
