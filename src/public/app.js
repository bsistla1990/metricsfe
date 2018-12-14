var metrics = angular.module('metrics', ['ngRoute', 'ngStorage'])

metrics.run(function(){
    console.log("App is running")
})

//#################################################### Routes ###########################################################################

metrics.config(['$routeProvider', function($routeProvider){
    $routeProvider
		.when('/prod/create', {
			templateUrl: 'components/productivity/createProductivityView.html',
			controller: 'createProductivityController'
		})
        .when('/prod/search', {
			templateUrl: 'components/productivity/searchProductivityView.html',
			controller: 'searchProductivityController'
		})
        .when('/sprint/create', {
			templateUrl: 'components/sprint/createSprintView.html',
			controller: 'createSprintController'
		})
        .when('/sprint/search', {
			templateUrl: 'components/sprint/searchSprintView.html',
			controller: 'searchSprintController'
		})
        .when('/ud/create', {
			templateUrl: 'components/sprint/createUpsDownsView.html',
			controller: 'createUpsDownsController'
		})
        .when('/ud/search', {
			templateUrl: 'components/sprint/searchUpsDownsView.html',
			controller: 'searchUpsDownsController'
		})
        .when('/', {
            templateUrl: 'components/home/homeView.html',
			controller: 'homeController'
        })
        .when('/login', {
            templateUrl: 'components/auth/authView.html',
			controller: 'authController'
        })
        .otherwise({
			redirectTo: '/'
		});
}])

//#################################################### Services ###########################################################################
metrics.service('productivityService', function($q, $http, $sessionStorage){
    /** Function to add productivity metrics */
    this.addProductivity = function(pm){
        var deferred = $q.defer();
        /*
        {"user": "bhaskar.sistla", "team": "CMS", "track": "PageBuilder", "sprint": "21", 
        "startDate": "1990-07-07", "endDate": "1990-08-08", "devStories": 0, 
        "devPoints": 0, "devCommits": 0, "qaStories": 0, "qaPoints": 0, "qaCommits": 0}
         */
        var jsonbody = {
            user: pm.user,
            team:pm.team,
            track:pm.track,
            sprint:pm.sprintNumber,
            startDate: pm.startDate,
            endDate: pm.endDate,
            devStories: pm.devStories,
            devCommits: pm.devCommits,
            devPoints: pm.devPoints,
            qaStories: pm.qaStories,
            qaCommits: pm.qaCommits,
            qaPoints: pm.qaPoints
        }
        $http({
            method : 'POST',
            url: 'metrics/addProductivity',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:jsonbody
        }).then(function(resp){
            deferred.resolve(resp)
        }, function(err){
            deferred.reject(err)
        })
        return deferred.promise;
    }

    /** Function to get latest 20 entires made by the current user */
    this.getLatest20 = function(){
        var deferred = $q.defer();
        $http({
            method:'GET',
            url: 'metrics/getLatest?userName='+ $sessionStorage.userInfo.userName,
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },

        }).then(function(resp){
            if(resp.data)
                deferred.resolve(resp.data)
            else
                deferred.reject(false)
        }, function(err){
            deferred.reject(false)
        })
        return deferred.promise
    }

    /** Search Function */
    this.search = function(query){
        var deferred = $q.defer();
        $http({
            method:'POST',
            url: 'metrics/search',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:query
        }).then(function(resp){
            if(resp.data)
                deferred.resolve(resp.data)
            else
                deferred.reject(false)
        }, function(err){
            deferred.reject(false)
        })
        return deferred.promise
    }

    /** Function to Delete a record */
    this.delete = function(query){
        var deferred = $q.defer();
        $http({
            method:'POST',
            url: 'metrics/delete',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:{id:query}
        }).then(function(resp){
            if(resp.data)
                deferred.resolve(resp.data)
            else
                deferred.reject(false)
        }, function(err){
            deferred.reject(false)
        })
        return deferred.promise
    }

    /** Function to Update a record */
    this.update = function(query){
        var deferred = $q.defer();
        $http({
            method:'POST',
            url: 'metrics/update',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:query
        }).then(function(resp){
            deferred.resolve(resp.data)
        }, function(error){
            deferred.reject(error)
        })
        return deferred.promise;
    }
})

