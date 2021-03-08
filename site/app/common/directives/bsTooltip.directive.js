(function () {

    var app = angular.module('app');

    app.directive('bsTooltip', function () {
        return {
           restrict:'A',
            link: function (scope, element, attrs) {

                $(element).hover(function () {
                    alert();
                    // on mouseenter
                    $(element).tooltip('show');
                }, function () {
                    // on mouseleave
                    $(element).tooltip('hide');
                });
            }
        };
    });


})();



