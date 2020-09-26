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

    $.ajax({
        url: 'http://10.20.62.236:8080/down',
        type: 'post',
        data: JSON.stringify({restart: true}),
        contentType: 'application/json',
        dataType: 'json',
        success: function (da) {
            
        }
    })
}
var black = new Image();
var white = new Image();
black.src = "black.png";
white.src = "white.png";
var ai = new AI(15);


function websockrtse() {
    if ("WebSocket" in window) {
        alert
    }
}
$(document).ready(function () {
    init();
    $("#can").click(function (e) {
        // 初始化图片 

        var col = parseInt((e.offsetX + 17.5) / 35);
        var row = parseInt((e.offsetY + 17.5) / 35);
        //下黑棋画子
        function xiahei() {
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
            } else {
                alert('不能重复落子');
            }
        }
        xiahei();
        $.ajax({
            url: 'http://10.20.62.236:8080/down',
            type: 'post',
            data: JSON.stringify({ x: row, y: col }),
            contentType: 'application/json',
            dataType: 'json',
            success: function (da) {
                if (isWin) {
                    alert('游戏已结束');
                    return;
                } 
                if (ai.grid[da.x][da.y] === undefined) {
                    if (isBlack==false) {
                        ctx.drawImage(white, da.y * 35 - 17.5, da.x * 35 - 17.5);
                        ai.placeAt({ x: da.x, y: da.y }, chessColor.white);
                        isWin = ai.evaluate({ x: da.x, y: da.y }, chessColor.white) >= 1000000;
                        if (isWin) { alert('白棋胜'); return }
                        isBlack = true;
                    }
                } else {
                    alert('不能重复落子');
                }
                
            }
        })
      


        // $.post('http://10.20.62.236:8080/down', {
        //     x:JSON.stringify({x: row}),
        //     x:JSON.stringify({y: col})
        // },
        //     function (data, status) {
        //         if(status)
        //         {
        //             var reposition = JSON.parse(data);
        //             xia();
        //         }

        //     });
    });
});