metrics.service('authService', function($q, $http, $sessionStorage){
    /** Function to Authenticate the user */
    this.login = function(creds){
        var teams = []
        var deferred = $q.defer();
        $http({
            method:'POST',
            url:'/login',
            data:{'username':creds.username, 'password':creds.password}
        }).then(function(resp){
            if(resp.data.token && resp.data.active){
                deferred.resolve(resp.data)
            }
            else{
                deferred.reject(false)
            }
        },
        function(error){
            deferred.reject(error)
        })
        return deferred.promise;
    }
})

metrics.service('genericService', function($q, $http, $sessionStorage){
    /** Function to get list of available teams */
    this.getTeams = function(){
        var teams = []
        var deferred = $q.defer();
        $http({
            method:'GET',
            url: '/teams',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            }
        }).then(function(resp){
            resp.data.forEach(function(team){
                teams.push(team.team)
            })
            $sessionStorage.teams = teams
            deferred.resolve(true)
        },
        function(error){
            deferred.reject(error)
        })
        return deferred.promise;
    }
    /** Function to get list of tracks under a team */
    this.getTracks = function(team){
        var tracks = []
        var deferred = $q.defer();
        $http({
            method:'GET',
            url: '/tracks?team='+ team,
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            }
        }).then(function(resp){
            resp.data.forEach(function(track){
                tracks.push(track.track)
            })
            deferred.resolve(tracks)
        },function(error){
            deferred.reject(error)
        })
        return deferred.promise;
    }
    /** Function to get list of users under a track */
    this.getUsers = function(track){
        var users = []
        var deferred = $q.defer();
        $http({
            method:'GET',
            url: '/users?track='+ track,
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            }
        }).then(function(resp){
                resp.data.forEach(function(user){
                    users.push(user.user)
                })
                deferred.resolve(users)
        }, function(err){
            deferred.reject(err)
        })
        return deferred.promise;
    }
    /** Function to get UserInfo */
    this.getUser = function(userName){
        var user = {}
        var deferred = $q.defer();
        $http({
            method:'GET',
            url:'/users?userName='+userName,
            headers:{
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
        }
        }).then(function(resp){
            deferred.resolve(resp.data)
        }, function(error){
            deferred.reject(error)
        })
        return deferred.promise;
    }

})

metrics.service('sprintService', function($q, $http, $sessionStorage){
    /** Function to add Sprint */
    this.addSprint = function(sm){
        var deferred = $q.defer();
        var jsonbody = {
            user: sm.user,
            team:sm.team,
            track:sm.track,
            sprint:sm.sprintNumber,
            startDate: sm.startDate,
            endDate: sm.endDate,
            stories: sm.stories
        }
        $http({
            method : 'POST',
            url: 'sprint/addSprint',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:jsonbody
        }).then(function(resp){
            deferred.resolve(resp)
        }, function(err){
            deferred.reject(err)
        })
        return deferred.promise;
    }

    /** Function to get latest 20 entires made by the current user */
    this.getLatest20 = function(){
        var deferred = $q.defer();
        $http({
            method:'GET',
            url: 'sprint/getLatest?userName='+ $sessionStorage.userInfo.userName,
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },

        }).then(function(resp){
            if(resp.data)
                deferred.resolve(resp.data)
            else
                deferred.reject(false)
        }, function(err){
            deferred.reject(false)
        })
        return deferred.promise
    }

    /** Search Function */
    this.search = function(query){
        var deferred = $q.defer();
        $http({
            method:'POST',
            url: 'sprint/search',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:query
        }).then(function(resp){
            if(resp.data)
                deferred.resolve(resp.data)
            else
                deferred.reject(false)
        }, function(err){
            deferred.reject(false)
        })
        return deferred.promise
    }

    /** Function to Delete a record */
    this.delete = function(query){
        var deferred = $q.defer();
        $http({
            method:'POST',
            url: 'sprint/delete',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:{id:query}
        }).then(function(resp){
            if(resp.data)
                deferred.resolve(resp.data)
            else
                deferred.reject(false)
        }, function(err){
            deferred.reject(false)
        })
        return deferred.promise
    }
})

