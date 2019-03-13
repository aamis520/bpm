/**
 * Created by demo on 2017/7/14.
 */
module.exports = {
  // 创建或更新autocheckconditions

  updateorcreateautocheckconditions:function (req,res) {
      var flowid = req.param("flowid");
      var desc = req.param("desc");
      var operations = req.param("operations");
      var conditionid = req.param("conditionid");

      Autocheckconditions.findOne({
          id:conditionid
      }).exec(function (err,condition) {
          if(err){
              res.send(200,{error:'未找到autocheckcondition'})
          }else{
              if(!condition){
                  Autocheckconditions.create({
                      desc:desc,
                      flowid:flowid,
                      operations:operations
                  }).exec(function (err,conditionsed) {
                      if(!conditionsed){
                          res.send(200,{error:'创建autocheckcondition失败'})
                      }else{
                          res.send(200,{id:conditionsed.id})
                      }
                  })
              }else{
                  Autocheckconditions.update(
                      {id:conditionid},
                      {
                          desc:desc,
                          flowid:flowid,
                          operations:operations
                      }
                  ).exec(function (err,upconditions) {
                      if(!upconditions){
                          res.send(200,{error:'更新autocheckcondition失败'})
                      }else{
                          res.send(200,{id:upconditions[0].id})
                      }
                  })
              }
          }
      })
  },

  // 列出一个流程下的所有自动条件
  listautocheckconditions:function (req,res) {
      var flowid = req.param("flowid");
      Autocheckconditions.find({
          flowid:flowid
      }).exec(function (err,conditions) {
          if(!conditions){
              res.send(200,{error:'获取autocheckconditions失败'})
          }else{
              res.send(200,{conditions:conditions})
          }
      })
  }
};
