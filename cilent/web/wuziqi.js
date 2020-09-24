
var maps = new Array(15);
for (var i = 0; i < 15; i++) {
    maps[i] = new Array(15);
    for (var j = 0; j < 15; j++) {
        maps[i][j] = 0;
    }
}

var isBlack= true;
// 初始化图片
var black = new Image();
var white = new Image();
black.src = "black.png";
white.src = "white.png";


var can;
var ctx;
// 初始化棋盘
function init() {
    can = document.getElementById("can");
    ctx = can.getContext("2d");

    ctx.strokeStyle = "#000";
    for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 15; j++) {
                ctx.strokeRect((j * 35)+1.5, i * 35, 35, 35); 
        }
    }
}

function play(e) {
    
    var leftOffset = 11;
    var x = e.clientX - leftOffset;
    var y = e.clientY - 11;
   
    var col = parseInt((e.clientX - 15) / 35) + 1;
    var row = parseInt((e.clientY - 15) / 35) + 1;

    //收到callback数据后画棋子
    if (isBlack) {
        ctx.drawImage(black, col * 35 - 15, row * 35 - 15);
        isBlack = false;
    }
    else {
        ctx.drawImage(white, col * 35 - 15, row * 35 - 15);
        isBlack = true
    }
}