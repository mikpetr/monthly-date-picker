angular.module('monthlyDatePicker', ['templates']).directive('monthlyDatePicker', ['$document', function ($document) {
    
    var format = 'MM-DD-YYYY';

    function now () {
        return moment().format(format);
    }

    function stringToDateObject (str) {
        return moment(str, format).toDate();
    }

    return {
        restrict: 'E',
        templateUrl: 'date-picker.html',
        scope: {
            ngModel: '='
        },
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            
            var _cover = elm[0].getElementsByClassName('inputs-cover');

            angular.element(_cover).on('click', function () {
                // disable default calendar
                scope.calendar.isPicking = 'start';
                
                // e.target.dataset.target
                var date = scope.range[scope.calendar.isPicking];
                scope.calendar.year = moment(date).format('YYYY');
                scope.calendar.month = moment(date).format('MM');

                if (!scope.$$phase)
                    scope.$apply();
            });

            $document.on('click', function () {
                scope.calendar.isPicking = false;
                if (!scope.$$phase)
                    scope.$apply();
            });

            elm.find('*').on('click', function (e) {
                e.stopPropagation();
            });

            scope.getStart = function () {
                return moment(scope.range.start).format('MMM YYYY');
            };

            scope.getEnd = function () {
                return moment(scope.range.end).format('MMM YYYY');
            };

            var separator = ' : ';

            // date picker's ng-model
            scope.range = {
                start: stringToDateObject(now()),
                end: stringToDateObject(now())
            };

            function parseRangeString (value) {
                // read value and parse to model

                var temp = value ? value.split(separator) : [now(), now()];

                scope.range.start = stringToDateObject(temp[0]);
                scope.range.end = stringToDateObject(temp[1]);
                
                return value;
            }

            // read from model, format and send to view
            ctrl.$formatters.push(parseRangeString);

            // reading from view and parse to model
            ctrl.$parsers.push(parseRangeString);

            // calendar part
            scope.calendar = {
                isPicking: false,
                year: moment().format('YYYY'),
                month: moment().format('MM'),
                months: [],
                nextYear: function () {
                    scope.calendar.year = moment(scope.calendar.year, 'YYYY').add(1, 'year').format('YYYY');
                },
                prevYear: function () {
                    scope.calendar.year = moment(scope.calendar.year, 'YYYY').subtract(1, 'year').format('YYYY');
                },
                isCurrentMonth: function (month) {
                    return moment().format('YYYY') === scope.calendar.year && moment().format('MM') === month;
                },
                isSelectedMonth: function (month) {
                    return scope.calendar.month === month;
                },
                monthIsDisabled: function (month) {
                    if (scope.calendar.isPicking === 'start')
                        return false;
                    
                    var end = moment().set('year', scope.calendar.year).set('month', parseInt(month) - 1).set('date', 1).toDate();

                    if (scope.range.start.getFullYear() === end.getFullYear() && scope.range.start.getMonth() === end.getMonth())
                        return true;

                    return scope.range.start >= end;
                },
                selectDate: function (month) {
                    if (scope.calendar.monthIsDisabled(month))
                        return;

                    var date = moment().set('year', scope.calendar.year).set('month', parseInt(month) - 1).set('date', 1);
                    
                    scope.range[scope.calendar.isPicking] = date.toDate();

                    if (scope.calendar.isPicking === 'start') {
                        scope.calendar.isPicking = 'end';
                        scope.calendar.month = moment(scope.range.end).format('MM');
                    } else {
                        scope.calendar.isPicking = false;
                        scope.calendar.setDate();
                    }
                },
                isNotValidRange: function () {
                    return scope.range.end < scope.range.start;
                },
                setDate: function () {
                    if (scope.calendar.isNotValidRange())
                        return;

                    scope.calendar.isPicking = false;
                    var newDate = moment(scope.range.start).format(format) + separator + moment(scope.range.end).format(format);
                    ctrl.$setViewValue(newDate);
                }
            };

            moment.monthsShort().forEach(function (month) {
                scope.calendar.months.push({
                    month: moment().month(month).format('MM'),
                    name: month
                });
            });
        }
    };
}]);