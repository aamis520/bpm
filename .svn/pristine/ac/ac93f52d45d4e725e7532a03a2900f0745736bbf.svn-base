/**
 * TestController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    test:function (req, res) {
      getall('start')
          .then(getnext)
          .then(complete)
          .then(function(message){
              res.send(200, {results:message})
           })
    },
};

function getall(start){
    return new Promise(function (resolve, reject) {
        async.series(
            [
              function (callback){
                  simplekeyword.find()
                    .exec(function (err, sks) {
                        callback(null, sks);
                    })
              },
              function (callback){
                callback(null, "results2");
              }

            ]
            ,function(err, results) {
                console.log(results);
                if (results) {
                    resolve(results);
                } else {
                    reject(err);
                }
        });

    });
}

function getnext(start){
    return new Promise(function (resolve, reject) {
     resolve({start:start, getnext:"next"});
    });
}

function complete(start){
    return new Promise(function (resolve, reject) {
     resolve({start:start, getnext:"complete"});
    });
}
