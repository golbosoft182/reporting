"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var Helper = (function () {
    function Helper() {
    }
    Helper.prototype.calculatePercentage = function (new_value, old_value) {
        var percentage;
        if (old_value != null && new_value != null) {
            if (new_value != 0 && old_value != 0) {
                percentage = new_value - old_value;
                percentage = percentage / old_value * 100;
            }
            else if (new_value > 0 && old_value == 0) {
                percentage = 100;
            }
            else if (old_value > 0 && new_value == 0) {
                percentage = -100;
            }
            else {
                percentage = "No Change";
            }
            if (!isNaN(percentage)) {
                percentage = Math.round(percentage * 100) / 100;
            }
            else {
                percentage = 0;
            }
            return percentage;
        }
        else if (new_value > 0 && old_value == null) {
            percentage = 100;
            return percentage;
        }
        else if (old_value > 0 && new_value == null) {
            percentage = -100;
            return percentage;
        }
        else {
            return 0;
        }
    };
    Helper.prototype.getPositivePercentage = function (new_value, old_value) {
        return Math.abs(this.calculatePercentage(new_value, old_value));
    };
    Helper.prototype.getSymbol = function (new_value, old_value, name) {
        if (name === void 0) { name = ""; }
        var result;
        var value = this.calculatePercentage(new_value, old_value);
        if (name != "") {
            // console.log(old_value);
        }
        if (value > 0) {
            result = "fa-arrow-up arrow";
        }
        else if (value < 0) {
            result = "fa-arrow-down arrow";
        }
        else {
            result = "no-change";
        }
        return result;
    };
    Helper.prototype.getEventSymbol = function (new_value, old_value) {
        var result;
        var value = this.calculatePercentage(new_value, old_value);
        if (value > 0) {
            result = "fa-arrow-up arrow";
        }
        else if (value < 0) {
            result = "fa-arrow-down arrow";
        }
        else {
            result = "no-change";
        }
        return result;
    };
    Helper.prototype.getReturnSymbol = function (value) {
        var result;
        if (value < 0) {
            result = "fa-arrow-up";
        }
        else if (value > 0) {
            result = "fa-arrow-down";
        }
        else {
            result = "";
        }
        return result;
    };
    //create good logic through math, improvision needed
    Helper.prototype.getPageDepth = function (current_pos) {
        var pages;
        if (current_pos == 0) {
            pages = 0;
        }
        else if (current_pos <= 10 && current_pos > 0) {
            pages = 1;
        }
        else if (current_pos <= 20) {
            pages = 2;
        }
        else if (current_pos <= 30) {
            pages = 3;
        }
        else if (current_pos <= 40) {
            pages = 4;
        }
        else {
            pages = 5;
        }
        return pages;
    };
    Helper.prototype.getMonthString = function (date) {
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return month[new Date(date).getMonth()];
    };
    Helper.prototype.getName = function (date) {
        return new Date(date).getFullYear();
    };
    Helper.prototype.getPreviousYearDates = function (start_date) {
        var result = [];
        var date = new Date(start_date);
        date.setFullYear(date.getFullYear() - 1);
        return date.toISOString().slice(0, 10);
    };
    Helper.prototype.getOrganicData = function (data) {
        var result = data.filter(function (item) {
            if (item.key === "Organic Search") {
                return true;
            }
        }).map(function (item) { return ({ "value": item.value }); });
        if (result.length == 0) {
            result = [{ "value": 0 }];
        }
        return result;
    };
    Helper.prototype.getSocialPercentage = function (key) {
        console.log(key);
    };
    Helper.prototype.calculateGoalConversionRate = function (currentValue, compareValue, totalSessionCurrent, totalSessionCompare) {
        if (currentValue != null && totalSessionCurrent != null) {
            var currentPercentage = (currentValue / totalSessionCurrent) * 100;
        }
        else {
            var currentPercentage = 0;
        }
        if (compareValue != null && totalSessionCompare != null) {
            var comparePercentage = (compareValue / totalSessionCompare) * 100;
        }
        else {
            var comparePercentage = 0;
        }
        return this.getPositivePercentage(currentPercentage, comparePercentage);
    };
    Helper.prototype.getHelpText = function (channel_name) {
        var arr = [{
                name: "Direct",
                text: "URL was typed directly into the search bar"
            },
            {
                name: "Organic Search",
                text: "Site was found using a search engine by users"
            },
            {
                name: "Paid Search",
                text: "Site was found by an ad on a search engine"
            },
            {
                name: "Referral",
                text: "method of reporting visits that came to your site from sources outside of its search engine"
            },
            {
                name: "Social",
                text: "Site was accessed directly from one of your social media accounts"
            }
        ];
        var obj = arr.filter(function (val) {
            return val.name === channel_name;
        });
        var str = "";
        if (obj.length > 0) {
            str = obj[0]["text"];
        }
        return str;
    };
    return Helper;
}());
Helper = __decorate([
    core_1.Injectable()
], Helper);
exports.Helper = Helper;
