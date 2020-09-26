var isBlack = true;
var isWin = false;
var can;
var ctx;
// 初始化棋盘
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
var black = new Image();
var white = new Image();
black.src = "black.png";
white.src = "white.png";
var ai = new AI(15);
  //下棋画子
  function xia() {
    if (isWin) {
        alert('游戏已结束');
        return;
    }
    if (ai.grid[row][col] === undefined) {
        if (isBlack) {
            ctx.drawImage(black, col * 35 - 17.5, row * 35 - 17.5);
            ai.placeAt({ x: row, y: col }, chessColor.black);
            isWin = ai.evaluate({ x: row, y: col }, chessColor.black) >= 1000000;
            if (isWin) { alert('黑棋胜'); return }
            isBlack = false;
        }
        else{
             // var position = ai.thinkDeeply(2, chessColor.white);
             ctx.drawImage(white, reposition.y* 35 - 17.5, reposition.x* 35 - 17.5);
             ai.placeAt({x:reposition.x,y:reposition.y} ,chessColor.white);
             isWin = ai.evaluate({x:reposition.x,y:reposition.y} ,chessColor.white) >= 1000000;
             if (isWin) { alert('白棋胜'); return }
             isBlack = true;
        }
    } else {
        alert('不能重复落子');
    }
}
$(document).ready(function () {
    init();
    $("#can").click(function (e) {
        // 初始化图片 

        var col = parseInt((e.offsetX + 17.5) / 35);
        var row = parseInt((e.offsetY + 17.5) / 35);
        xia();
        var row2=JSON.stringify(row);
        var col2=JSON.stringify(col);
        $.post('http://10.20.9.159:8080/test', {
            x: row2,
            y: col2
        },
            function (data, status) {
                if(status)
                {
                    var reposition = JSON.parse(data);
                    xia();
                }
                
            });


     });
});
