"use strict";
exports.__esModule = true;
var Request = (function () {
    function Request() {
        this.viewId = 0;
        this.metrics = new Array();
        this.dimensions = new Array();
        this.dateRanges = new Array();
        this.dateRanges[0] = {};
        this.dateRanges[1] = {};
    }
    Request.prototype.setViewId = function (viewId) {
        this.viewId = viewId;
    };
    Request.prototype.setPageSize = function (size) {
        this.pageSize = size;
    };
    Request.prototype.setEmptyRows = function (empty_rows) {
        this.includeEmptyRows = empty_rows;
    };
    Request.prototype.setMetrics = function (metrics) {
        this.metrics = metrics;
    };
    Request.prototype.setDimensions = function (dimensions) {
        this.dimensions = dimensions;
    };
    return Request;
}());
exports.Request = Request;
