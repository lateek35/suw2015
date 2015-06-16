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
  // $scope.getPhoto = function() {
  //   Camera.getPicture().then(function(imageURI) {
  //     console.log(imageURI);
  //   }, function(err) {
  //     console.err(err);
  //   });
  // };

    $scope.bars = Bar.query();
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

.controller('chatController', ["$scope", "chatMessages","$ionicScrollDelegate", function($scope, chatMessages, $ionicScrollDelegate ) {
    //Set messages to chatMessages factory which returns the firebase data
    $scope.messages = chatMessages;
    
    //Initialize message object
    $scope.message = {};
 
    //Add message to the firebase data
    $scope.addMessage = function(message) {
      $scope.messages.$add({content: message, name:"aan"});
      //we reset the text input field to an empty string
      $scope.message.theMessage = "";
      $ionicScrollDelegate.$getByHandle('mainScroll').scrollBottom(true);
    };

    $scope.$watch('messages', function() {
      alert('hey, myVar has changed!');
    });


}])

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})


