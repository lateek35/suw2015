angular.module('starter.services', ['ngResource'])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}])
.factory("chatMessages", ['$firebase', "$rootScope", function($firebase, $rootScope){
     // create a reference to the Firebase where we will store our data
     var ref = new Firebase("https://meetnight.firebaseio.com/");
 
     // this uses AngularFire to create the synchronized array
     // We limit the results to 10
     return $firebase(ref.limitToLast(100)).$asArray();
}])

.factory('Bar', ['$resource',
  function($resource){
    return $resource('http://8affc41bd7.url-de-test.ws/:other', {other:'@id'},
      {
        'update': {method: 'PUT'}
      }
    );
  }
]);
