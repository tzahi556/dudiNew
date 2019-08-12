(function () {

    var app = angular.module('app');

    app.component('newstudent', {
        templateUrl: 'app/common/components/newstudent/newstudent.template.html',
        controller: NewstudentController,
        bindings: {
            studentid: '=',
            selectedpayvalue: "=",
            students: '<',
            closeCallback: '<',
            deleteCallback: '<'
        }
    });

    function NewstudentController($scope, usersService, lessonsService, farmsService, sharedValues, $http) {

        var self = this;
        this.scope = $scope;
       // this.user = [];
      //  this.user.Meta = "";
        this.hide = _hide.bind(this);
        this.close = _close.bind(this);
        this.HMOs = sharedValues.HMOs;
       
        this.styles = sharedValues.styles;
        this.onShow = _onShow.bind(this);
       
        this.scope.$on('newstudent.show', this.onShow);

        function _onShow(event, studentTemplateClone) {
           
            this.scope.studentTemplate = angular.copy(studentTemplateClone);
            this.scope.studentTemplate.Meta = "";
            this.scope.studentTemplate.FirstName = "";
            this.scope.studentTemplate.LastName = "";
          
        }

        function _hide() {
           
            this.studentid = null;
        }



        function _close() {


           
            this.scope.studentTemplate.Id = 0;
            this.scope.studentTemplate.Email = this.scope.studentTemplate.Meta.IdNumber;
            this.scope.studentTemplate.Password = this.scope.studentTemplate.Meta.IdNumber;
            this.scope.studentTemplate.Meta.Active = 'active';
            this.scope.studentTemplate.Role = 'student';
            this.scope.studentTemplate.AccountStatus = 0;


         //   this.user.Farm_Id = this.scope.Farm_Id;
         

          //  debugger
          
            usersService.updateUser(this.scope.studentTemplate).then(function (user) {

              

                if (user.FirstName == "Error") {
                    alert('שגיאה בעת הכנסת תלמיד חדש , בדוק אם קיימת תעודת זהות במערכת');


                } else {
                    this.closeCallback(user);
                    alert('נשמר בהצלחה');
                   
                }
                this.studentid = null;
             
               
            }.bind(this));
            //newstudent
          

            //var returnmessages = [];
            //angular.forEach(list, function (value, key) {
            //    if (list[key].selected == list[key].Desc) {

            //        // alert(list[key].selected);
            //        returnmessages.push(list[key].selected);
            //    }
            //});
           
            //this.closeCallback(returnmessages);
         

        }




    }


})();