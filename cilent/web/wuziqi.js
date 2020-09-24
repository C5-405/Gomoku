var isWin = false;
var isBlack = true;
var whiteWin = 0;
var blackWin = 0;
var maps = new Array(15);
for (var i = 0; i < 15; i++) {
    maps[i] = new Array(15);
    for (var j = 0; j < 15; j++) {
        maps[i][j] = 0;
    }
}
$(document).ready(function () {
    // 初始化棋盘
    var can;
    var ctx;
    function init() {
        can = document.getElementById("can");
        ctx = can.getContext("2d");
        ctx.strokeStyle = "#000";
        for (var i = 0; i < 15; i++) {
            for (var j = 0; j < 15; j++) {
                ctx.strokeRect((j * 35) + 1.5, i * 35, 35, 35);
            }
        }
    }
    init();
   
    // 初始化图片
    var black = new Image();
    var white = new Image();
    black.src = "black.png";
    white.src = "white.png";



    $("#can").click(function (e) {
        var x = e.clientX;
        var y = e.clientY;
        var col = parseInt((e.clientX) / 35);
        var row = parseInt((e.clientY) / 35);
        //判断输赢
        //   function toWin() {
           
              
        //   }
        //下棋画子
        function xia() {
            if (isWin) {
                alert('游戏已经结束!');
                return;
            }
            if (maps[row][col] == 0) {
                if (isBlack) {
                    ctx.drawImage(black, col * 35 - 17.5, row * 35 - 17.5);
                    isBlack = false;
                    maps[row][col] = 1;
                }
                else {
                    ctx.drawImage(white, col * 35 - 17.5, row * 35 - 17.5);
                    isBlack = true;
                    maps[row][col] = 2;
                }
            } else {
                alert('不能重复落子！');
                return;
            }

        }
        xia();
        $.post('http://10.22.73.189:8080/test',
            {
                x: row,
                y: col
            },
            function (data, status) {

                alert("数据：" + data + "\n状态：" + status);
            });
    });
});
