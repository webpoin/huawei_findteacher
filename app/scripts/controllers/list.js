'use strict';

/**
 * @ngdoc function
 * @name findteacherApp.controller:MainCtrl
 * @description
 * # ListCtrl
 * Controller of the findteacherApp
 */
angular.module('app').controller('ListCtrl', function ($scope,$location,Data,Server) {
	$scope.data = Data;
	Data.header = "搜索";
	Data.goback = true;
	
	Server.search();
	
	$scope.list = [ 		
		{name:'级别',drop:true},
		{name:'时长',drop:true},
		{name:'满意度',drop:true}
	];


	$scope.order = function(index){
		$scope.list[index].drop = !$scope.list[index].drop;

		Data.order_type = index +1;
		Data.order_drop = $scope.list[index].drop ? 0:1;
		Server.search();
	}

	$scope.orderDef = function(){
		$scope.list[0].drop = true;
		$scope.list[1].drop = true;
		$scope.list[2].drop = true;
		Data.order_type = 0;
		Data.order_drop = 0;
		Server.search();
	} 


	$scope.loadMore = function() {
		Server.search({more:true});
	}


	$scope.getUser = function(user){
		Data.user = user;
		$location.path('/user');
	}
  
});
