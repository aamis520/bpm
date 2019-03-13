/*bigPicG({
                'boxId': 'box',  //外层容器ID
                'boxWidth': 400,   //容器宽度
                'boxHeight': 400,   //容器高度
                'scal': 3,       //倍率
                'backgroundColor': '#38f', //滤镜颜色
                'opacity': 0.3,      //滤镜透明度
                'src': '1.png'   //图片路径
            })*/

function bigPicG(opt) {
    //获取最外层容器
    var box = document.getElementById(opt.boxId);
    //设置外层容器样式
    box.style.cssText = "width:" + opt.boxWidth + "px;height:" + opt.boxHeight + "px;position:relative;";
    //创建小图容器及设置其样式
    var leftBox = document.createElement('div');
    leftBox.style.cssText = "width:" + opt.boxWidth + "px;height:" + opt.boxHeight + "px;position:relative;";
    //创建滤镜及设置其样式
    var ball = document.createElement('div');
    ball.style.cssText = "width:" + (opt.boxWidth / opt.scal) + "px;height:" + (opt.boxHeight / opt.scal) + "px;background:" + opt.backgroundColor + ";opacity:" + opt.opacity +";filter:alpha(opacity:" + (opt.opacity * 100) + ");display:none;position:absolute;left:0;top:0;";
        //添加缩略图
    var leftImg = document.createElement('img');
    leftImg.src = opt.src;
    leftImg.width = opt.boxWidth;
    leftImg.height = opt.boxHeight;
    //将缩略图及滤镜元素放入左边容器中
    leftBox.appendChild(ball);
    leftBox.appendChild(leftImg);
        //创建大图容器及设置其样式
    var rightBox = document.createElement('div');
    rightBox.style.cssText = "width:" + opt.boxWidth + "px;height:" + opt.boxHeight + "px;position:absolute;left:" + (opt.boxWidth + 10) + "px;top:0;overflow:hidden;display:none;";
    //创建大图
    var rightImg = document.createElement('img');
    rightImg.src = opt.src;
    rightImg.width = opt.boxWidth * opt.scal;
    rightImg.height = opt.boxHeight * opt.scal;
    rightImg.style.cssText = 'position:absolute;left:0;top:0;';
    //将大图放入右边容器中
    rightBox.appendChild(rightImg);

    //绑定事件
    leftBox.onmousemove = function (event) {
            var e = event || window.event;
            ball.style.display = 'block';
            rightBox.style.display = 'block';
            var mouX = e.pageX - box.offsetLeft - ball.offsetWidth / 2;
            var mouY = e.pageY - box.offsetTop - ball.offsetHeight / 2;
            if (mouX < 0) {
                mouX = 0;
            } else if (mouX > leftBox.clientWidth - ball.offsetWidth) {
                mouX = leftBox.clientWidth - ball.offsetWidth
            }

            if (mouY < 0) {
                mouY = 0;
            } else if (mouY > leftBox.clientHeight - ball.offsetHeight) {
                mouY = leftBox.clientHeight - ball.offsetHeight
            }

            ball.style.left = mouX + 'px';
            ball.style.top = mouY + 'px';

            rightImg.style.left = mouX * opt.scal * (-1) + 'px';
            rightImg.style.top = mouY * opt.scal * (-1) + 'px';
            this.onmouseout = function () {
                ball.style.display = 'none';
                rightBox.style.display = 'none';
            }
        };
        //将创建好的元素放入最外层容器中
    box.appendChild(leftBox);
    box.appendChild(rightBox);

}