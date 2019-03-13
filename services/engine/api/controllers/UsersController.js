/**
 * Created by demo on 2017/5/25.
 */

//TODO，这个地方需要重新考虑一下，登录应该是向中心服务器进行验证，而不是自己的服务器就可以了
module.exports = {
    listusers:function (req,res) {
        Users.find({

        }).exec(function (err,users) {
              if(!users){
                  res.send(200,{error:"未找到users"})
              }else{
                  res.send(200,{users:users})
              }
        })
    }
}
