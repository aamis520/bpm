/**
 * Created by MISSyang on 2017/6/26.
 */
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])
  .config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');


    $stateProvider
      .state("guidePage",{
        url:"/guidePage",
        templateUrl:"templates/guidepage.html"
      })

      //登录页
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login/login.html',
        controller: 'loginCtrl'
      })
      .state('tab', {
        url: '/tab',
        templateUrl: 'templates/tabs.html'
      })
      .state('tab.dash', {
        url: '/dash',
        views: {
          'tab-dash': {
            templateUrl: 'templates/tab-dash.html',
            controller: 'DashCtrl'
          }
        }
      })
      .state('tab.application', {
        url: '/application',
        views: {
          'tab-dash': {
            templateUrl: 'templates/dash/dash-all-application.html',
            controller: 'applicationCtrl'
          }
        }
      })
      .state('tab.appliList', {
        url: '/appliList?url',
        views: {
          'tab-dash': {
            templateUrl: 'templates/dash/dash-application-list.html',
            controller: 'appliListCtrl'
          }
        }
      })
      .state('tab.appliDetail', {
        url: '/appliDetail?data',
        views: {
          'tab-dash': {
            templateUrl: 'templates/dash/dash-application-detail.html',
            controller: 'appliDetailCtrl'
          }
        }
      })
      .state('tab.chats', {
        url: '/chats',
        views: {
          'tab-chats': {
            templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'
          }
        }
      })
      .state('tab.msgDetail', {
        url: '/msgDetail?data',
        views: {
          'tab-chats': {
            templateUrl: 'templates/msg_details.html',
            controller: 'msgDetailsCtrl'
          }
        }
      })
      .state('tab.account', {
        url: '/account',
        views: {
          'tab-account': {
            templateUrl: 'templates/tab-account.html',
            controller: 'AccountCtrl'
          }
        }
      })
      .state('tab.personList', {
        url: '/personList?department?departId',
        views: {
          'tab-account': {
            templateUrl: 'templates/person/person_list.html',
            controller: 'personListCtrl'
          }
        }
      })
      .state('tab.personDetail', {
        url: '/personDetail?num',
        views: {
          'tab-account': {
            templateUrl: 'templates/person/person_detail.html',
            controller: 'personDetailCtrl'
          }
        }
      })
      .state('tab.main', {
        url: '/main',
        views: {
          'tab-main': {
            templateUrl: 'templates/tab-main.html',
            controller: 'MainCtrl'
          }
        }
      })

    // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/tab/dash');

  });
