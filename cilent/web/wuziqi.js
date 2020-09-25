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

$(document).ready(function () {
    init();
    $("#can").click(function (e) {
        // 初始化图片 
      
        var col = parseInt((e.clientX) / 35);
        var row = parseInt((e.clientY) / 35);
        //下棋画子
        function xia() {
            if (isWin) {
                alert('游戏已结束');
                return;
            }
            if (ai.grid[row][col] === undefined) {
                if (isBlack) {
                    ctx.drawImage(black, col * 35 - 17.5, row * 35 - 17.5);
                    ai.placeAt({x: row, y: col}, chessColor.black);
                    isWin = ai.evaluate({x: row, y: col}, chessColor.black) >= 1000000;
                    if (isWin) alert('黑棋胜');
                    isBlack = false;
                    var position = ai.thinkDeeply(2, chessColor.white);
                    ctx.drawImage(white, position.y * 35 - 17.5, position.x * 35 - 17.5);
                    ai.placeAt(position, chessColor.white);
                    isWin = ai.evaluate(position, chessColor.white) >= 1000000;
                    if (isWin) alert('白棋胜');
                    isBlack = true;
                }
            } else {
                alert('不能重复落子');
            }
        }
        xia();
        // $.post('http://10.20.9.159:8080/test', {
        //     x: row,
        //     y: col
        // },
        //     function (data, status) {
        //         alert("数据: \n" + data + "\n状态: " + status);
        //     }
        // );
    });
});
    // function play(e) {

    //     var col = parseInt((e.clientX - 15) / 35) + 1;
    //     var row = parseInt((e.clientY - 15) / 35) + 1;

    //     //收到callback数据后画棋子
    //     if (isBlack) {
    //         ctx.drawImage(black, col * 35 - 15, row * 35 - 15);
    //         isBlack = false;
    //     }
    //     else {
    //         ctx.drawImage(white, col * 35 - 15, row * 35 - 15);
    //         isBlack = true
    //     }
// }