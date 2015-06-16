// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var facebookApp = angular.module("starter", ["ionic", "ngStorage", "ngCordova"])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

facebookApp.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller: 'ProfileController'
        })
        .state('friends', {
            url: '/friends',
            templateUrl: 'templates/friends.html',
            controller: 'FriendsController'
        });
    $urlRouterProvider.otherwise('/login');
});

facebookApp.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location) {
 
    $scope.login = function() {
      // if(!$localStorage.hasOwnProperty("accessToken") === true && $localStorage.accessToken==="") {
        $cordovaOauth.facebook("763024983807122", ["email", "read_stream", "user_website", "user_location", "user_relationships", "user_friends"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $location.path("/profile");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
      // }else{
      //   $location.path("/profile");
      // }
    };
 
});

facebookApp.controller("ProfileController", function($scope, $http, $localStorage, $location) {
 
    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true && $localStorage.accessToken!=="") {
            $http.get("https://graph.facebook.com/v2.3/me", { params: { access_token: $localStorage.accessToken, fields: "id,name,gender,location,website,picture,relationship_status,email", format: "json" }}).then(function(result) {
                $scope.profileData = result.data;
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        } else {
            $location.path("/login");
        }
    };
 
});

facebookApp.controller("FriendsController", function($scope, $http, $localStorage, $location) {
 
    $scope.init = function() {
        if($localStorage.hasOwnProperty("accessToken") === true && $localStorage.accessToken!=="") {
            $http.get("https://graph.facebook.com/v2.3/me/taggable_friends?limit=1000", { params: { access_token: $localStorage.accessToken, format: "json" }}).then(function(result) {
                $scope.friendsData = result.data.data;
                // $http.get("https://graph.facebook.com/v2.3/me/taggable_friends?limit=1000", { params: { access_token: $localStorage.accessToken, fields: "picture", format: "json" }}).then(function(result) {
                //     $scope.friendsData.picture = result.data.picture.data.url;
                // });
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
                $scope.friendsData = error;
            });
        } else {
            $location.path("/login");
        }
    };
 
});