metrics.service('udService', function($q, $http, $sessionStorage){
    /** Function to add Sprint */
    this.addUpDown = function(ud){
        var deferred = $q.defer();
        var jsonbody = {
            team:ud.team,
            track:ud.track,
            sprint:ud.sprintNumber,
            startDate: ud.startDate,
            endDate: ud.endDate,
            uds: ud.uds
        }
        $http({
            method : 'POST',
            url: 'sprint/ud/addUpDown',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:jsonbody
        }).then(function(resp){
            deferred.resolve(resp)
        }, function(err){
            deferred.reject(err)
        })
        return deferred.promise;
    }

    /** Function to get latest 20 entires made by the current user */
    this.getLatest20 = function(){
        var deferred = $q.defer();
        $http({
            method:'GET',
            url: 'sprint/ud/getLatest?track='+ $sessionStorage.userInfo.track,
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },

        }).then(function(resp){
            if(resp.data)
                deferred.resolve(resp.data)
            else
                deferred.reject(false)
        }, function(err){
            deferred.reject(false)
        })
        return deferred.promise
    }

    /** Function to Delete a record */
    this.delete = function(query){
        var deferred = $q.defer();
        $http({
            method:'POST',
            url: 'sprint/ud/delete',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:{id:query}
        }).then(function(resp){
            if(resp.data)
                deferred.resolve(resp.data)
            else
                deferred.reject(false)
        }, function(err){
            deferred.reject(false)
        })
        return deferred.promise
    }

    /** Function to Update a record */
    this.update = function(query){
        var deferred = $q.defer();
        $http({
            method:'POST',
            url: 'sprint/ud/update',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:query
        }).then(function(resp){
            deferred.resolve(resp.data)
        }, function(error){
            deferred.reject(error)
        })
        return deferred.promise;
    }

    /** Search Function */
    this.search = function(query){
        var deferred = $q.defer();
        $http({
            method:'POST',
            url: 'sprint/ud/search',
            headers: {
                'Content-Type':'application/json',
                'Authorization': 'Token '+ $sessionStorage.user.token
            },
            data:query
        }).then(function(resp){
            if(resp.data)
                deferred.resolve(resp.data)
            else
                deferred.reject(false)
        }, function(err){
            deferred.reject(false)
        })
        return deferred.promise
    }
})

//#################################################### Controllers ###########################################################################

metrics.controller('topBarController', ['$scope', '$sessionStorage', '$location', 'authService', 'genericService', function($scope, $sessionStorage, $location, authService, genericService){
    $scope.storage = $sessionStorage;

    $scope.logout = function(){
        delete $sessionStorage.user;
        $location.url('/login')
    }
}])

metrics.controller('authController', ['$scope', '$sessionStorage', '$location', 'authService', 'genericService', function($scope, $sessionStorage, $location, authService, genericService){

    $scope.storage = $sessionStorage;

    $scope.creds = {
        username:'',
        password:''
    }
    $scope.error = null
    $scope.login =function(){
        authService.login($scope.creds).then(function(resp){
            if(resp){
                $sessionStorage.user = resp
                genericService.getUser(resp.user_name).then(function(response){
                    $sessionStorage.userInfo = response
                }, function(error){
                    console.log(error)
                })
                $location.url('/home')
            }
            else{
                $scope.error = "Unable to Login. Please check the username and password"
            }
        }, function(error){
            $scope.error = "Unable to Login. Please check the username and password"
        })
    }
}])

