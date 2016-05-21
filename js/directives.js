'use strict';

angular.module('phonecatDirectives', [])
.directive('calendar', [function () {
        return {
            restrict: 'E',
            template: '<div class="calendar-wrap"><div class="calendar-header"><a class="btn-prev" ng-click="prev()"><i class="fa fa-caret-left"></i></a>{{displayDate}}<a class="btn-next" ng-click="next()"><i class="fa fa-caret-right"></i></a></div><table><thead><tr><th>周日</th><th>周一</th><th>周二</th><th>周三</th><th>周四</th><th>周五</th><th>周六</th></tr></thead><tbody><tr ng-repeat="rows in days"><td class="{{day.status}}" title="{{day.date}}" ng-repeat="day in rows" ng-click="onSelect(day)"><span class="day-cell-wrap">{{day.val}}</span><p ng-if="day.items && day.items.length > 0"><span ng-repeat="item in day.items" class="circle"><svg width="8px" height="8px"><circle  cx="4" cy="4" r="4" fill="{{ itemConfig[item][\'active\'] ? itemConfig[item][\'color\'] : \'#ddd\' }}"></circle></span></tbody></table></div>',
            replace: true,
            scope: {
                date: "=date",
                data: "=data",
                itemConfig: "=",
                onSelect: "="
            },
            controller: ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {


                var dateArr = [],
                    days = [],
                    today = new Date();

                if ($attrs.date) dateArr = $attrs.date.split("-");

                var chunk = function (atrr, n) {
                    for (var i = 0, temp = [], l = ~~atrr.length / n; temp.length < l; temp[i++] = atrr.splice(0, n));
                    return temp;
                };

                $scope.dateObj = {
                    year: dateArr[0] || today.getFullYear(),
                    month: parseInt(dateArr[1], 10) || today.getMonth() + 1,
                    day: dateArr[2] || today.getDate()
                }


                $scope.prev = function () {
                    $scope.dateObj.month--
                    if ($scope.dateObj.month == 0) {
                        $scope.dateObj.month = 12;
                        $scope.dateObj.year--
                    }
                }

                $scope.next = function () {
                    console.log("sss");
                    $scope.dateObj.month++
                    if ($scope.dateObj.month > 12) {
                        $scope.dateObj.month = 1;
                        $scope.dateObj.year++
                    }
                }

                var _lead = function (str) {
                	return (str + '').length == 1 ? '0' + str : str
                }

                var render = function () {

                    var year = $scope.dateObj.year,
                        month = $scope.dateObj.month,
                        day = $scope.dateObj.day,
                        monthStr = ((month + "").length == 1 ? "0" : "" ) + month;

                    $scope.displayDate = [year, "年", monthStr, "月"].join("")

                    //本月第一天是星期几（距星期日离开的天数）
                    var startDay = new Date(year, month - 1, 1).getDay();
                    //本月有多少天(即最后一天的getDate()，“上个月的0来表示本月的最后一天”)
                    var nDays = new Date(year, month, 0).getDate();
                    //上月有多少天
                    var lDays = new Date(year, month - 1, 0).getDate();

                    var lastMonth = month - 1,
                        lastYear = year,
                        nextMonth = month + 1,
                        nextYear = year;

                    lastMonth = lastMonth == 0 ?  12 : _lead(lastMonth);
                    lastYear =  lastMonth == 0 ? lastYear - 1 : lastYear;
                    nextMonth = nextMonth == 13 ?  '01' : nextMonth;
                    nextYear =  nextMonth == 13 ? nextYear + 1 : nextYear;


                    //上月最后几天
                    for (var j = startDay; j > 0; j--) {

                        (function(j){
                            var day = lDays - j + 1,
                                dateStr = [lastYear, lastMonth, day].join("-"),
                                obj = {
                                    'val': day,
                                    'date':dateStr,
                                    'status': 'disabled'
                                };
                            days.push(obj);
                        })(j)

                    };

                    //正常显示的天数
                    for (var j = 1; j <= nDays; j++) {

                        (function(j){
                            var dateStr = [year, monthStr, _lead(j)].join("-"),
                                obj = {
                                        'val': j,
                                        'date': dateStr,
                                        'status': 'enable'
                                };

                            if ($scope.data && $scope.data[dateStr]) {
                                obj.items = $scope.data[dateStr];
                            }

                            days.push(obj);
                        })(j)

                    };

                    //下月开始几天
                    var len = days.length,
                        mod = len % 7;

                    if (mod != 0) {
                        var lst = 7 - mod;
                        for (var j = 1; j <= lst; j++) {

                            (function(j){
                                var dateStr = [nextYear, _lead(nextMonth), _lead(j)].join("-"),
                                    obj = {
                                        'val': j,
                                        'date':dateStr,
                                        'status': 'disabled'
                                    };
                                days.push(obj);
                            })(j)

                        }
                    }

                    $scope.days = chunk(days, 7);
                }

                render();

                $scope.$watch("dateObj", render, true);
            }]
        };
    }])