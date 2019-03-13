<script type="text/javascript">

export default
{
	  loginapi:'http://localhost:1337/login/login',
    submitdataapi:'http://localhost:1337/flow/submitdata',
    querybysk:'http://localhost:1337/flow/querybysk',

    createflow:'http://localhost:1440/flow/createflow',
    getflow:'http://localhost:1440/flow/getflow',
    // 列出所有流程
    listflow:'http://localhost:1440/flow/listflow',
    // 只列出主流程
    listmainflowapi:'http://localhost:1440/flow/listmainflow',
    listcksapi:'http://localhost:1440/keywords/listcks',

    // 修改流程的name和描述
    reeditflownameanddescapi:'http://localhost:1440/flow/reeditflownameanddesc',
    // 创建或者更新flow中的condition
    createorupdateconditionapi:'http://localhost:1440/flowconditions/updateorcreateconditions',
    // 创建或者更新flow中结束节点的条件
    createorupdataendnodeconditionapi:'http://localhost:1440/endnodeconditions/createorupdataendnodecondition',
    // 列出一个flow中所有的结束节点的设置条件
    listendnodeconditionapi:'http://localhost:1440/endnodeconditions/listendnodecondition',
    //列出一个flow中的condition
    listconditionsapi:'http://localhost:1440/flowconditions/listconditions',
    //创建或更新flow中的autocheckcondition
    createorupdateautocheckconditionapi:'http://localhost:1440/autocheckconditions/updateorcreateautocheckconditions',
    //列出一个flow中的autocheckconditions
    listautocheckconditionsapi:'http://localhost:1440/autocheckconditions/listautocheckconditions',
    updateflow:'http://localhost:1440/flow/updateflow',
    listusers:'http://localhost:1440/users/listusers',
    getallpagesapi:'http://localhost:1440/page/getall',
    getonepageapi:'http://localhost:1440/page/getone',
    getpagesapi:'http://localhost:1440/page/getpages',
    createpageapi:'http://localhost:1440/page/createpage',
    loadpageapi:'http://localhost:1440/page/loadpage',
    updatepageapi:'http://localhost:1440/page/updatepage',
    delpageapi:'http://localhost:1440/page/deletepage',
    updateframeapi:'http://localhost:1440/template/pageupdate',
    gettemplatesapi:'http://localhost:1440/template/getall',
    gettemplateuiapi:'http://localhost:1440/template/getui',
    setdefaultpageapi:'http://localhost:1440/flow/setdefaultpage',
    getdefaultpageapi:'http://localhost:1440/flow/getdefaultpage',

		getallsksapi:'http://localhost:1440/keywords/getallsks',

    getsksapi:'http://localhost:1440/keywords/getsks',
    listsksapi:'http://localhost:1440/keywords/listsks',
    getckapi:'http://localhost:1440/keywords/getck',
    updateckapi:'http://localhost:1440/keywords/updateck',
    listcksapi:'http://localhost:1440/keywords/listcks',
    deletepagesksapi:'http://localhost:1440/keywords/deletepagesks',//删除子页面（page）下简单关键字（sk）的接口
    //TODO,这个8080端口怎么来的？
    //这里的8080用的vue的端口
    flowdesigniframesrc:'http://localhost:8080/static/flowDesign/flowDesign.html',

    // 这几项是在flow中使用，需要在engine的config中加上
    //岗位展示api
      listjobpositionapi:'http://localhost:1337/jobposition/listjobposition',
    //人员展示api
      listpersonapi:'http://localhost:1337/person/listperson',
    //部门展示api
      listdepartmentapi:'http://localhost:1337/department/listdepartment',

    //保存流程中消息的条件
    updateorcreatemessageconditionapi:'http://localhost:1440/messageconditions/createorupdate',
    // 取一个流程中保存的消息的条件
    listmessageconditionsapi:'http://localhost:1440/messageconditions/listmessagecondition',

    listmessageforcardapi:'http://localhost:1337/message/messagequeryforpc',

    listmessageformessagelistapi:'http://localhost:1337/message/messagequerybycount',
    
    //智能提交表单存库
    createautoformsetapi:'http://localhost:1440/autoformset/create',
    getautoformsetapi:'http://localhost:1440/autoformset/get',
    deleteautoformsetapi:'http://localhost:1440/autoformset/delete',
}

</script>