metrics.controller('homeController', ['$scope', '$sessionStorage', '$location', 'authService', 'genericService', function($scope, $sessionStorage, $location, authService, genericService){
    $scope.storage = $sessionStorage;
    if(!$sessionStorage.user){
        $location.url('login')
        return
    }
    genericService.getTeams().then(function(resp){
        $scope.teams = resp
    },function(error){
        console.log(error)
    })
}])

metrics.controller('createProductivityController', [ '$scope', '$sessionStorage', '$route', 'productivityService', function($scope, $sessionStorage, $route, productivityService){

    $scope.storage = $sessionStorage;
    
    $scope.latest=[]

    productivityService.getLatest20().then(function(resp){
        $scope.latest = resp
    }, function(err){
        alert("Error getting the latest entries made by this user")
    })


    $scope.entry = {
        user: $scope.storage.userInfo.userName,
        team: $scope.storage.userInfo.team,
        track: $scope.storage.userInfo.track,
        sprintNumber: '',
        startDate: null,
        endDate: null,
        devStories: 0,
        devPoints: 0,
        devCommits: 0,
        qaStories: 0,
        qaPoints: 0,
        qaCommits: 0,
    }

    $scope.validateDate = function(dateString) {
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        if(Number.isNaN(d.getTime())) return false; // Invalid date
        return d.toISOString().slice(0,10) === dateString;
    }

    $scope.submit = function(){
        if($scope.entry.sprintNumber === '' || !$scope.validateDate($scope.entry.startDate) || !$scope.validateDate($scope.entry.endDate) || $scope.entry.devStories === '' ||
            $scope.entry.devCommits === '' || $scope.entry.devPoints === '' || $scope.entry.qaStories === '' ||
            $scope.entry.qaCommits === '' || $scope.entry.qaPoints === ''){
                alert('Please fill all details')
        }
        else{
            productivityService.addProductivity($scope.entry).then(function(resp){
                alert("Productivity Metrics saved successfully")
                $scope.entry = {
                    user: $scope.storage.userInfo.userName,
                    team: $scope.storage.userInfo.team,
                    track: $scope.storage.userInfo.track,
                    sprintNumber: '',
                    startDate: null,
                    endDate: null,
                    devStories: 0,
                    devPoints: 0,
                    devCommits: 0,
                    qaStories: 0,
                    qaPoints: 0,
                    qaCommits: 0,
                }
                $route.reload();
            }, function(error){
                alert("Productivity Metrics not saved successfully")
                
            })
        }
    }
}])

