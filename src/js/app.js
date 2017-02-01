angular
    .module('datePickerApp', ['monthlyDatePicker'])
    .controller('pickerCtrl', ['$scope', function ($scope) {
        $scope.dateRange = null;

        $scope.$watch('dateRange', function (newDateRange) {
            $scope.dateRange = newDateRange;
        });
    }]);