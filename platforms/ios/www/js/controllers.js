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
      $('.getSoiree, .getInvit').toggleClass('active');
    };
    $scope.getInvitations = function(){
      $rootScope.title = "Mes invitation";
      $scope.showme = false;
      $('.getSoiree, .getInvit').toggleClass('active');
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

      $http.get("https://graph.facebook.com/v2.3/me/taggable_friends?limit=1000", { params: { access_token: $localStorage.accessToken, format: "json" }}).then(function(result) {
          $scope.friendsData = result.data.data;
          $http.get("https://graph.facebook.com/v2.3/me/taggable_friends?limit=1000", { params: { access_token: $localStorage.accessToken, fields: "picture", format: "json" }}).then(function(result) {
            $scope.friendsData.picture = result.data.data;
        });
      }, function(error) {
          alert("There was a problem getting your profile.  Check the logs for details.");
          console.log(error);
      });
    }else{
      $ionicSideMenuDelegate.canDragContent(false);
      $rootScope.logged = false;
      $location.path("/login");
    }
    $scope.test=0;

    $scope.control = function($event,friendData){
      if($('input[name="friendInvite"]:checked').length > 4){
        $event.preventDefault();
      }
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
      // console.log($('input[name="friendInvite"]:checked').val());
      for(var i=0; i<$('input[name="friendInvite"]:checked').length; i++){
        var pieces = $('input[name="friendInvite"]:checked')[i].value.split("|");
        $('div.friend-'+i).append("<img src='"+pieces[1]+"'/>");
        $('div.friend-'+i).append("<p>"+pieces[0]+"</p>");
      }
    };
    $scope.createSoiree = function(){
      var boite, date, heure, id_fb1, id_fb2, id_fb3, id_fb4, url_img1, url_img2, url_img3, url_img4 = '';
      boite = $('select[name="boite"]').val();
      date = $('input[name="date"]').val();
      heure = $('input[name="time"]').val();
      id_fb1 = $('div.friend-0 p').html();
      url_img1 = $('div.friend-0 img').attr('src');
      if($('div.friend-1 p')){   
        id_fb2 = $('div.friend-1 p').html();
      }
      if($('div.friend-1 img')){   
        url_img2 = $('div.friend-1 img').attr('src');
      }else{
        url_img2 = null;
      }
      if($('div.friend-2 p')){   
        id_fb3 = $('div.friend-2 p').html();
      }
      if($('div.friend-2 img')){   
        url_img3 = $('div.friend-2 img').attr('src');
      }else{
        url_img3 = null;
      }
      if($('div.friend-3 p')){   
        id_fb4 = $('div.friend-3 p').html();
      }
      if($('div.friend-3 img')){   
        url_img4 = $('div.friend-3 img').attr('src');
      }else{
        url_img4 = null;
      }
      $.post('http://8affc41bd7.url-de-test.ws/create_soiree',
        {
          id_fb: $localStorage.profileDatas.id,
          boite: boite,
          date: date,
          heure: heure,
          id_fb1: id_fb1,
          url_img1: url_img1,
          id_fb2:id_fb2,
          url_img2:url_img2,
          id_fb3:id_fb3,
          url_img3:url_img3,
          id_fb4:id_fb4,
          url_img4:url_img4
        },
        function(data,status){
          if(data=='OK'){
            console.log(data);
            $location.path('/tab/soiree');
            $rootScope.init();
          }
      });
    };
})

.controller('SoireeDetailCtrl', function($scope, $localStorage, $location, $rootScope, $ionicSideMenuDelegate, $stateParams, $ionicHistory) {
  if($localStorage.hasOwnProperty("accessToken")) {
    $rootScope.route = "create";
    $.post('http://8affc41bd7.url-de-test.ws/une_soiree',{id_soiree: $stateParams.soireeId},function(data,status){
        if(data[0].url_img1 != null){
          data[0].url_img1 = data[0].url_img1.replace(/&amp;/g, '&');
        }
        if(data[0].url_img2 != null){
          $scope.img2 = data[0].url_img2.replace(/&amp;/g, '&');
        }
        if(data[0].url_img3 != null){
          $scope.img3 = data[0].url_img3.replace(/&amp;/g, '&');
        }
        if(data[0].url_img4 != null){
          $scope.img4 = data[0].url_img4.replace(/&amp;/g, '&');
        }
        $scope.datasSoiree = data[0];
        $rootScope.title = "Soirée du "+data[0].date;
        $scope.$apply();
      });
  }else{
    $ionicSideMenuDelegate.canDragContent(false);
    $rootScope.logged = false;
    $location.path("/login");
  }

  $rootScope.goBack = function(){
      $ionicHistory.goBack();
      $location.path('/tab/soiree');
      $rootScope.init();
    };

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