metrics.controller('searchProductivityController', [ '$scope', '$sessionStorage', '$route', 'productivityService', 'genericService', function($scope, $sessionStorage, $route, productivityService, genericService){


    $scope.storage = $sessionStorage;

    $scope.teams= $scope.storage.teams,
    $scope.teams.unshift('--All--')
    $scope.tracks = []
    $scope.users = []   

    $scope.editingRow = {}
    $scope.role = ''

    $scope.exportToExcel = function(){
        alasql('SELECT * INTO XLSX("Productivity_metrics.xlsx",{headers:true}) \
                    FROM ?', [$scope.searchResults]);
    }

    $scope.searchForm = {
        team: $scope.storage.userInfo.team,
        track:$scope.storage.userInfo.track,
        user: $scope.storage.userInfo.userName,
        sprint: '',
        startDate: '',
        endDate:''
    }

    $scope.loadUsers = function(){
        genericService.getUsers($scope.searchForm.track).then(function(resp){$scope.users =resp;}, function(err){})
    }

    $scope.loadTracks = function(){
        genericService.getTracks($scope.searchForm.team).then(function(resp){$scope.tracks = resp; }, function(err){})
        $scope.loadUsers();
    }

    

    if($scope.storage.userInfo.groups.includes('admin')){
        $scope.role = 'admin'
        $scope.loadTracks();
    }
    else if($scope.storage.userInfo.groups.includes('lead')){
        $scope.role = 'lead'
        $scope.loadTracks();
    }
    else{
        $scope.role = 'user'
        $scope.loadTracks();
    }

    $scope.searchResults = [];

    productivityService.getLatest20().then(function(resp){
        $scope.searchResults = resp
    }, function(err){
        alert("Error getting the latest entries made by this user")
    })

    $scope.validateDate = function(dateString) {
        if(!dateString)
            return;
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        if(Number.isNaN(d.getTime())) return false; // Invalid date
        return d.toISOString().slice(0,10) === dateString;
    }

    $scope.deleteRow = function(id){
        productivityService.delete(id).then(function(resp){
            if(resp.status == 'success')
                alert('Record deleted succesfully')
            else
                alert('Record to delete not found')
        }, function(err){
            alert('Error deleting record')
        })
        $route.reload()
    }

    $scope.editRow = function(entry){
        $scope.editingRow = entry
    }

    $scope.checkEditFormValidity = function(){
        return $scope.editingRow.qaPoints === '' || $scope.editingRow.qaStories === '' || $scope.editingRow.qaCommits === '' ||
                $scope.editingRow.devPoints === '' || $scope.editingRow.devStories === '' || $scope.editingRow.devCommits === '' ||
                $scope.editingRow.sprint=== '' || $scope.editingRow.endDate === '' || !$scope.validateDate($scope.editingRow.endDate) ||
                $scope.editingRow.startDate === '' || !$scope.validateDate($scope.editingRow.startDate)
    }

    $scope.submitEditForm = function(){
        productivityService.update($scope.editingRow).then(function(resp){
            alert('Metrics updated successfully')
            $route.reload();
        }, function(err){
            alert('Error modifying the metrics')
        })
    }

    $scope.submit = function(){
        var query = {}

        if($scope.searchForm.sprint === '' && $scope.searchForm.startDate === ''){
            alert('Please enter Sprint or From Date')
            return;
        }

        if($scope.searchForm.sprint !== '')
            query.sprint = $scope.searchForm.sprint
        else{
            if(!$scope.validateDate($scope.searchForm.startDate)){
                alert('Please enter valid From Date')
                return;
            }
            else{
                query.startDate = $scope.searchForm.startDate
                if($scope.searchForm.endDate !== ''){
                    if(!$scope.validateDate($scope.searchForm.endDate)){
                        alert('Please enter valid To Date')
                        return;
                    }
                    query.endDate = $scope.searchForm.endDate;
                }
            }
        }
        if($scope.searchForm.team && $scope.searchForm.team!== '')
            query.team = $scope.searchForm.team
        if($scope.searchForm.track && $scope.searchForm.track!== '')
            query.track = $scope.searchForm.track
        if($scope.searchForm.track && $scope.searchForm.track!== '')
            query.user = $scope.searchForm.user

        productivityService.search(query).then(function(resp){
            $scope.searchResults = resp;
        }, function(err){
            alert('Error getting the search results')
        })
    }
}])

