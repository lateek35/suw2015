angular.module('starter.controllers', ["ionic", "ngStorage", "ngCordova"])

.controller("LoginController", function($rootScope, $scope, $cordovaOauth, $localStorage, $location, $http, $ionicSideMenuDelegate, $state) {
    $ionicSideMenuDelegate.canDragContent(false);
    $rootScope.logged = false;
    $scope.login = function() {
      if(!$localStorage.hasOwnProperty("accessToken")) {
        $cordovaOauth.facebook("763024983807122", ["email", "read_stream", "user_website", "user_location", "user_relationships", "user_friends"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $http.get("https://graph.facebook.com/v2.3/me", { params: { access_token: $localStorage.accessToken, fields: "id,first_name,gender,picture,birthday", format: "json" }}).then(function(result) {
                $localStorage.profileDatas = result.data;
                $http.get("https://graph.facebook.com/v2.3/me/", { params: { access_token: $localStorage.accessToken, fields: "picture", format: "json" }}).then(function(result) {
                    $localStorage.picture = result.data.picture.data.url;
                    $ionicSideMenuDelegate.canDragContent(true);
                    $rootScope.logged = true;
                    $scope.changeState();
                });
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        }, function(error) {
            alert("There was a problem getting your profile.  Check the logs for details.");
            console.log(error);
        });
      }else{
        $ionicSideMenuDelegate.canDragContent(true);
        $rootScope.logged = true;
        $scope.changeState();
      }
    };
    $scope.changeState = function () {
        $location.path('/tab/soiree');
        $rootScope.init();
    };
})

.controller('SoireeCtrl', function($rootScope, $scope, $localStorage, $location, $http, $ionicSideMenuDelegate) {
    $rootScope.init = function(){
      if($localStorage.hasOwnProperty("accessToken")) {
        $rootScope.logged = true;
        $.post('http://8affc41bd7.url-de-test.ws/soirees',
        {
          id_fb: $localStorage.profileDatas.id
        },
        function(data,status){
          $scope.soirees = data;
          $scope.$apply();
        });

      }else{
        $ionicSideMenuDelegate.canDragContent(false);
        $rootScope.logged = false;
        $location.path("/login");
      }
    }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $localStorage, $http, $location, chatMessages, $ionicScrollDelegate ) {

  if($localStorage.hasOwnProperty("accessToken")) {
    $http.get("https://graph.facebook.com/v2.3/me", { params: { access_token: $localStorage.accessToken, fields: "id,name", format: "json" }}).then(function(result) {
      $scope.profileData = result.data;
      $scope.monId = result.data.id;
    }, function(error) {
      alert("There was a problem getting your profile.  Check the logs for details.");
      console.log(error);
    });
  } else {
    $location.path("/login");
  }

  //Set messages to chatMessages factory which returns the firebase data
  $scope.messages = chatMessages;
  
  //Initialize message object
  $scope.message = {};

  //Add message to the firebase data
  $scope.$watch('messages', function (val) {
    $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
  }, true);

  $scope.addMessage = function(message) {
    $scope.messages.$add({content: message, id:$scope.profileData.id});
    //we reset the text input field to an empty string
    $scope.message.theMessage = "";
  };

});