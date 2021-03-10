(function () {

    var app = angular.module('app');

    app.directive('expandable', function () {
        return {
            link: function (scope, elm, attrs, ctrl) {

                
                var SHOW_ALL = 'הצג הכל';
                var HIDE_ALL = 'הסתר רשומות';
                var CAPTION = SHOW_ALL;
              
                var button = $('<button class="btn btn-link">' + CAPTION + '</button>');
                $(button).click(function () {
                   
                    $(elm).toggleClass('expandable-collapsed');
                    if ($(this).html() == SHOW_ALL) {
                        $(this).html(HIDE_ALL);
                    }
                    else {
                        $(this).html(SHOW_ALL)
                    }
                });
                $(elm).addClass('expandable expandable-collapsed');
                $(elm).after(button);
            }
        };
    });

    app.directive('expandableonlyone', function () {
        return {
            link: function (scope, elm, attrs, ctrl) {


                var SHOW_ALL = 'הצג הכל';
                var HIDE_ALL = 'הסתר רשומות';
                var CAPTION = SHOW_ALL;

                var button = $('<button class="btn btn-link">' + CAPTION + '</button>');
                $(button).click(function () {

                    $(elm).toggleClass('expandable-collapsedone');
                    if ($(this).html() == SHOW_ALL) {
                        $(this).html(HIDE_ALL);
                    }
                    else {
                        $(this).html(SHOW_ALL)
                    }
                });
                $(elm).addClass('expandable expandable-collapsedone');
                $(elm).after(button);
            }
        };
    });
})();