metrics.controller('createSprintController', [ '$scope', '$sessionStorage', '$route', 'sprintService', function($scope, $sessionStorage, $route, sprintService){

    $scope.storage = $sessionStorage;
    $scope.activities = ['Development', 'QA']

    $scope.searchResults=[]
    $scope.newStory = {story:'', activity : '', points: ''}

    $scope.entry = {
        user: $scope.storage.userInfo.userName,
        team: $scope.storage.userInfo.team,
        track: $scope.storage.userInfo.track,
        sprintNumber: '',
        startDate: null,
        endDate: null,
        stories:[]
    }

    sprintService.getLatest20().then(function(resp){
        $scope.searchResults = resp
    }, function(err){
        alert("Error getting the latest entries made by this user")
    })

    $scope.validateDate = function(dateString) {
        if(!dateString || dateString==='')
            return false;
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        if(Number.isNaN(d.getTime())) return false; // Invalid date
        return d.toISOString().slice(0,10) === dateString;
    }

    $scope.checkStoryFormValidity = function(){
        return $scope.newStory.story === '' || $scope.newStory.activity === '' ||$scope.newStory.points === ''
    }

    $scope.addStory = function(){
        var exists = false;
        $scope.entry.stories.forEach(function(story){
            if (story.story.trim() === $scope.newStory.story.trim()){
                alert('Story alredy added')
                exists =true;
                return;
            }
        })
        if(!exists){
            $scope.entry.stories.push($scope.newStory)
            $scope.newStory = {story:'', activity : '', points: ''}
        }
    }

    $scope.deleteStory =function(story){
        $scope.entry.stories.forEach(function(story1){
            if (story['story'].trim() === story1.story.trim()){
                $scope.entry.stories.splice($scope.entry.stories.indexOf(story), 1)
                return;
            }
        })
    }

    $scope.submit = function(){

        if($scope.entry.stories.length <=0 ){
            alert('Please add atleast one story')
            return;
        }
        if(!$scope.validateDate($scope.entry.startDate)){
            alert('Please Enter valid StartDate')
            return;
        }

        if(!$scope.validateDate($scope.entry.endDate)){
            alert('Please Enter valid End Date')
            return;
        }

        if($scope.entry.sprintNumber === '' ){
            alert('Please enter sprint')
            return;
        }
        else{
            sprintService.addSprint($scope.entry).then(function(resp){
                alert("Sprint Metrics saved successfully")
                $scope.entry = {
                    user: $scope.storage.userInfo.userName,
                    team: $scope.storage.userInfo.team,
                    track: $scope.storage.userInfo.track,
                    sprintNumber: '',
                    startDate: null,
                    endDate: null,
                    stories: []
                }
                $route.reload();
            }, function(error){
                alert("Error saving sprint metrics")
            })
        }
    }
}])

metrics.controller('searchSprintController', [ '$scope', '$sessionStorage', '$route', 'sprintService', 'genericService', function($scope, $sessionStorage, $route, sprintService, genericService){


    $scope.storage = $sessionStorage;

    $scope.teams= $scope.storage.teams,
    $scope.teams.unshift('--All--')
    $scope.tracks = []
    $scope.users = []   

    $scope.editingRow = {}
    $scope.role = ''

    $scope.exportToExcel = function(){
        alasql('SELECT * INTO XLSX("Sprint_metrics.xlsx",{headers:true}) \
                    FROM ?', [$scope.searchResults]);
    }

    $scope.searchForm = {
        team: $scope.storage.userInfo.team,
        track:$scope.storage.userInfo.track,
        user: $scope.storage.userInfo.userName,
        sprint: '',
        startDate: '',
        endDate:''
    }

    $scope.loadUsers = function(){
        genericService.getUsers($scope.searchForm.track).then(function(resp){$scope.users =resp;}, function(err){})
    }

    $scope.loadTracks = function(){
        genericService.getTracks($scope.searchForm.team).then(function(resp){$scope.tracks = resp; }, function(err){})
        $scope.loadUsers();
    }

    

    if($scope.storage.userInfo.groups.includes('admin')){
        $scope.role = 'admin'
        $scope.loadTracks();
    }
    else if($scope.storage.userInfo.groups.includes('lead')){
        $scope.role = 'lead'
        $scope.loadTracks();
    }
    else{
        $scope.role = 'user'
        $scope.loadTracks();
    }

    $scope.searchResults = [];

    sprintService.getLatest20().then(function(resp){
        $scope.searchResults = resp
    }, function(err){
        alert("Error getting the latest entries made by this user")
    })

    $scope.validateDate = function(dateString) {
        if(!dateString)
            return;
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        if(Number.isNaN(d.getTime())) return false; // Invalid date
        return d.toISOString().slice(0,10) === dateString;
    }

    $scope.deleteRow = function(id){
        sprintService.delete(id).then(function(resp){
            if(resp.status == 'success')
                alert('Record deleted succesfully')
            else
                alert('Record to delete not found')
        }, function(err){
            alert('Error deleting record')
        })
        $route.reload()
    }

    $scope.editRow = function(entry){
        $scope.editingRow = entry
    }

    $scope.checkEditFormValidity = function(){
        return $scope.editingRow.qaPoints === '' || $scope.editingRow.qaStories === '' || $scope.editingRow.qaCommits === '' ||
                $scope.editingRow.devPoints === '' || $scope.editingRow.devStories === '' || $scope.editingRow.devCommits === '' ||
                $scope.editingRow.sprint=== '' || $scope.editingRow.endDate === '' || !$scope.validateDate($scope.editingRow.endDate) ||
                $scope.editingRow.startDate === '' || !$scope.validateDate($scope.editingRow.startDate)
    }

    $scope.submitEditForm = function(){
        sprintService.update($scope.editingRow).then(function(resp){
            alert('Metrics updated successfully')
            $route.reload();
        }, function(err){
            alert('Error modifying the metrics')
        })
    }

    $scope.submit = function(){
        var query = {}

        if($scope.searchForm.sprint === '' && $scope.searchForm.startDate === ''){
            alert('Please enter Sprint or From Date')
            return;
        }

        if($scope.searchForm.sprint !== '')
            query.sprint = $scope.searchForm.sprint
        else{
            if(!$scope.validateDate($scope.searchForm.startDate)){
                alert('Please enter valid From Date')
                return;
            }
            else{
                query.startDate = $scope.searchForm.startDate
                if($scope.searchForm.endDate !== ''){
                    if(!$scope.validateDate($scope.searchForm.endDate)){
                        alert('Please enter valid To Date')
                        return;
                    }
                    query.endDate = $scope.searchForm.endDate;
                }
            }
        }
        if($scope.searchForm.team && $scope.searchForm.team!== '')
            query.team = $scope.searchForm.team
        if($scope.searchForm.track && $scope.searchForm.track!== '')
            query.track = $scope.searchForm.track
        if($scope.searchForm.track && $scope.searchForm.track!== '')
            query.user = $scope.searchForm.user

        sprintService.search(query).then(function(resp){
            $scope.searchResults = resp;
        }, function(err){
            alert('Error getting the search results')
        })
    }
}])

