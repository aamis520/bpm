/**
 * Created by demo on 2017/8/22.
 */
module.exports = {
    createorupdataendnodecondition:function (req,res) {
        var id = req.param("id");
        var flowid = req.param("flowid");
        var condition = req.param("condition");
        Endnodeconditions.findOne({
            id:id
        }).exec(function (err,fdcondition) {
            if(err){
                res.end(200,{error:"未找到Endnodeconditions"})
            }else{
                if(fdcondition){
                    // 找到了，走更新
                    Endnodeconditions.update(
                        {id:id},
                        {
                            curflowid:flowid,
                            condition:condition
                        }
                    ).exec(function (err,upcondition) {
                        if(!upcondition){
                            res.send(200,{error:"更新Endnodeconditions失败"})
                        }else{
                            res.send(200,{id:upcondition[0].id})
                        }
                    })
                }else{
                    // 没找到，走创建
                    Endnodeconditions.create({
                        curflowid:flowid,
                        condition:condition
                    }).exec(function (err,crcondition) {
                        if(!crcondition){
                            res.send(200,{error:"创建Endnodeconditions失败"})
                        }else{
                            res.send(200,{id:crcondition.id})
                        }
                    })

                }

            }
        })
    },

    // 列出一个流程下的所有的结束节点的条件
    listendnodecondition:function (req,res) {
        var id = req.param("id");
        Endnodeconditions.findOne({
            id:id
        }).exec(function (err,conditions) {
            if(!conditions){
                res.send(200,{error:"读出endNodeConditions失败"})
            }else {
                res.send(200,{conditions:conditions})
            }
        })


    }
};
