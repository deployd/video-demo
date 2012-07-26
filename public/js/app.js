function ListController($scope) {
  $scope.add = function () {
    var product = {
      title: $scope.newItemText,
      price: $scope.newItemPrice,
      creator: $scope.uid
    };
    
    dpd.products.post(product, function(p, err) {
      if(err) {
        alert(err.errors.price);
      } else {
        $scope.products.push(p);
      }
      $scope.$apply();
    });
    $scope.newItemText = $scope.newItemPrice = '';
  }
 
  $scope.change = function (item) {
    dpd.products.put(item.id, {purchased: item.purchased}, function (p, err) {
      if(err && err.message) {
        alert(err.message);
        item.purchased = !item.purchased;
        $scope.$apply();
      }
    });
  }
  
  $scope.total = function () {
    var items = $scope.products
      , total = 0;
    for(var i = 0; i < items.length; i++) {
      total += items[i].price || 0;
    }
    
    return total;
  }
 
  // get initial items
  function fetch() {
    var creator = $scope.uid;
    var search = window.location.search;
    search && (search = search.replace('?', ''));
    search && (creator = search);
    if(creator) {
      $scope.uid = creator;
      creator = creator.replace('#', '');
      dpd.products.get({creator: creator}, function (products) {
        $scope.products = products;
        $scope.$apply();
      });

      dpd.users.get({id: creator}, function(user) {
        $scope.creator = user.username;
        $scope.$apply();
      });
    }
  }
  fetch();
  
  $scope.login = function () {
		dpd.users.login({
			email: $scope.email,
			password: $scope.password
		}, function (session) {
			if(session.id) {
				$scope.uid = session.uid;
				me();
				fetch();
				$scope.$apply();
			}
		})
	}

  function me() {
    dpd.users.me(function (me) {
  		if(me && me.id) {
  			$scope.me = me;
  			$scope.uid = me.id;
  			$scope.password = '';
  			$scope.$apply();
  			fetch();
  		}
  	})
  }
  
  me();
 
  $scope.logout = function () {
    dpd.users.logout();
		$scope.password = '';
		$scope.me = null;
    $scope.uid = null;
  }
  
  dpd.on('products:changed', function(creator) {
    if(creator !== $scope.me.id) {
      fetch();
    }
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
}