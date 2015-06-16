angular.module('starter.controllers', [])

.controller("LoginController", function($scope, $cordovaOauth, $localStorage, $location) {
    $scope.login = function() {
      if(!$localStorage.hasOwnProperty("accessToken")) {
        $cordovaOauth.facebook("763024983807122", ["email", "read_stream", "user_website", "user_location", "user_relationships", "user_friends"]).then(function(result) {
            $localStorage.accessToken = result.access_token;
            $location.path("/tab/dash");
        }, function(error) {
            alert("There was a problem signing in!  See the console for logs");
            console.log(error);
        });
      }else{
        $location.path("/tab/dash");
      }
    };
 
})

.controller('DashCtrl', function($scope, $resource, Bar, Camera) {
  if($localStorage.hasOwnProperty("accessToken")) {
    
      // $scope.getPhoto = function() {
      //   Camera.getPicture().then(function(imageURI) {
      //     console.log(imageURI);
      //   }, function(err) {
      //     console.err(err);
      //   });
      // };

      $scope.bars = Bar.query();
  } else {
      $location.path("/login");
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

.controller('chatController', ["$scope", "$localStorage", "$http", "$location", "chatMessages","$ionicScrollDelegate", function($scope, $localStorage, $http, $location, chatMessages, $ionicScrollDelegate ) {
    
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

}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


