var bpm_url = 'http://192.168.6.22:1337';
angular.module('starter.controllers', [])
.controller('myCtrls', function($scope,$rootScope,$state,$q) {
  $state.go("login");
  // $state.go("tab.dash");
  $scope.startLogin = function (userName,password) {
    var deferred = $q.defer();
    var promise = deferred.promise;
    promise
      .then(function(val) {
        console.log(val);
        return 'B';
      })
      .then(function(val) {
        console.log(val);
        return 'C'
      })
      .then(function(val) {
        console.log(val);
      });
    deferred.resolve('A');
  };
  // $scope.startLogin()
  $scope.login_data = {
    "usrid":"591a71fc8c9082580984cee8",
    "username":"小明",
    "companyname":"圣达康网络科技有限公司",
    "avartar":"",
    "applications":{
    "needtoshow":[
      {
        "name":"测试流程",
        "icon":"",
        "url":"/591a72e88c9082580984cee9|0|form"
      },
      {
        "name":"流程及页面测试",
        "icon":"",
        "url":"/592d361676028b1c192252f0|tijiao|ceshitijiao"
      },
      {
        "name":"展示",
        "icon":"fa-trash-o",
        "url":"/592e1c7d79faf98820c7a067|tijiao|shenpi1"
      },
      {
        "name":"展示2",
        "icon":"",
        "url":"/592e1ee5997a731828c3b945|tijiaoshenqing|tijiaoshenqing"
      },
      {
        "name":"展示流程",
        "icon":"",
        "url":"/592e5534997a731828c3b953|tijiaoshenqing|undefined"
      },
      {
        "name":"用于测试关键字的流程",
        "icon":"",
        "url":"/5934d02203fa63fc070b30bc|kaishi|zhanshidekeshan"
      },
      {
        "name":"计算总数",
        "icon":"",
        "url":"/5937cab1310ddbcc1b86d3e9|jisuan1|jisuan1"
      }
    ],
      "moretoshow":[
      {
        "name":"张秀灿测试1",
        "icon":"",
        "url":"/593e61757de1eb6032fe0dd3|kaishi|ceshitiaozhuan"
      },
      {
        "name":"返回指定JSON",
        "icon":"",
        "childs":[
          {
            "icon":"fa-trash-o",
            "name":"一号",
            "url":"/5940d09706f4279c2c8afc6c|yihao|undefined"
          },
          {
            "icon":"",
            "name":"五号",
            "url":"/5940d09706f4279c2c8afc6c|wuhao|tijiaoE"
          }
        ]
      },
      {
        "name":"一步步提交",
        "icon":"fa-trash-o",
        "url":"/5949eb13a476b33c34e0cfce|tijiao|tijiao2"
      },
      {
        "name":"测试稳定性",
        "icon":"",
        "url":"/594b412f26ac2eb03ec9a2e0|kaishi|undefined"
      },
      {
        "name":"报销管理",
        "icon":"",
        "url":"/594b7050b70d78bc21133a36||undefined"
      },
      {
        "name":"用于测试条件",
        "icon":"",
        "url":"/5951b4fbe87545a44e34db4c|tijiao|undefined"
      },
      {
        "name":"参数传递",
        "icon":"",
        "url":"/5951f5539335f7480f400d1d|kaishi|undefined"
      },
      {
        "name":"测试路由显示",
        "icon":"",
        "url":"/595230a8e8e77f482fdb8d76|1111|喀shen"
      }
    ]
  }
  }
})
.controller('loginCtrl', function($scope,$state,$http,$rootScope) {
  $scope.user = {
    username:'',
    password:''
  };
  $scope.signIn = function () {
    var username = $scope.user.username;
    var password = $scope.user.password;
    if(password == '' || username == ''){
      alert("用户名密码不能为空")
    }else{
      $http({
        url: bpm_url+'/login/applogin',
        method: "GET",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        params:{
          loginname:username,
          password:password
        }
      })
        .success(function (data) {
          console.log(data)
          $rootScope.usrid = data.usrid;
          $state.go("tab.dash");
          get_set_person();
        })
        .error(function (data) {
        console.log(data)
      })
    }
  };

  //新建数据库==部门信息，人员信息存入数据库
  function get_set_person() {
    $rootScope.person_db = window.sqlitePlugin.openDatabase({name: 'person.db', location: 'default'});
    $rootScope.person_db.transaction(function(tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Groups (departmentName, id)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS Person (personName, personDesc, departmentId, telPhone, officePhone, email)');
    }, function(error) {
      // alert('164Transaction ERROR: ' + error.message);
    }, function() {
      // alert('166Populated database OK');
    });

    //获取部门信息
    $http({
      url: bpm_url+'/department/listdepartment',
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
      .success(function (data) {
        console.log(data)
        var $data = data.department;
        var $length = $data.length;
        for(var i=0;i<$length;i++ ){
          insert_partement($data[i].departmentName,$data[i].id);
        }
      })
      .error(function (data) {
        console.log(data)
      });

    //获取人员信息
    $http({
      url: bpm_url+'/person/listperson',
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params:{
        userStatus:1
      }
    })
      .success(function (data) {
        console.log(data)
        var $data = data.person;
        var $length = $data.length;
        for(var i=0;i<$length;i++ ){
          insert_person($data[i].personName, $data[i].personDesc, $data[i].departmentId, $data[i].telPhone, $data[i].officePhone, $data[i].email);
          }
      })
      .error(function (data) {
        console.log(data)
      });

  };

  //插入部门信息到数据库
  function insert_partement(departmentName,id) {
    $rootScope.person_db.transaction(function(tx) {
      tx.executeSql('INSERT INTO Groups VALUES (?,?)', [departmentName, id]);
    }, function(error) {
      // alert('219Transaction ERROR: ' + error.message);
    }, function() {
      // alert('221Populated database OK');
    });
  }
  //插入人员信息到数据库
  function insert_person(personName, personDesc, departmentId, telPhone, officePhone, email) {
    $rootScope.person_db.transaction(function(tx) {
      tx.executeSql('INSERT INTO Person VALUES (?,?,?,?,?,?)', [personName, personDesc, departmentId, telPhone, officePhone, email]);
    }, function(error) {
      // alert('229 ERROR: ' + error.message);
    }, function() {
      // alert('231Populated database OK');
    });
  };


  })

  //首页
  .controller('DashCtrl', function($scope,$state,$rootScope) {
    $rootScope.goDash = function () {
      $state.go("tab.dash");
    };
    $scope.initDash = $scope.login_data;
    $scope.goSecond = function (url,child) {
      console.log(url)
      console.log(child)
      $rootScope.appliListData = child;
      url?$state.go("tab.appliDetail",{data:url}):$state.go("tab.appliList");
    };

  })
  .controller('applicationCtrl', function($scope,$state,$rootScope) {
    $scope.initDash = $scope.login_data.applications.moretoshow;

    $scope.goSecond = function (url,child) {
      console.log(url)
      console.log(child)
      $rootScope.appliListData = child;
      url?$state.go("tab.appliDetail",{data:url}):$state.go("tab.appliList")
    }
  })
  .controller('appliListCtrl', function($scope,$state,$rootScope) {
    console.log($rootScope.appliListData)

  })
  .controller('appliDetailCtrl', function($scope,$rootScope,$state,$stateParams) {
    console.log($stateParams.data)
    $scope.url = './dist/index.html#/login'

  })

  //消息
  .controller('ChatsCtrl', function($scope,$rootScope,$http) {

    // var db = null;
    // db = window.sqlitePlugin.openDatabase({name: 'massage.db', location: 'default'});
    // db.transaction(function(tx) {
    //   tx.executeSql('CREATE TABLE IF NOT EXISTS Massage (flowid, flowname, time, title, url)');
    //   tx.executeSql('INSERT INTO Person VALUES (?,?)', ['Alice', 101]);
    // }, function(error) {
    //   alert('Transaction ERROR: ' + error.message);
    // }, function() {
    //   alert('Populated database OK');
    // });
    // db.executeSql('SELECT * FROM Massage', [], function(rs) {
    //   alert(rs.rows.length+'   Person): ' + rs.rows.item(0).name);
    // }, function(error) {
    //   alert('SELECT SQL statement ERROR: ' + error.message);
    // });


    $http({
      url: bpm_url+'/message/messagequerybycount',
      method: "GET",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      params:{
        usrid:$rootScope.usrid,
        count:200
      }
    })
      .success(function (data) {
        console.log(data)
        $scope.msg = data.messages;
      })
      .error(function (data) {
        console.log(data)
      })
  })
  .controller('msgDetailsCtrl', function($scope,$rootScope,$http,$stateParams) {
    console.log($stateParams.data)
    $scope.url = './dist/index.html#/login';
    $scope.goChats = function () {
      $state.go("tab.chats");
    }
  })

//  联系人
.controller('AccountCtrl', function($scope,$rootScope) {
  //获取手机通讯录
  // var options = [navigator.contacts.fieldType.displayName, navigator.contacts.fieldType.name]
  // navigator.contacts.find(options,function (contacts) {
  //   $scope.contactsList = contacts;
  // },function (e) {
  //   alert(e)
  // })


  //查询部门信息
  $rootScope.person_db.executeSql('SELECT * FROM Groups', [],
    function(rs) {
      var len = rs.rows.length;
      alert(len)
      var comprodata = [];
      if(len > 0){
        for(var i=0;i<len;i++){
          var tempdata = {};
          tempdata["departmentName"] = rs.rows.item(i)["departmentName"];
          tempdata["id"] = rs.rows.item(i)["id"];
          comprodata.push(tempdata);
        }
      }
      $scope.department = comprodata;
    },
    function(error) {
      alert('SELECT SQL statement ERROR: ' + error.message);
    });


})
  .controller('personListCtrl', function($scope,$rootScope,$state,$http,$stateParams) {
    $scope.department = $stateParams.department;
    //查询部门人员信息
    var $sql = '';
    if( $stateParams.departId == 'sdk'){
      $sql = 'SELECT * FROM Person';
    }else{
      $sql = 'SELECT * FROM Person WHERE departmentId="'+$stateParams.departId+'"';
    }
    $rootScope.person_db.executeSql($sql, [], function(rs) {

      var len = rs.rows.length;
      var comprodata = [];
      if(len > 0){
        for(var i=0;i<len;i++){
          var tempdata = {};
          tempdata["personName"] = rs.rows.item(i)["personName"];
          tempdata["personDesc"] = rs.rows.item(i)["personDesc"];
          tempdata["departmentId"] = rs.rows.item(i)["departmentId"];
          tempdata["telPhone"] = rs.rows.item(i)["telPhone"];
          tempdata["officePhone"] = rs.rows.item(i)["officePhone"];
          tempdata["email"] = rs.rows.item(i)["email"];
          comprodata.push(tempdata);
        }
      }
      $rootScope.personList = comprodata;
    }, function(error) {
      alert('SELECT SQL statement ERROR: ' + error.message);
    });
    //人员详情页面
    $scope.go_person_detail = function ($index) {
      console.log($index);
      $state.go("tab.personDetail",{num:$index})
    }
  })
.controller('personDetailCtrl', function($scope,$rootScope,$stateParams) {
  $scope.person = $rootScope.personList[$stateParams.num];
  console.log($scope.person);
})

//  我的
.controller('MainCtrl', function($scope) {

});
