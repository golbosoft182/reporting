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
var ChartService = (function () {
    function ChartService() {
        this["default"] = {
            height: 400,
            x: function (d) { return d.label; },
            y: function (d) { return d.value; },
            duration: 700,
            labelThreshold: 0.8,
            labelSunbeamLayout: true,
            showValues: true,
            showLabels: true,
            transition: 100,
            ease: "bounce",
            legend: {
                margin: {
                    top: 5,
                    right: 10,
                    bottom: 5,
                    left: 35
                },
                padding: 150,
                rightAlign: false
            }
        };
        this.chart = Object.assign({}, this["default"]);
    }
    ChartService.prototype.setChartOption = function (obj) {
        this.chart = Object.assign(this.chart, obj);
        return this;
    };
    ChartService.prototype.setChartType = function (type) {
        this.chart.type = type;
        return this;
    };
    ChartService.prototype.setXaxis = function (xAxis) {
        this.chart.xAxis = xAxis;
        return this;
    };
    ChartService.prototype.setYAxis = function (yAxis) {
        this.chart.yAxis = yAxis;
        return this;
    };
    ChartService.prototype.setColor = function (colors) {
        this.chart.colors = colors;
        return this;
    };
    ChartService.prototype.setPieRender = function () {
        this.chart.pie = {
            dispatch: {
                renderEnd: function (e) {
                }
            }
        };
        return this;
    };
    ChartService.prototype.addStatechange = function (state) {
        this.chart.dispatch = { "stateChange": state };
        return this;
    };
    ChartService.prototype.addRender = function (render) {
        this.chart.dispatch = { "renderEnd": render };
        return this;
    };
    ChartService.prototype.addCallback = function (func) {
        this.chart.callback = func;
        return this;
    };
    ChartService.prototype.getChart = function () {
        var return_value = { "chart": this.chart };
        this.chart = Object.assign({}, this["default"]);
        return return_value;
    };
    ChartService.prototype.updateChart = function () {
        // this.chart.
        return this;
    };
    return ChartService;
}());
ChartService = __decorate([
    core_1.Injectable()
], ChartService);
exports.ChartService = ChartService;
