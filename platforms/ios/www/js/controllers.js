angular.module('starter.controllers', ["ionic", "ngStorage", "ngCordova"])

.controller("LoginController", function($rootScope, $scope, $cordovaOauth, $localStorage, $location, $http, $ionicSideMenuDelegate, $state) {
    $ionicSideMenuDelegate.canDragContent(false);
    $rootScope.logged = false;
    $rootScope.title = "Login";
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
        $scope.showme = true;
        $rootScope.route = "soirees";
        $rootScope.title = "Mes soirées";

        $.post('http://8affc41bd7.url-de-test.ws/soirees',{id_fb: $localStorage.profileDatas.id},function(data,status){
          $scope.soirees = data;
          $scope.$apply();
        });

        $.post('http://8affc41bd7.url-de-test.ws/invitations_mec',{id_fb: $localStorage.profileDatas.id},function(data,status){
          $scope.invitations = data;
          $scope.$apply();
        });

      }else{
        $ionicSideMenuDelegate.canDragContent(false);
        $rootScope.logged = false;
        $location.path("/login");
      }
    };
    $rootScope.openSideMenu = function(){
      $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.getSoirees = function(){
      $rootScope.title = "Mes soirées";
      $scope.showme = true;
    };
    $scope.getInvitations = function(){
      $rootScope.title = "Mes invitation";
      $scope.showme = false;
    };
    $rootScope.create = function(){
      // $rootScope.title = "Créer une soirée";
      $scope.changeState();
    }
    $scope.changeState = function () {
        $location.path("/create");
        if($rootScope.alreadyPassInCreateForm){
          $rootScope.initCreate();
        }
    };
})

.controller('CreateCtrl', function($rootScope, $scope, $ionicHistory, $location, $localStorage, $http) {
    if($localStorage.hasOwnProperty("accessToken")) {
      $scope.inviteFriends = '';
      $scope.friendsChoose = '';
      $rootScope.title = "Créer une soirée";
      $rootScope.route = "create";
      $rootScope.alreadyPassInCreateForm = true;

      $.get('http://8affc41bd7.url-de-test.ws/boites',function(data,status){
        $scope.boites = data;
        $scope.$apply();
      });

      $.get('http://8affc41bd7.url-de-test.ws/boites',function(data,status){
        $scope.boites = data;
        $scope.$apply();
      });

      $http.get("https://graph.facebook.com/v2.3/me/friends?limit=1000", { params: { access_token: $localStorage.accessToken, format: "json" }}).then(function(result) {
          $scope.friendsData = result;
      }, function(error) {
          alert("There was a problem getting your profile.  Check the logs for details.");
          console.log(error);
      });

      // $http.get("https://graph.facebook.com/v2.3/me/taggable_friends?limit=1000", { params: { access_token: $localStorage.accessToken, format: "json" }}).then(function(result) {
      //     $scope.friendsData = result.data.data;
      //     $http.get("https://graph.facebook.com/v2.3/me/taggable_friends?limit=1000", { params: { access_token: $localStorage.accessToken, fields: "picture", format: "json" }}).then(function(result) {
      //       $scope.friendsData.picture = result.data.data;
      //   });
      // }, function(error) {
      //     alert("There was a problem getting your profile.  Check the logs for details.");
      //     console.log(error);
      // });
    }else{
      $ionicSideMenuDelegate.canDragContent(false);
      $rootScope.logged = false;
      $location.path("/login");
    }
    $rootScope.initCreate = function(){
      $rootScope.title = "Créer une soirée";
      $rootScope.route = "create";
    };
    $rootScope.goBack = function(){
      $('div.friend img').remove();
      $('div.friend p').remove();
      $('input[name="friendInvite"]:checked').attr('checked', false);
      $('input[type="text"]').val('');
      $ionicHistory.goBack();
      $location.path('/tab/soiree');
      $rootScope.init();
    };
    $scope.chooseFriends = function(){
      $scope.inviteFriends = 'cool';
    };
    $scope.validateFriends = function(){
      $scope.inviteFriends = '';
      $('div.friend img').remove();
      $('div.friend p').remove();
      console.log($('input[name="friendInvite"]:checked').val());
      // AaILwC27glK_kfSugI6_TJ6aaGj6HPAAMVUeAzsUXzzLUSY1phX4oZoixem7P2XAx0Mm2mAoriR0odmV0YDczDXaRHcdeEOgTi92eZpK6DJEkA
      // AaLyq6XwO0cb_c35t09t0f-dy-KA__yfqlEzojFEP2oQOr07QrXTKgRr5STwQisferKtW36Sxl9DeMcYwYn0YSMGKiqVo1A0c_foopGpz2BjLw
      for(var i=0; i<$('input[name="friendInvite"]:checked').length; i++){
        var pieces = $('input[name="friendInvite"]:checked')[i].value.split("|");
        $('div.friend-'+i).append("<img src='"+pieces[1]+"'/>");
        $('div.friend-'+i).append("<p>"+pieces[0]+"</p>");
      }
    };
    $scope.createSoiree = function(){
      var id_fb = $localStorage.profileDatas.id;
      var boite = $('select[name="boite"]').val();
      var date = $('input[name="date"]').val();
      var heure = $('input[name="time"]').val();
      console.log(heure);
    };
})

.controller('SoireeDetailCtrl', function($scope, Masoiree) {
    $scope.ma_soiree = Masoiree.all();

  /*$scope.remove = function(dash) {
    Soirees.remove(dash);*/
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