﻿(function () {

    var app = angular.module('app', ['ui.router', 'angular-loading-bar', 'ui.bootstrap']);

    app.config(function ($urlRouterProvider, $stateProvider) {
       
        $urlRouterProvider.otherwise(function ($inject) {
            $state = $inject.get('$state');
            usersService = $inject.get('usersService');
            var roles = usersService.roles;
            var role = localStorage.getItem('currentRole');
            if (role == null) {
                $state.go('login');
            }
            for (var i in roles) {
                if (roles[i].id == role) {
                   
                    $state.go(roles[i].homePage);
                }
            }
        });

        $stateProvider.state('login', {
            url: '/login/{returnUrl}',
            views: {
                'main': {
                    template: '<login return-url="$ctrl.returnUrl"></login>'
                },
                controller: function ($stateParams) {

                    this.returnUrl = $stateParams.returnUrl;
                   
                }
            }
        });

        $stateProvider.state('contact', {
            url: '/contact/',
            views: {
                'main': {
                    template: '<contact></contact>'
                }
            }
        });

        $stateProvider.state('logout', {
            url: '/logout/',
            views: {
                'main': {
                    template: '',
                    controller: function (authenticationService, $state) {
                        authenticationService.logOut();
                    },
                    resolve: {
                        unregister: function ($http, sharedValues) {
                            var deviceToken = localStorage.getItem('deviceToken');
                            return $http.post(sharedValues.apiUrl + 'notifications/unregister/', '"' + deviceToken + '"');
                        }
                    }
                }
            }
        });

       
        $stateProvider.state('notifications', {
            url: '/notifications/',
            views: {
                'main': {
                    template: '<notifications notifications="$ctrl.notifications"></notifications>',
                    controller: function (notifications) {
                        this.notifications = notifications;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        notifications: function (notificationsService) {
                            return notificationsService.getNotifications();
                        }
                    }
                }
            }
        });

        $stateProvider.state('reports', {
            url: '/reports/',
            views: {
                'main': {
                    template: '<reports></reports>',
                }
            }
        });

        $stateProvider.state('closetoken', {
            url: '/closetoken',
            views: {
                'main': {
                    template: '<closetoken></closetoken>',
                }
            }
        });

        $stateProvider.state('farms', {
            url: '/farms/',
            views: {
                'main': {
                    template: '<farms farms="$ctrl.farms"></farms>',
                    controller: function (farms) {
                        this.farms = farms;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        farms: function (farmsService) {
                            return farmsService.getFarms();
                        }
                    }
                }
            }
        });

        $stateProvider.state('farm', {
            url: '/farm/{id}',
            views: {
                'main': {
                    template: '<farm farm="$ctrl.farm"></farm>',
                    controller: function (farm) {
                        this.farm = farm;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        farm: function (farmsService, $stateParams) {
                            return farmsService.getFarm($stateParams.id);
                        }
                    }
                }
            }
        });


        $stateProvider.state('farmmanager', {
            url: '/farmmanager/',
            views: {
                'main': {
                    template: '<farmmanager farmmanager="$ctrl.farmmanager" farminstructors="$ctrl.farminstructors"></farmmanager>',
                    controller: function (farmmanager, farminstructors) {
                       
                        this.farmmanager = farmmanager;
                        this.farminstructors = farminstructors;


                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        farmmanager: function (farmsService, $stateParams) {
                            
                            return farmsService.getMangerFarm();
                        },
                        farminstructors: function (farmsService, $stateParams) {

                            return farmsService.getMangerInstructorFarm();
                        }


                        
                    }
                }
            }
        });

        $stateProvider.state('horses', {
            url: '/horses/',
            views: {
                'main': {
                    template: '<horses horses="$ctrl.horses"></horses>',
                    controller: function (horses) {
                        this.horses = horses;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        horses: function (horsesService) {
                            return horsesService.getHorses();
                        }
                    }
                }
            }
        });

        $stateProvider.state('horse', {
            url: '/horse/{id}',
            views: {
                'main': {
                    template: '<horse horse="$ctrl.horse" farms="$ctrl.farms" horses="$ctrl.horses" files="$ctrl.files"  hozefiles="$ctrl.hozefiles" pundekautfiles="$ctrl.pundekautfiles" treatments="$ctrl.treatments"  vaccinations="$ctrl.vaccinations" shoeings="$ctrl.shoeings" tilufings="$ctrl.tilufings" pregnancies="$ctrl.pregnancies"  pregnanciesstates="$ctrl.pregnanciesstates"  inseminations="$ctrl.inseminations" susut="$ctrl.susut" hozims="$ctrl.hozims" instructors="$ctrl.instructors"></horse>',
                    controller: function (horse, farms, horses, files, hozefiles, pundekautfiles, treatments, vaccinations, shoeings, tilufings, pregnancies, pregnanciesstates, inseminations, susut, hozims, instructors) {
                        this.horse = horse;
                        this.farms = farms;
                        this.horses = horses;

                        this.files = files;
                        this.hozefiles = hozefiles;
                        this.pundekautfiles = pundekautfiles;
                        this.treatments = treatments;

                        this.vaccinations = vaccinations;
                        this.shoeings = shoeings;
                        this.tilufings = tilufings;
                        this.pregnancies = pregnancies;
                        this.pregnanciesstates = pregnanciesstates;

                        this.inseminations = inseminations;

                        this.susut = susut;

                        this.hozims = hozims;
                        this.instructors = instructors;
                        
                        
                        

                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        horse: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 1);
                        },
                        files: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 2);
                        },

                        hozefiles: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 3);
                        },

                        pundekautfiles: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 4);
                        },


                        treatments: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 5);
                        },

                        vaccinations: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 6);
                        },
                        shoeings: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 7);
                        },

                        tilufings: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 8);
                        },

                        pregnancies: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 9);
                        },
                        pregnanciesstates: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 10);
                        },

                        inseminations: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 11);
                        },

                        hozims: function (horsesService, $stateParams) {
                            return horsesService.getHorse($stateParams.id, 12);
                        },
                        instructors: function (usersService) {
                            return usersService.getUsers(['instructor', 'profAdmin'], true);
                        },
                        susut: function (horsesService) {
                            return horsesService.getSusut();
                        },
                        horses: function (horsesService) {
                            return horsesService.getHorses();
                        },
                        farms: function (farmsService) {
                            return farmsService.getFarms();
                        },
                    }
                }
            }
        });

        $stateProvider.state('users', {
            url: '/users/',
            views: {
                'main': {
                    template: '<users users="$ctrl.users" farms="$ctrl.farms"></users>',
                    controller: function (users, farms) {
                        this.users = users;
                        this.farms = farms;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        users: function (usersService) {
                            return usersService.getUsers();
                        },
                        farms: function (farmsService) {
                            return farmsService.getFarms();
                        }
                    }
                }
            }
        });

        $stateProvider.state('user', {
            url: '/user/{id}/',
            views: {
                'main': {
                    template: '<user user="$ctrl.user" farms="$ctrl.farms"></user>',
                    controller: function (user, farms) {
                        this.user = user;
                        this.farms = farms;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        user: function (usersService, $stateParams) {
                            return usersService.getUser($stateParams.id);
                        },
                        farms: function (farmsService) {
                            return farmsService.getFarms();
                        }
                    }
                }
            }
        });

        $stateProvider.state('instructors', {
            url: '/instructors/',
            views: {
                'main': {
                    template: '<instructors users="$ctrl.users"></instructors>',
                    controller: function (users) {
                        this.users = users;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        users: function (usersService) {
                            return usersService.getUsers(['instructor', 'profAdmin']);
                        }
                    }
                }
            }
        });
        $stateProvider.state('lessons', {
            url: '/lessons/',
            views: {
                'main': {
                    template: '<lessons instructors="$ctrl.instructors" students="$ctrl.students" availablehours="$ctrl.availablehours" horses="$ctrl.horses"></lessons>',
                    controller: function (instructors, students, availablehours, horses) {
                        this.instructors = instructors;
                        this.students = students;
                        this.availablehours = availablehours;
                        this.horses = horses;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        instructors: function (usersService) {
                            return usersService.getUsers(['instructor', 'profAdmin']);
                        },
                        availablehours: function (usersService, $stateParams) {
                            return usersService.getAvailablehours();
                        },
                        students: function (usersService) {
                            return usersService.getUsers('student', true);
                        },
                        horses: function (horsesService) {
                            return horsesService.getHorsesForLessons();
                        }
                    }
                }
            }
        });

        $stateProvider.state('instructor', {
            url: '/instructor/{id}/',
            views: {
                'main': {
                    template: '<instructor user="$ctrl.user" farms="$ctrl.farms" availablehours="$ctrl.availablehours"></instructor>',
                    controller: function (user, farms, availablehours) {
                        this.user = user;
                        this.farms = farms;
                        this.availablehours = availablehours;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        user: function (usersService, $stateParams) {
                            return usersService.getUser($stateParams.id);
                        },
                        availablehours: function (usersService, $stateParams) {
                            return usersService.getAvailablehours($stateParams.id);
                        },

                        farms: function (farmsService) {
                            return farmsService.getFarms();
                        }
                    }
                }
            }
        });

        $stateProvider.state('students', {
            url: '/students/',
            views: {
                'main': {
                    template: '<students users="$ctrl.users"></students>',
                    controller: function (users) {
                        this.users = users;
                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        users: function (usersService) {
                            return usersService.getUsers('student');
                        }
                    }
                }
            }
        });

        $stateProvider.state('student', {
            url: '/student/{id}/',
            views: {
                'main': {
                    template: '<student user="$ctrl.user" lessons="$ctrl.lessons" instructors="$ctrl.instructors" farms="$ctrl.farms" horses="$ctrl.horses"' 
                        + 'horses="$ctrl.horses" payments="$ctrl.payments" files="$ctrl.files" commitments="$ctrl.commitments" expenses="$ctrl.expenses" userhorses="$ctrl.userhorses" students="$ctrl.students" makav="$ctrl.makav" ></student>',
                    controller: function (user, lessons, instructors, farms, horses, payments, files, commitments, expenses, userhorses, students, makav) {
                        this.user = user;
                        this.lessons = lessons;
                        this.instructors = instructors;
                        this.farms = farms;
                        this.horses = horses;
                        this.payments = payments;
                        this.files = files;
                        this.commitments = commitments;
                        this.expenses = expenses;
                        this.userhorses = userhorses;
                        this.students = students;

                        this.makav = makav;

                    },
                    controllerAs: '$ctrl',
                    resolve: {
                        user: function (usersService, $stateParams) {
                            
                           return usersService.getUser($stateParams.id,true);
                        },
                        lessons: function (lessonsService, $stateParams) {
                            return lessonsService.getLessons($stateParams.id);
                        },
                        instructors: function (usersService) {
                            return usersService.getUsers(['instructor', 'profAdmin'], true);
                        },
                        farms: function (farmsService) {
                            return farmsService.getFarms();
                        },
                        horses: function (horsesService) {
                            return horsesService.getHorses();
                        },
                        //*********************
                        payments: function (usersService, $stateParams) {
                          
                            return usersService.getPaymentsByUserId($stateParams.id);
                        },
                        files: function (usersService, $stateParams) {
                            return usersService.getUserFilesByUserId($stateParams.id);
                        },
                        commitments: function (usersService, $stateParams) {
                            return usersService.getUserCommitmentsByUserId($stateParams.id);
                        },
                        expenses: function (usersService, $stateParams) {
                            return usersService.getUserExpensesByUserId($stateParams.id);
                        },
                        userhorses: function (usersService, $stateParams) {
                            return usersService.getUserUserhorsesByUserId($stateParams.id);
                        },
                      
                        students: function (usersService) {
                             return usersService.getUsers('student');
                        },

                        makav: function (usersService, $stateParams) {
                           
                            return usersService.getUserUserMakavByUserId($stateParams.id);
                        },
                       


                    }
                }
            }
        });

    });

    
    app.filter('orderByDateDesc', function () {
      
        return function (items) {
            if (items) {
             
                items.sort(function (a, b) {
                   
                    if (new Date(a.Date) > new Date(b.Date)) {
                        return -1;
                    }
                    else if (new Date(a.Date) < new Date(b.Date)) {
                        return 1;
                    }
                   
                    else {
                        
                        return 0;
                    }
                });

               
                return items;
            }
        }
    });

   

    app.config(function ($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');
    });

    app.run(function ($rootScope, notificationsService, $http, sharedValues) {

     
      
        //document.addEventListener("dragstart", onOnline, false);
        //document.addEventListener("drop", onOffline, false);

        //function onOnline(event) {
         
        //    $rootScope.$apply(function () {
        //        $rootScope.noNetwork = event;
        //        $rootScope.studentIdDrag = event.target.id;
        //    });
        //}


        //function onOffline(event) {
           
        //    $rootScope.$apply(function () {
        //        $rootScope.noNetwork = event;
        //    });
        //}

        $rootScope.role = localStorage.getItem('currentRole');
        $rootScope.FarmInstractorPolicy = localStorage.getItem('FarmInstractorPolicy');

        

        $rootScope.IsInstructorBlock = ($rootScope.role == "instructor" && $rootScope.FarmInstractorPolicy=="true")?true:false;

        $rootScope.isPhone = false;

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            $rootScope.isPhone = true;
        }

        delete $http.defaults.headers.common['X-Requested-With'];

        $http.defaults.headers.common['Access-Control-Allow-Headers'] = 'origin, content-type, accept';
        $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
        $http.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,POST,PUT,HEAD,DELETE,OPTIONS';

        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

        // צחי שינה כדי שיעבוד ללא הפיירבס 
      if (!iOS) {
     //  if (iOS) {
            // Initialize Firebase
            var config = {
                apiKey: "AIzaSyAGKOIfx7E5O_9JqUju_-AmjEM-4w20hw0",
                authDomain: "test-ba446.firebaseapp.com",
                databaseURL: "https://test-ba446.firebaseio.com",
                storageBucket: "test-ba446.appspot.com",
                messagingSenderId: "386031058381"
            };
            firebase.initializeApp(config);

            const messaging = firebase.messaging();
            messaging.requestPermission()
                .then(function () {
                    console.log('Notification permission granted.');
                    return messaging.getToken();
                })
                .then(function (token) {
                    $rootScope.$broadcast('fcmToken', token);
                })
                .catch(function (err) {
                    
                    console.log('Unable to get permission to notify.', err);
                });

            messaging.onMessage(function (payload) {
                $rootScope.$broadcast('fcmMessage', payload);
            });

            messaging.onTokenRefresh(function () {
                messaging.getToken()
                    .then(function (refreshedToken) {
                        $rootScope.$broadcast('fcmToken', refreshedToken);
                    })
                    .catch(function (err) {
                        console.log('Unable to retrieve refreshed token ', err);
                    });
            });

            $rootScope.$on('fcmToken', function (event, token) {
                $http.post(sharedValues.apiUrl + 'notifications/register/', '"' + token + '"').then(function () {
                    localStorage.setItem('deviceToken', token);
                });
            });

            $rootScope.$on('fcmMessage', function (event, payload) {
                alert(payload.notification.body);
            });
        }

        $rootScope.$on("$stateChangeError", console.log.bind(console));
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

            if (fromState.name == 'horse' || fromState.name == 'student') {
                $rootScope.$broadcast('submit');
            }

            console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n', toState, toParams);
            $rootScope.$broadcast('commonOperations');
        });
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            console.log('$stateChangeError - fired when an error occurs during transition.');
            console.log(arguments);
        });
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
        });
        $rootScope.$on('$viewContentLoaded', function (event) {
            console.log('$viewContentLoaded - fired after dom rendered', event);
            notificationsService.getNotifications().then(function (data) {
              
                $rootScope.$broadcast('notificationsNav.refresh', data.length)
            });
        });
        $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
            console.log(unfoundState, fromState, fromParams);
        });


    });

    if (window.location.hostname.indexOf('giddyup') != -1 && window.location.protocol != 'https:') {
        window.location.href = 'https://www.giddyup.co.il';
    }

})();