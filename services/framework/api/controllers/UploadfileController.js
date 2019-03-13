var iconv = require('iconv-lite')
var encoding = require('encoding')
module.exports = {
  upload: function(req, res) {
    var path = require("path")
    var fs = require("fs")
    //接收携带的参数
    var submitter = req.param("usrname");
    var usrid = req.param('usrid')
    var parentid = req.param("parentid")
    var flowid = req.param("flowid")
    var nodeid = req.param("nodeid")
    var filename = req.param("filename")
    filename = iconv.encode(filename,'gbk')
    filename = iconv.decode(filename,'gbk')
    //filename = encoding.convert(filename, "utf8")
    //filename = new Buffer(filename).toString('base64');
    var foldertype = req.param("foldertype") //必传参数  public flows priviate
    var folderkey = req.param("folderkey")
    var newpath = ""
    var dirname = ""

    if(folderkey){
      newpath ="/opt/lampp/htdocs/BPM/"+"services//framework//files//"+foldertype+"//"+folderkey+'//' +filename
      urlpath = "192.168.6.22/BPM/"+"services//framework//files//"+foldertype+"//"+folderkey+'//' +filename
      dirname = "/opt/lampp/htdocs/BPM/"+"services//framework//files//"+foldertype+"//"+folderkey+'//'
    }else{
      newpath ="/opt/lampp/htdocs/BPM/"+"services//framework//files//"+foldertype+"//" +filename
      urlpath = "192.168.6.22/BPM/"+"services//framework//files//"+foldertype+"//"+folderkey+'//' +filename
      dirname = "/opt/lampp/htdocs/BPM/"+"services//framework//files//"+foldertype+"//"
    }

    req.file('file').upload({
      // don't allow the total upload size to exceed ~10MB
      maxBytes: 10000000,
      dirname: dirname
    }, function whenDone(err, uploadedFiles) {
      if(err) {
        return res.negotiate(err);
      }

      // If no files were uploaded, respond with an error.
      if(uploadedFiles.length === 0) {
        return res.badRequest('No file was uploaded');
      }else{
        //更改文件名
        if(uploadedFiles[0].filename == filename){
          fs.renameSync(uploadedFiles[0].fd, newpath);  // 重命名
        }

        Uploadfile.findOne({
          submitter:submitter,
          submitterid:usrid,
          filename:filename,
          foldertype:foldertype,
          folderkey:folderkey
        }).exec(function(err,file){
          if(err){
            res.send(200,{err:err})
          }
          if(file){
            Uploadfile.update({
              submitter:submitter,
              submitterid:usrid,
              filename:filename,
              foldertype:foldertype,
              folderkey:folderkey
            },{
              submitter:submitter,
              submitterid:usrid,
              flowid:flowid,
              nodeid:nodeid,
              parentid:parentid,
              filename:filename,
              path:urlpath,
              foldertype:foldertype,
              folderkey:folderkey
            }).exec(function(err,updatefile){
              if(err){
                res.send(200,{err:err})
              }else{
                res.send(200,{file:updatefile})
              }
            })
          }
          if(!file){
            Uploadfile.create({
              submitter:submitter,
              submitterid:usrid,
              filename:filename,
              path:urlpath,
              flowid:flowid,
              nodeid:nodeid,
              parentid:parentid,
              foldertype:foldertype,
              folderkey:folderkey
            }).exec(function(err,createfile){
              if(err){
                res.send(200,{err:err})
              }else{
                res.send(200,{file:createfile})
              }
            })
          }
        })

      }
    });
  },

  uploadlogo:function(req,res){  //这个接口是专门用来做logo的上传的，信息没有别的上传多，所以单独写一个--liuguochao
    var path = require("path");
    var fs = require("fs");
    var filename = req.param("filename");
    var suffix = req.param("filename").split(".")[req.param("filename").split(".").length-1];
    var newpath = path.resolve(path.resolve(process.cwd(), '../../'),"services//framework//files//logo//" +"logo."+suffix);
    var dirname = path.resolve(path.resolve(process.cwd(), '../../'),"services//framework//files//logo//");
    req.file('file').upload({
      maxBytes: 2000000,//前端已经做了1M的限制，这里比1M大就可以了
      dirname: dirname
    },function whenDone(err, uploadedFiles){
      /*
       先做上传的操作，如果上传成功，把文件名改了，---
       这个时候对file的库进行查找，---
       找到了，是修改，找不到是新建---
       新建或者是修改，应保存的信息是---
       path，文件的路径
       filename，文件名称
       foldertype，文件类型，万年不变的
       新建或者修改都应该返回一些值，要有path，这样能在上传成功后知道缩略图的显示
       */
      if(err) {
        return res.negotiate(err);
      }
      if(uploadedFiles.length === 0) {
        return res.badRequest('No file was uploaded');
      } else {
        if(uploadedFiles[0].filename == filename){
          fs.renameSync(uploadedFiles[0].fd, newpath);  // 重命名--相同名称的覆盖
        }
        Uploadfile.findOne({ //查找
          foldertype:"logo"
        }).exec(function(err,file){
          if(err){
            res.send(200,{err:err})
          }
          if(file){  //找到了就修改
            Uploadfile.update({
              foldertype:"logo"
            },{
              foldertype:"logo",
              filename:filename,
              path:newpath,
            }).exec(function(err,updatefile){
              if(err){
                res.send(200,{err:err})
              }else{
                res.send(200,{file:updatefile})
              }
            })
          } else {  //没找到就新建
            Uploadfile.create({
              filename:filename,
              foldertype : "logo",
              path:newpath,
            }).exec(function(err,createfile){
              if(err){
                res.send(200,{err:err})
              }else{
                res.send(200,{file:createfile})
              }
            });
          }
        });
      }
    });
  },

  uploadcompanyname:function(req,res){
    var companyname = req.param("companyname");
    Uploadfile.findOne({ //查找
      foldertype:"companyname"
    }).exec(function(err,result){
      if(err){
        res.send(200,{err:err})
      }
      if(!companyname){//其他地方请求的，只为得到结果
        res.send(200,{success:result});
        return;
      }
      if(result){  //找到了就修改
        Uploadfile.update({
          foldertype:"companyname"
        },{
          foldertype:"companyname",
          companyname:companyname
        }).exec(function(err,obj){
          if(err){
            res.send(200,{err:err})
          }else{
            res.send(200,{file:obj})
          }
        })
      } else {  //没找到就新建
        Uploadfile.create({
          foldertype:"companyname",
          companyname:companyname
        }).exec(function(err,obj){
          if(err){
            res.send(200,{err:err})
          }else{
            res.send(200,{file:obj})
          }
        });
      }
    });
  },
  personimageupload:function(req,res){   //人员头像文件上传的
    res.send(200,{success:"成功"})
  },
  getfile:function(req,res){
    var filename = req.param("filename")
  },
  getallfiles:function(req,res){
    Uploadfile.find().exec(function(err,files){
      if(err){
        res.send(500,{err:err})
      }else{
        res.send(200,{files:files})
      }
    })
  },
  getfiles:function(req,res){
    var foldertype = req.param("foldertype")
    var folderkey = req.param("folderkey")
    var parentid = req.param('parentid');
    var submitterid = req.param('usrid')
    var _where = {}
    if(foldertype == 'flows'){
      _where['foldertype'] = 'flows';
      _where['folderkey'] = folderkey;
      // 这是判断我自己提交的文件，仅在upandlist中有用
      if(submitterid){
        _where['submitterid'] = submitterid
      }
    }else if(foldertype == 'private'){
      _where['foldertype'] = 'private';
      // _where['folderkey'] = folderkey;
      _where['parentid'] = parentid
    }
    Uploadfile.find({
        where: _where,
        sort:'createdAt desc'
      }
    ).exec(function(err,files){
      if(err){
        res.send(500,{err:err})
      }else{
        res.send(200,{files:files})
      }
    })
  },
  delfile:function(req,res){
    var id = req.param("id")
    Uploadfile.destroy(
      {
        id:id
      }
    ).exec(function(err,files){
      if(err){
        res.send(500,{err:err})
      }else{
        res.send(200,{success:"删除成功"})
      }
    })
  },

}


