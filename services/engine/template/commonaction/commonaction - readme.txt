
common action会对每个文件进行一次处理，针对文件中以下的部分

        A. 导入页面
        例如：<importpages pageid=""> </importpages>
        需要做几件事情
            1. 取出pageid背后对应的page的名称等。
            2. 替换这一行，将正确的page名称放入。
            3. 同时在export区，导入页面（例如 ）。

        B. 导入控件（比如button）
        例如：<mynormalbutton openpageid="" openpagepara=""> <mynormalbutton>
        需要做几件事情
            1. 找到对应的控件的vue，将其复制后生成一个新的不重名的文件。
            2. 替换这一行，将正确的控件名称放入。
            3. 同时在export区，导入控件（例如 ）。
            4. 根据setting的值，来去配置新生成的控件文件。



工作流程：

        1. 先从页面中找到导入页面标记，或component标记所在的一行。
        2. 读出对应的模板文件。
        3. 将这一行放到读出的模板文件的最上面。
        4. 用模版文件的json来处理模板文件。
        5. 删除第一行。
        6. 如果是控件的话，重命名成一个新的不重的文件名。
        7. 将新文件新入framework。
        8. 更新本文件，做组件或页面导入操作。
        9. 将本页写入framework.


注：对于页面和控件来说，导入的可能是一个id,然后经过不同的转化才能替换到相应的vue文件中，所以，需要如下的新的关键字
        :  Trannsfer.
        例如：
              "from":{
                "start":"openid=\"",
                "end":"\"",
                "Trannsfer":"PAGEIDTOROUTER"
              },
              "to":{
                "start":"this.$router.push({ path:'",
                "end":"'"
              }
              它的意思是：将from中的值，调用PAGEIDTOROUTER方法，返回结果放入to中。

              未来可能会有的方法有
                    PAGEIDTOROUTER: 将pageid 变成 路由。。。
                    SKIDTOSKKEY: 将skid转化成sk的key名。
                    。。。。。
