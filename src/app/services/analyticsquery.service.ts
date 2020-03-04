import {NgZone, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

declare var gapi: any;

import {Helper} from '../Utils/Helper';
import {AnalyticsService} from './analytics.service';
import {Model} from '../models/Model.data';
import {Page} from '../models/Page.data';
import {City} from '../models/City.data';
import {Channel} from '../models/Channel.data';
import {OrganicChannel} from '../models/OrganicChannel.data';
import {Visit} from '../models/Visit.data';
import {Request} from '../models/Request.data';
import {Goal} from '../models/Goal.data';
import {GetGoalParameter} from '../models/GetGoalParameter';
import {ChannelName} from '../models/ChannelName';


@Injectable()
export class AnalyticsQuery {
  public request: any;
  public result: any;
  public batchRequest: any;
  private request_obj: Request;
  private colors: Array<string>;

  constructor(private service: AnalyticsService, private helper: Helper) {
    this.helper = helper;
    this.request_obj = new Request();
    this.request_obj.setPageSize(10);
    this.request_obj.setEmptyRows(true);

    this.request = {viewId: 0, metrics: [], pageSize: 10, includeEmptyRows: true};
    this.request.filtersExpression = 'ga:city!=Surabaya';
    this.request.dateRanges = [];
    this.batchRequest = [];
    this.request.dateRanges[0] = {};
    this.request.dateRanges[1] = {};
    // this.colors=["#576ea1","#2ebfac","#3f9ebf","#00cbe0","#00ade0","#2687cc","#1d8dd1","#108676"];
    this.colors = ['#00ade0', '#0000e0', '#e000ce', '#e00000', '#e0de00', '#00e010', '#e06f00', '#00d8e0'];
  }

  setViewId(viewId) {
    this.request.viewId = viewId;
    this.request_obj.setViewId(viewId);
  }

  setCurrentDate(startDate, endDate) {
    this.request.dateRanges[0] = {};
    this.request.dateRanges[0]['startDate'] = startDate;
    this.request.dateRanges[0]['endDate'] = endDate;
  }

  setCompareDate(startDate, endDate) {
    this.request.dateRanges[1] = {};
    this.request.dateRanges[1]['startDate'] = startDate;
    this.request.dateRanges[1]['endDate'] = endDate;
  }

  setSingleDate(startDate, endDate) {
    this.request['dateRanges'][0].startDate = startDate;
    this.request['dateRanges'][0].endDate = endDate;
    delete this.request['dateRanges'][1];
  }

  getRawQuery(request): Promise<any> {
    return this.queryAccount(request);
  }

  queryAccount(request): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.client.request({
        path: '/v4/reports:batchGet',
        root: 'https://analyticsreporting.googleapis.com/',
        method: 'POST',
        body: {
          reportRequests: [request]
        }
      }).then(resolve, reject);
    });
  }

  queryBatch(request): Promise<any> {
    return new Promise((resolve, reject) => {
    });
  }

  getRequestObject() {
    return Object.assign({}, this.request);
  }

  getMonthlyVisit(): Promise<any> {
    let request = this.getRequestObject();
    let arr = [];
    request.metrics = [{'expression': 'ga:sessions'}];
    request.dimensions = [{'name': 'ga:userType'}];
    return new Promise((resolve, reject) => {
      this.queryAccount(request).then(response => {
        let result = {};
        let current_visit, compare_visit;
        let data = response.result.reports[0].data;
        let item = data.rows;

        if (item) {
          if (item[1].dimensions) {
            current_visit = new Visit(item[0].metrics[0].values[0], item[1].metrics[0].values[0], data.totals[0].values[0]);
            result['current'] = current_visit;
            if (item[0].metrics[1] && item[1].metrics[1] && data.totals[1]) {
              compare_visit = new Visit(item[0].metrics[1].values[0], item[1].metrics[1].values[0], data.totals[1].values[0]);
              result['compare'] = compare_visit;
            }

          } else {
            if (item[0].dimensions[0] === 'New Visitor') {
              current_visit = new Visit(item[0].metrics[0].values[0], 0, data.totals[0].values[0]);
              if (item[0].metrics[1] && data.totals[1]) {
                compare_visit = new Visit(item[0].metrics[1].values[0], 0, data.totals[1].values[0]);
                result['compare'] = compare_visit;
              }
            } else {
              current_visit = new Visit(0, item[0].metrics[0].values[0], data.totals[0].values[0]);
              if (item[0].metrics[1] && data.totals[1]) {
                compare_visit = new Visit(0, item[0].metrics[0].values[0], data.totals[1].values[0]);
                result['compare'] = compare_visit;
              }
            }
          }
        }
        resolve(result);
      }, err => {
        reject(err);
      });
    });
  }

  getEcommerceData() {
    let request = this.getRequestObject();
    let arr = [];
    request.metrics = [{'expression': 'ga:transactions'}, {'expression': 'ga:transactionRevenue'}];
    return new Promise((resolve, reject) => {
      let result = {};
      this.queryAccount(request).then(response => {
        let data = response.result.reports[0].data;
        result['current'] = {};
        result['compare'] = {};
        if (data) {
          let item = data.rows[0];
          console.log(item);
          if (item) {
            result['current']['transactions'] = item.metrics[0].values[0];
            result['current']['revenue'] = item.metrics[0].values[1];
            if (item.metrics[1]) {
              result['compare']['transactions'] = item.metrics[1].values[0];
              result['compare']['revenue'] = item.metrics[1].values[1];
            }
          }

        }
        resolve(result);
      }, err => {
        reject(err);
      });
    });
  }

  getChannel(): Promise<any> {
    let request = this.getRequestObject();
    let arr = [];
    request.metrics = [{'expression': 'ga:sessions'}];
    request.dimensions = [{'name': 'ga:channelGrouping'}];

    return new Promise((resolve, reject) => {
      this.queryAccount(request).then(response => {
        let channels = new Array<Channel>(), compare_channels = new Array<Channel>();
        let result = {};
        let reports = response.result.reports[0];
        //checking for undefined data
        if (reports) {
          if (reports.data['rows']) {
            let i = 0;
            response.result.reports[0].data.rows.forEach((item) => {
              let key = item.dimensions[0];
              let channel = new Channel(key, item.metrics[0].values[0], this.colors[i]);
              channels.push(channel);
              if (item.metrics[1]) {
                channel = new Channel(key, item.metrics[1].values[0], this.colors[i]);
                compare_channels.push(channel);
              }
              i++;
            });
          }

        }

        result['current'] = channels;
        if (compare_channels.length > 0) {
          result['compare'] = compare_channels;
        }
        resolve(result);
      }, err => {
        reject(err);
      });
    });
  }

  getBounceRate(): Promise<any> {
    let request = this.getRequestObject();
    request.metrics = [{'expression': 'ga:bounceRate'}];
    return new Promise((resolve, reject) => {
      this.queryAccount(request).then(response => {
        let result = {};
        //checking for undefined data
        if (response.result.reports[0].data['rows']) {
          let item = response.result.reports[0].data.rows[0];
          result['current'] = Number(item.metrics[0].values[0]).toFixed(2);
          if (item.metrics[1]) {
            result['compare'] = Number(item.metrics[1].values[0]).toFixed(2);
          }

        }
        resolve(result);
      }, err => {
        reject(err);
      });
    });
  }

  getMonthlyTraffic(): Promise<any> {
    let request = this.getRequestObject();
    request.metrics = [{'expression': 'ga:sessions'}];
    request.dimensions = [{'name': 'ga:deviceCategory'}];
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.queryAccount(request).then(response => {
          let result = [], current = [], compare = [];
          //checking for undefined data
          if (response.result.reports[0]) {
            let res = response.result.reports[0].data;
            if (res['rows']) {
              let metric_length = res['rows'][0].metrics.length;
              let i = 0;
              res.rows.forEach((item, key) => {
                current.push(new Model(item.dimensions[0], item.metrics[0].values[0], this.colors[i]));
                if (item.metrics[1]) {
                  compare.push(new Model(item.dimensions[0], item.metrics[1].values[0], this.colors[i]));
                }
                i++;
              });
            }
          }
          result['current'] = current;
          if (compare.length > 0) {
            result['compare'] = compare;
          }
          resolve(result);
        }, err => {
          reject(err);
        });
      }, 4000);

    });
  }

  getAllGoalCompletion(): Promise<any> {
    let request = this.getRequestObject();

    request.metrics = [{'expression': 'ga:goalCompletionsAll'}, {'expression': 'ga:sessions'}];

    request.includeEmptyRows = false;
    return new Promise((resolve, reject) => {
      this.queryAccount(request).then(response => {
        let result = {};
        //checking for undefined data
        let reports = response.result.reports[0];
        if (reports) {
          if (reports.data['rows']) {
            let item = reports.data.rows[0];
            if (item.metrics.length > 0) {
              result['current'] = {goals: Number(item.metrics[0].values[0]), sessions: Number(item.metrics[0].values[1])};
              if (item.metrics[1]) {
                result['compare'] = {goals: Number(item.metrics[1].values[0]), sessions: Number(item.metrics[1].values[1])};
              }
            }
          } else {
            result['current'] = {goals: 0, sessions: 0};
          }
        }

        resolve(result);
      }, err => {
        reject(err);
      });
    });

  }

  getSiteGoalsViaChannel(): Promise<any> {
    let request = this.getRequestObject();
    let result = {};
    request.metrics = [{'expression': 'ga:goalCompletionsAll'}];
    request.dimensions = [{'name': 'ga:channelGrouping'}, {'name': 'ga:userType'}];
    request.includeEmptyRows = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.queryAccount(request).then(response => {
          //checking for undefined data
          if (response.result.reports[0]) {
            let data = response.result.reports[0].data;
            result['current'] = [];
            result['compare'] = [];
            if (data.rows) {
              let current = data.rows.map(item => ({'Group': item.dimensions[0], [item.dimensions[1]]: Number(item.metrics[0].values[0])}));
              result['current'] = this.reduceArray(current);
              if (data.totals.length > 1) {
                let compare = data.rows.map(item => ({
                  'Group': item.dimensions[0],
                  [item.dimensions[1]]: Number(item.metrics[1].values[0])
                }));
                result['compare'] = this.reduceArray(compare);
              }
            }

          }
          resolve(result);
        }, err => {
          reject(err);
        });
      }, 3000);

    });
  }

  reduceArray(Goals): any {
    let keys = [], result = [];
    Goals.forEach(item => {
      let key = item.Group;
      if (!keys.includes(key)) {
        keys.push(key);
        result.push(item);
      } else {
        // delete item.Group;
        let index = result.findIndex(function(channel) {
          return channel.Group === key;
        });
        Object.assign(result[index], item);
      }
    });
    return result;
  }

  getAllEvents(filterExpression: String): Promise<any> {
    let request = this.getRequestObject();
    let result = {}, current = new Array<Model>(), compare = new Array<Model>();

    request.metrics = [{'expression': 'ga:totalEvents'}];
    request.dimensions = [{'name': 'ga:eventCategory'}];
    request.pageSize = 100;
    // request.filtersExpression="ga:eventLabel=@Phone,ga:eventLabel=@phone,ga:eventLabel=@contact,ga:eventLabel=@call,ga:eventLabel=@Call,ga:eventLabel=@Text",
    request.filtersExpression += filterExpression;
    request.includeEmptyRows = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.queryAccount(request).then(response => {
          let data = response.result.reports[0].data;
          result['current'] = [];
          result['compare'] = [];
          if ('rows' in data) {
            data.rows.forEach(item => {
              result['current'].push(new Model(item.dimensions[0], item.metrics[0].values[0]));
              if (item.metrics[1]) {
                result['compare'].push(new Model(item.dimensions[0], item.metrics[1].values[0]));
              }
            });
          }
          resolve(result);
        }, err => {
          reject(err);
        });
      }, 4000);
    });
  }

  getSocial() {
    let request = this.getRequestObject();
    request.metrics = [{'expression': 'ga:sessions'}];
    request.dimensions = [{'name': 'ga:socialNetwork'}];
    request.includeEmptyRows = true;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.queryAccount(request).then(response => {
          let data = response.result.reports[0].data;
          if ('rows' in data) {
            let result = [];
            let social = data.rows.filter(item => {
              let key = item.dimensions[0];
              if (['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Blogger'].includes(key)) {
                return true;
              }
            }).map(item => ({'name': item.dimensions[0], 'value': item.metrics[0].values[0]}));

            result['current'] = social;
            if (data.rows[0].metrics[1] != undefined) {
              social = data.rows.filter(item => {
                let key = item.dimensions[0];
                if (['Facebook', 'Instagram', 'LinkedIn', 'Twitter', 'Blogger'].includes(key)) {
                  return true;
                }
              }).map(item => ({'name': item.dimensions[0], 'value': item.metrics[1].values[0]}));
              result['compare'] = social;
            }
            resolve(result);
          }

        }, err => {
          reject(err);
        });
      }, 4000);
    });
  }

  getGoalCompletionRate() {
    let request = this.getRequestObject();
    request.metrics = [{'expression': 'ga:goalConversionRateAll'}];
    return new Promise((resolve, reject) => {
      this.queryAccount(request).then(response => {
        let data = response.result.reports[0].data;
        if ('rows' in data) {
          let result = {};
          result['current'] = Number(data.rows[0].metrics[0].values[0]).toFixed(2);
          if (data.rows[0].metrics[1]) {
            result['compare'] = Number(data.rows[0].metrics[1].values[0]).toFixed(2);
          }
          resolve(result);
        }
      }, err => {
        reject(err);
      });
    });
  }

  getTopPages(): Promise<any> {
    let request = this.getRequestObject();
    request.metrics = [{'expression': 'ga:pageviews'}];
    request.dimensions = [{'name': 'ga:pagePath'}];
    request.orderBys = [{'fieldName': 'ga:pageviews', 'sortOrder': 'DESCENDING'}];
    return new Promise((resolve, reject) => {
      this.queryAccount(request).then(response => {
        let result = response.result.reports[0].data.rows.map(item => (new Page(item.dimensions[0], item.metrics[0].values[0])));
        resolve(result);
      }, err => {
        reject(err);
      });
    });
  }

  getTopCities(): Promise<any> {
    let request = this.getRequestObject();
    request.metrics = [{'expression': 'ga:sessions'}, {'expression': 'ga:goalCompletionsAll'}];
    request.dimensions = [{'name': 'ga:city'}];
    request.pageSize = 10;
    request.orderBys = [{'fieldName': 'ga:sessions', 'sortOrder': 'DESCENDING'}];
    // request.filtersExpression="ga:goalCompletionsAll!=0";
    return new Promise((resolve, reject) => {
      this.queryAccount(request).then(response => {
        let result = [];
        if (typeof response.result['reports'][0].data.rows !== 'undefined') {
          result = response.result.reports[0].data.rows.map(item => (
            new City(item.dimensions[0], item.metrics[0].values[0], item.metrics[0].values[1])
          ));
        }
        resolve(result);
      }, err => {
        reject(err);
      });
    });
  }

  getGoalNames(): Promise<any> {
    let request = this.getRequestObject();
    request.metrics = [{'expression': 'ga:goalCompletionsAll'}];
    request.dimensions = [{'name': 'ga:goalCompletionLocation'}];
    request.orderBys = [{'fieldName': 'ga:goalCompletionLocation', 'sortOrder': 'ASCENDING'}];
    return new Promise((resolve, reject) => {
      this.queryAccount(request).then(response => {
        let data = response.result.reports[0].data;
        let result = {};
        result['current'] = [];
        result['compare'] = [];

        data.rows.forEach(item => {
          result['current'].push(new Goal(item.metrics[0].values[0], item.dimensions[0]));
          if (item.metrics[1]) {
            result['compare'].push(new Goal(item.metrics[1].values[0], item.dimensions[0]));
          }
        });

        resolve(result);
      }, err => {
        reject(err);
      });
    });

  }

  // Testing for values for goals
  getAllGoalsParameter(id): any {
    let request = this.getRequestObject();
    request.metrics = [{'expression': 'ga:goal' + id + 'Completions'}];
    request.dimensions = [{'name': 'ga:userType'}, {'name': 'ga:channelGrouping'}];
    request.pageSize = 100;
    return request;
  }

  getExcludedGoalCompletion(ids): Promise<any> {
    let request = this.getRequestObject();
    request.metrics = [];

    ids.forEach((id) => {
      request.metrics.push({'expression': 'ga:goal' + id + 'Completions'});
    });

    return new Promise((resolve, reject) => {
      this.queryAccount(request).then(response => {
        let data = response.result.reports[0].data;
        resolve(data);
      }).catch(err => {
        console.log(err);
      });
    });
  }

  getBatchGoalsParameter(requests): Promise<any> {
    return new Promise((resolve, reject) => {
      let result = {};
      let total = {};
      result['current'] = [];
      result['compare'] = [];
      result['total'] = [];
      setTimeout(() => {
        this.queryAccount(requests).then(response => {
          let reports = response['result'].reports;
          if (reports) {
            reports.forEach((report, index) => {
              let key = report.columnHeader.metricHeader.metricHeaderEntries[0].name;
              key = key.substring(key.indexOf(':') + 1);
              result['current'][index] = [];
              result['current'][index][0] = {'name': key};
              result['current'][index][1] = [];
              result['current'][index][2] = report.data.totals[0].values[0];

              if (report.data.totals[1]) {
                // result["total_current"]+=parseInt(report.data.totals[0].values[0]);
                //Declaration fro compare data range
                result['compare'][index] = [];
                result['compare'][index][0] = {'name': key};
                result['compare'][index][1] = [];
                result['compare'][index][2] = report.data.totals[1].values[0];
                // result["total_compare"]+=parseInt(report.data.totals[1].values[0]);

                report.data.rows.forEach(item => {
                  if (item.dimensions[0].indexOf('Returning Visitor') == -1) {
                    let return_user = report.data.rows.find(function(obj) {
                      return item.dimensions[1] === obj.dimensions[1] && obj.dimensions[0].indexOf('Returning Visitor') > -1;
                    });
                    let obj;
                    if (return_user) {
                      obj = new GetGoalParameter(item.dimensions[1], item.metrics[0].values[0], return_user.metrics[0].values[0]);
                      result['current'][index][1].push(obj);
                    } else {
                      obj = new GetGoalParameter(item.dimensions[1], item.metrics[0].values[0], 0);
                      result['current'][index][1].push(obj);
                    }

                  }
                });
              }
            });
          }
          resolve(result);
        });
      }, 6000);
    });
  }
}


