"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var DataService = (function () {
    function DataService() {
        this.current = {};
        this.compare = {};
        this.last_year = {};
        this.current_index = 0;
        this.comments = [];
    }
    DataService.prototype.setCurrentData = function (key, value) {
        this.current[key] = value;
    };
    DataService.prototype.setCompareData = function (key, value) {
        this.compare[key] = value;
    };
    DataService.prototype.setLastYear = function (key, value) {
        this.last_year[key] = value;
    };
    DataService.prototype.setCurrentIndex = function (index) {
        this.current_index = index;
    };
    DataService.prototype.setComment = function (key, comment) {
        this.comments[key] = comment;
    };
    DataService.prototype.getCurrentData = function (key) {
        return this.current[key];
    };
    DataService.prototype.getComparedData = function (key) {
        return this.current_index === 0 ? this.compare[key] : this.last_year[key];
    };
    DataService.prototype.getComment = function (key) {
        return this.comments[key];
    };
    return DataService;
}());
DataService = __decorate([
    core_1.Injectable()
], DataService);
exports.DataService = DataService;