metrics.controller('createUpsDownsController', [ '$scope', '$sessionStorage', '$route', 'udService', function($scope, $sessionStorage, $route, udService){

    $scope.storage = $sessionStorage;

    $scope.searchResults=[]
    $scope.newUp =  ''
    $scope.newDown = ''

    $scope.entry = {
        team: $scope.storage.userInfo.team,
        track: $scope.storage.userInfo.track,
        sprintNumber: '',
        startDate: null,
        endDate: null,
        uds:[]
    }

    /*
    sprintService.getLatest20().then(function(resp){
        $scope.searchResults = resp
    }, function(err){
        alert("Error getting the latest entries made by this user")
    })
    */

    $scope.validateDate = function(dateString) {
        if(!dateString || dateString==='')
            return false;
        var regEx = /^\d{4}-\d{2}-\d{2}$/;
        if(!dateString.match(regEx)) return false;  // Invalid format
        var d = new Date(dateString);
        if(Number.isNaN(d.getTime())) return false; // Invalid date
        return d.toISOString().slice(0,10) === dateString;
    }

    $scope.tempid=0;
    $scope.types = ['up', 'down']
    $scope.editUd = {type:'',val:'', id:''}

    $scope.addUd = function(type,val){
        $scope.entry.uds.push({'id':$scope.tempid,'type': type, 'val':val })
        $scope.tempid = $scope.tempid +1
        if(type == 'up')
            $scope.newUp = '';
        else
            $scope.newDown = ''
    }
    
    $scope.edit =function(ud){
        $scope.editUd =angular.copy(ud)
    }

    $scope.updateUd = function(){
        var index =0;
        $scope.entry.uds.forEach(function(ud){
            if ($scope.editUd.id === ud.id){
                $scope.entry.uds[index] = $scope.editUd
            }
            index = index+1
        })
    }

    $scope.deleteUd =function(ud){
        var index = 0;
        $scope.entry.uds.forEach(function(ud1){
            if (ud['id'] === ud1.id){
                $scope.entry.uds.splice(index, 1)
                return;
            }
            index = index+1;
        })
    }

    $scope.submit = function(){

        if($scope.entry.sprintNumber === '' ){
            alert('Please enter sprint')
            return;
        }

        if(!$scope.validateDate($scope.entry.startDate)){
            alert('Please Enter valid StartDate')
            return;
        }

        if(!$scope.validateDate($scope.entry.endDate)){
            alert('Please Enter valid End Date')
            return;
        }

        if($scope.entry.uds.length <=0 ){
            alert('Please enter atleast one up or down')
            return;
        }
        else{
            udService.addUpDown($scope.entry).then(function(resp){
                alert("Ups and Downs saved successfully")
                $scope.entry = {
                    team: $scope.storage.userInfo.team,
                    track: $scope.storage.userInfo.track,
                    sprintNumber: '',
                    startDate: null,
                    endDate: null,
                    uds:[]
                }
                $route.reload();
            }, function(error){
                alert("Error saving Ups and Downs")
            })
        }
    }
}])

