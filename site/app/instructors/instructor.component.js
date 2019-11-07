(function () {

    var app = angular.module('app');

    app.component('instructor', {
        templateUrl: 'app/instructors/instructor.template.html',
        controller: InstructorController,
        bindings: {
            user: '<',
            farms: '<',
            availablehours:'<'
        }
    });

    function InstructorController(usersService, $scope, $state) {
        this.scope = $scope;
        this.submit = _submit.bind(this);
        this.delete = _delete.bind(this);
        this.availablehours = this.availablehours || [];
        this.eventClick = _eventClick.bind(this);
        this.eventChange = _eventChange.bind(this);
        this.eventCreate = _eventCreate.bind(this);
        this.getLastEventId = _getLastEventId.bind(this);

        this.initInstructor = function () {
           // alert(this.availablehours.length);
            this.resources = [{ id: this.user.Id, title: 'שעות עבודה' }];
            this.selfEdit = angular.fromJson(localStorage.getItem('authorizationData')).userName == this.user.Email;
        }.bind(this);
        this.initInstructor();

        function _submit() {
            if (this.scope.instructorForm.$valid) {
                this.user.Role = this.user.Role || 'instructor';
                this.user.Active = 'active';
                usersService.updateUserMultiTables(this.user, [], [], [], [], [], this.availablehours).then(function (user) {
                    
                    this.user = user;
                    this.initInstructor();
                    alert('נשמר בהצלחה');
                }.bind(this));
            }
        }

        function _delete() {

            if (confirm('האם למחוק את המדריך?')) {
                usersService.deleteUser(this.user.Id).then(function (res) {
                    $state.go('instructors');
                });
            }
        }

        function _eventChange(event) {
         
            for (var i in this.availablehours) {
               
                if (this.availablehours[i].Id == event.Id) {
                    this.availablehours[i].start = event.start.format('HH:mm');
                    this.availablehours[i].end = event.end.format('HH:mm');
                    this.availablehours[i].dow = event.start.format('e');//[event.start.format('e')];
                }
            }
        }

        function _eventClick(event) {

          
            for (var i in this.availablehours) {
                
                if (this.availablehours[i].Id == event.Id) {
                    this.availablehours.splice(i, 1);
                }
            }
        }

        function _eventCreate(start, end, jsEvent, view, resource) {
            var eventId = this.getLastEventId(this.availablehours) + 1;
            var event = {
                Id: 0,
                start: start.format('HH:mm'),
                end: end.format('HH:mm'),
                dow: start.format('e'),
                UserId: this.user.Id,
                resourceId: resource.id
            };
            this.availablehours.push(event);
        }

        function _getLastEventId(events) {
            
            var max = 0;
            for (var i in events) {
                if (events[i].id >= max) {
                    max = events[i].id;
                }
            }
            return max;
        }
    }

})();