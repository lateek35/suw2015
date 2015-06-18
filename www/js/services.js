angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
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

.factory("chatMessages", ['$firebase', "$rootScope", function($firebase, $rootScope){
  // create a reference to the Firebase where we will store our data
  var ref = new Firebase("https://meetnight.firebaseio.com/");

  // this uses AngularFire to create the synchronized array
  // We limit the results to 10
  return $firebase(ref.limitToLast(100)).$asArray();
}])


.factory('Masoiree', function() {
  // Mettre une variable pour le statut avec des if else

  var ma_soiree = [{
    id_soiree: 0,
    id_fb: 451892,
    boite: 'WonderLust',
    date: '20/06/2015',
    nbr_participants: 5,
    statut: 0,
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }];

  return {
    all: function() {
      return ma_soiree;
    }/*,
    remove: function(dash) {
      soirees.splice(soirees.indexOf(dash), 1);
    },
    get: function(dashId) {
      for (var i = 0; i < soirees.length; i++) {
        if (soirees[i].id === parseInt(dashId)) {
          return soirees[i];
        }
      }
      return null;
    }*/
  };
})

.factory('Invitations', function() {
  // Mettre une variable pour le statut avec des if else

  var invitations = [{
    id_invitation: 0,
    id_fb: 451892,
    boite: 'Coucou',
    date: '20/06/2015',
    nbr_participants: 5,
    statut: 0,
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id_invitation: 1,
    id_fb: 451892,
    boite: 'ggggg',
    date: '20/06/2015',
    nbr_participants: 3,
    statut: 0,
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  },{
    id_invitation: 2,
    id_fb: 451892,
    boite: 'Rex Club',
    date: '20/06/2015',
    nbr_participants: 4,
    statut: 1,
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id_invitation: 3,
    id_fb: 451892,
    boite: 'Social Club',
    date: '20/06/2015',
    nbr_participants: 5,
    statut: 0,
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id_invitation: 4,
    id_fb: 451892,
    boite: 'Le Duplex',
    date: '20/06/2015',
    nbr_participants: 3,
    statut: 1,
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return invitations;
    }/*,
    remove: function(dash) {
      soirees.splice(soirees.indexOf(dash), 1);
    },
    get: function(dashId) {
      for (var i = 0; i < soirees.length; i++) {
        if (soirees[i].id === parseInt(dashId)) {
          return soirees[i];
        }
      }
      return null;
    }*/
  };
})

.factory('testEnvoi', ['$resource', function($resource){
  return $resource('http://8affc41bd7.url-de-test.ws/soirees',
    {
      'poster': {method: 'POST'}
    });
  }
]);
