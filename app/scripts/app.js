'use strict';

/**
 * @ngdoc overview
 * @name findteacherApp
 * @description
 * # findteacherApp
 *
 * Main module of the application.
 */



angular.module('app', [
		'ngRoute',
		'ui.slider',
		'ui.InfiniteScroll',
		'LocalStorageModule'
	]).config(['localStorageServiceProvider', function(localStorageServiceProvider) {
		localStorageServiceProvider.setPrefix('ls');
	}]).config(function($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'main.html',
				controller: 'MainCtrl'
			})
			.when('/list', {
				templateUrl: 'list.html',
				controller: 'ListCtrl'
			})
			.when('/filter', {
				templateUrl: 'filter.html',
				controller: 'FilterCtrl'
			})
			.when('/user', {
				templateUrl: 'user.html',
				controller: 'UserCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});


	}).factory('Data', function() {
		// 公共参数
		return {
			key: "", 		// 搜索关键字
			header:'', 		// 头部标题
			goback:true, 	// 返回按钮
			index:1,		// 分页索引
			user:{},		// 老师默认id
			filter:{
				level:'',
				satisfied:{low:0,high:100},
				duration:{low:0,high:100}
			},
			order_type:0, 	// 排序条件
			order_drop:0, 	//（0:降序 1：升序）
			list: []		// 搜索结构列表
		}


	}).factory('Server', function($http, $location, Data) {


		// 提交前函数
		var params = function(obj){
			var def = {
				local: 'en', 			//语种
				deviceId: "XXXXXXXXX", 	//设备id
				devicetype: "android", 	//设备类型
				clientver: "1.0", 		//客户端版本号
				// clientdate: (new Date()).getTime() //客户端调用时间
			}
			obj = obj || {};
			return angular.extend(def,obj);
		}

	

		// 公有方法（与后台异步交互方法）
		return {
			// 搜索
			search: function(key, callback) {

				// 判断是不是刷新分页
				Data.index = key && key.more ? Data.index+1 :1;

				$http({
					method: 'GET',
					url: 'http://192.168.1.104:3000/ilearningmobile/services/mobile/search/huAppSearchService/findSearchTeacherInfo',
					data:'json',
					params:params({
						searchname: Data.key, 	//搜索关键字
						type:Data.order_type,				//排序类型（0:默认 1：级别 2：时长 3：满意度）
						sort_flag:Data.order_drop,			//排序（0:降序 1：升序）
						level: Data.filter.level,        	//级别
						satisfaction:Data.filter.satisfied.low+','+Data.filter.satisfied.high,  	//满意度
						lessonstime:Data.filter.duration.low+','+Data.filter.duration.high,  		//授课时长
						pagesize:"10",			//每页显示条数
						curpage:Data.index		//当前页,
					})
				}).success(function(json) {
					if(!json || json.status !=1 ){return;}
					// Data.list = Data.index>0? Data.list.concat(json.data) : json.data;

					Data.list = Data.index>1? Data.list.concat(json.data) : json.data;
					for(var i =0,l=json.data.length;i<l;i++){

						(function(teacher){
							$http({url: 'http://192.168.1.104:4000/ilearningmobile/services/imobile/commonService/commonService/getImageService?clientType=2&sign=4e45876a130c72d33b37086a2bcf1c19&imageType_request=ratingType&ratingW3Account='+teacher.hu_w3account+'&language=0&w3HuaweiAccount=p00121731&requestTime=1438946020101&clientVer=18',}).success(function(pic){
								if(!pic.imageKey) return;
								teacher.base = 'data:image/gif;base64,' + pic.imageKey.replace(/\n/g,'');
							});
						})(json.data[i]);

					}
					
					callback && callback(json);
				});

			},
			// 取热门搜索
			getHot: function(callback) {
				$http({
					method: 'GET',
					url: 'http://192.168.1.104:3000/ilearningmobile/services/mobile/search/huAppSearchService/findHotSearch?orderNumber=40',
				}).success(function(json){
					var res = [];
					if(!json || json.status !=1 ){return;}
					for(var i =0,l=json.data.length;i<l;i++){
						res.push(json.data[i].hu_hotsearchname);
					}
					callback && callback(res);
				});
			},
			// 老师级别列表
			getLevel:function(callback){
				$http({
					method: 'GET',
					url: 'http://192.168.1.104:3000/ilearningmobile/services/mobile/appcentres/huAppCentreService/findAllTeacherLevel',					
				}).success(function(json){
					if(!json || json.status !=1 ){return;}
					callback && callback(json.data);
				});
			},

			// 取老师详细信息
			getUser:function(callback){

				var res = {}
				var back = function(json){
					angular.extend(res,json);
					// callback && res.base && res.anthen && res.recode && 
					callback && callback(res);
				}

				// 老师基本信息
				$http({
					method: 'GET',
					url: 'http://192.168.1.104:3000/ilearningmobile/services/mobile/appcentres/huAppCentreService/findTeacherBase',
					params:params({teacherid:Data.user.hu_teacherid}),
				}).success(function(json){
					json && back({base:json.data[0]});
				});

				// 授课记录
				$http({
					method: 'GET',
					url: 'http://192.168.1.104:3000/ilearningmobile/services/mobile/appcentres/huAppCentreService/findTeacherGiveLessons',
					params:params({teacherid:Data.user.hu_teacherid}),
				}).success(function(json){
					json && back({recode:json.data});
				});

				// 认证详情
				$http({
					method: 'GET',
					url: 'http://192.168.1.104:3000/ilearningmobile/services/mobile/appcentres/huAppCentreService/findTeacherDetails',
					params:params({teacherid:Data.user.hu_teacherid}),
				}).success(function(json){
					json && back({anthen:json.data});
				});

				
			}
		}
	});



// 1.热门搜索字段名改变了 原hu_hotsearchname
// 1.热门搜索内容文字有加了''号了("'蔡安恒'")
// 2.搜索功能添加参数找不到东西
// 3.老师基本信息没有data为空
// 4.老师授课记录没有data为空
// 4.老师认证详情没有data为空

















