"use strict";
exports.__esModule = true;
var GetGoalParameter = (function () {
    function GetGoalParameter(userType, newVisits, returnVisits) {
        this.userType = userType;
        this.newVisits = newVisits;
        this.returnVisits = returnVisits;
        this.total = Number(this.newVisits) + Number(this.returnVisits);
    }
    return GetGoalParameter;
}());
exports.GetGoalParameter = GetGoalParameter;
