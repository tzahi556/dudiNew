(function () {

    var app = angular.module('app');

    app.service('filesService', FilesService);

    function FilesService($q, $http, sharedValues) {
        this.upload = _upload.bind(this);
        this.delete = _delete.bind(this);

        function _upload(file) {
            var deferred = $q.defer();
            var fd = new FormData();
           
            for (var i = 0; i < file.length; i++) {
                fd.append('file', file[i]);
            }
           
            $http.post(sharedValues.apiUrl + 'files/upload', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(
            function (data) {
                deferred.resolve(data.data);
            },
            function () {
                alert('לא ניתן לעלות תמונה, אין גישה לרשת');
                deferred.reject();
            });
            return deferred.promise;
        }

        function _delete(filename) {
            return $http.get(sharedValues.apiUrl + 'files/delete?filename=' + filename);
        }
    }

    app.directive("filename", ['filesService', function (filesService) {
        return {
            scope: {
                filename: "=",
                filenameCallback: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                  
                    if (changeEvent.target.files.length > 0) {
                        filesService.upload(changeEvent.target.files).then(function (data) {
                            scope.filename = data;
                            if (scope.filenameCallback) {
                                scope.filenameCallback(data);
                            }
                        });
                    }
                });
            },
        }
    }]);

    app.directive("imagepicker", function (sharedValues, filesService) {
        return {
            scope: {
                imageLabel: "@",
                model: "=",
            },
            link: function (scope, element, attributes) {
                scope.delete = _delete;
                function _delete() {
                    filesService.delete(scope.model);
                    scope.model = null;
                }
            },
            template:
                '<div class="image-picker">\
                <label ng-bind="imageLabel"></label>\
                <div class="form-group">\
                <input type="file" class="form-control imgUpload" filename="model" />\
                </div>\
                <img style="width:100%;height:auto;" ng-src="' + sharedValues.apiUrl + 'uploads/{{model}}" ng-if="model" />\
                <div><button ng-click="delete()" type="button" style="width:100%;margin-top:5px;" ng-show="model" class="btn btn-danger">מחיקה</button></div>\
                </div>',

            replace: true,
        }
    });

    app.directive("imagepickerstudent", function (sharedValues, filesService) {
        return {
            scope: {
                imageLabel: "@",
                model: "=",
            },
            link: function (scope, element, attributes) {
                scope.delete = _delete;
                function _delete() {
                    filesService.delete(scope.model);
                    scope.model = null;
                }
            },
            template:
                '<div class="image-picker">\
                <label ng-bind="imageLabel"></label>\
                <div class="form-group">\
                <input type="file" class="" style="width:82px" filename="model" />\
                </div>\
                <img style="width:100%;height:90px;margin-top:2px" ng-src="' + sharedValues.apiUrl + 'uploads/{{model}}" ng-if="model" />\
                <div><button ng-click="delete()" type="button" style="width:100%;margin-top:15px;" ng-show="model" class="btn btn-danger btn-xs">מחיקה</button></div>\
                </div>',

            replace: true,
        }
    });

})();