metrics.controller('searchUpsDownsController', [ '$scope', '$sessionStorage', '$route', 'udService', 'genericService', function($scope, $sessionStorage, $route, udService, genericService){


    $scope.storage = $sessionStorage;

    $scope.teams= $scope.storage.teams,
    $scope.teams.unshift('--All--')
    $scope.tracks = []
    $scope.users = []   

    $scope.editingRow = {}
    $scope.role = ''

    $scope.exportToExcel = function(){
        alasql('SELECT * INTO XLSX("Ups_Downs_metrics.xlsx",{headers:true}) \
                    FROM ?', [$scope.searchResults]);
    }

    $scope.types = ['up', 'down']

    $scope.searchForm = {
        team: $scope.storage.userInfo.team,
        track:$scope.storage.userInfo.track,
        user: $scope.storage.userInfo.userName,
        sprint: '',
        type:''
    }

    $scope.loadUsers = function(){
        genericService.getUsers($scope.searchForm.track).then(function(resp){$scope.users =resp;}, function(err){})
    }

    $scope.loadTracks = function(){
        genericService.getTracks($scope.searchForm.team).then(function(resp){$scope.tracks = resp; }, function(err){})
        $scope.loadUsers();
    }

    if($scope.storage.userInfo.groups.includes('admin')){
        $scope.role = 'admin'
        $scope.loadTracks();
    }
    else if($scope.storage.userInfo.groups.includes('lead')){
        $scope.role = 'lead'
        $scope.loadTracks();
    }
    else{
        $scope.role = 'user'
        $scope.loadTracks();
    }

    $scope.searchResults = [];

    udService.getLatest20().then(function(resp){
        $scope.searchResults = resp
    }, function(err){
        alert("Error getting the latest Ups/Downs")
    })

    $scope.deleteRow = function(id){
        udService.delete(id).then(function(resp){
            if(resp.status == 'success')
                alert('Record deleted succesfully')
            else
                alert('Record to delete not found')
        }, function(err){
            alert('Error deleting record')
        })
        $route.reload()
    }

    $scope.editRow = function(entry){
        $scope.editingRow = angular.copy(entry)
    }

    $scope.submitEditForm = function(){
        udService.update($scope.editingRow).then(function(resp){
            alert('Ups and Downs updated successfully')
            $route.reload();
        }, function(err){
            alert('Error modifying the metrics')
        })
    }

    $scope.submit = function(){
        var query = {}

        if($scope.searchForm.team && $scope.searchForm.team!== '')
            query.team = $scope.searchForm.team
        if($scope.searchForm.track && $scope.searchForm.track!== '')
            query.track = $scope.searchForm.track
        if($scope.searchForm.sprint && $scope.searchForm.sprint!== '')
            query.sprint = $scope.searchForm.sprint
        if($scope.searchForm.type && $scope.searchForm.type!== '')
            query.type = $scope.searchForm.type

        udService.search(query).then(function(resp){
            $scope.searchResults = resp;
        }, function(err){
            alert('Error getting the search results')
        })
    }
}])


