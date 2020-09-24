class AI {
    // public
    /* 构造函数 */
    constructor(size) {
        /* 记录棋盘大小 */
        this.size = size;
        /* 给棋盘存储开内存 */
        this.grid = this._createGrid(size);
        /* 棋盘位置棋子分数 */
        this.board = [
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0 ],
            [ 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 0 ],
            [ 0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0 ],
            [ 0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 4, 3, 2, 1, 0 ],
            [ 0, 1, 2, 3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 1, 0 ],
            [ 0, 1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1, 0 ],
            [ 0, 1, 2, 3, 4, 5, 6, 6, 6, 5, 4, 3, 2, 1, 0 ],
            [ 0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 4, 3, 2, 1, 0 ],
            [ 0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 3, 2, 1, 0 ],
            [ 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2, 1, 0 ],
            [ 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0 ],
            [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0 ],
            [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ]
        ];
        this.next = [ [1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1],[1,-1],[-1,1] ];

    }

    /* 评估本次落子得分 */
    evaluate(position, color) {
        var situation = [0, 0, 0, 0, 0, 0, 0, 0];
        var v = this.board[position.x][position.y];
        for (var i = 0; i < 4; i ++){
            var s = ["", ""];
            for (var j = 0; j < 2; j ++) {
                var tx = position.x;
                var ty = position.y;
                while(true) {
                    if (s[j].length >= 4) break;
                    tx += this.next[i*2+j][0];
                    ty += this.next[i*2+j][1];
                    if (this.inGrid(tx, ty)){
                        if (this.grid[tx][ty] === undefined){
                            s[j] += "_";
                        }else if (this.grid[tx][ty] == color){
                            s[j] += "O";
                        }else{
                            s[j] += "H";
                        }
                    }else{
                        s[j] += "H";
                        break;
                    }
                }
            }
            var result = this._stringReverse(s[0]) + "O" + s[1];
            var v1 = this._analysis(result);
            var v2 = this._analysis(this._stringReverse(result));
            ++ situation[Math.min(v1, v2)];
        }

        v += situation[0] * 10000000;
        v += situation[1] * 1000000;
        v += situation[2] * 100000;
        v += situation[3] * 10000;
        v += situation[4] * 1000;
        v += situation[5] * 100;
        v += situation[6] * 10;

        return v;
    }

    /* 读取棋盘数据 0为黑 1为白 */
    gridRead(grid) {
        this.size = grid.length;
        this.grid = grid;
    }

    /* 该坐标是否在棋盘内 */
    inGrid(x, y) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    /* 放置棋子 返回是否放置成功 */
    placeAt(x, y, color) {
        /* 判断坐标是否出界, 判断该坐标上是否有棋子 */
        if (this.inGrid(x, y) && this.grid[x][y] === undefined){
            this.grid[x][y] = color;
            return true;
        }
        return false;
    }

    /* 测试落子 */
    randomAvailablePosition() {
        var result = {x: 0, y: 0};
        var v = -100000000;
        for (var i = 0; i < this.size; i++) {
            for (var j = 0; j < this.size; j++) {
                if (this.grid[i][j] === undefined) {
                    var tmp = this.evaluate({x: i, y: j}, 0);
                    if (tmp > v){
                        result = {x: i, y: j};
                        v = tmp;
                    }
                }
            }
        }
        return result;
    }

    // private
    /* 判断当前情况 */
    _analysis(str = "") {
        /* 长连 */
        if(str.indexOf("OOOOO") != -1) return 0;
        /* 活四 */
        if(str.indexOf("_OOOO_") != -1) return 1;
        if(str.indexOf("O_OOO_O") != -1) return 1;
        /* 冲四 */
        if (str.indexOf("OOO_O") != -1) return 2;
        if (str.indexOf("_OOOOH") != -1) return 2;
        if (str.indexOf("OO_OO") != -1) return 2;
        /* 活三 */
        if (str.indexOf("__OOO_") != -1) return 3;
        if (str.indexOf("_OO_O_") != -1) return 3;
        /* 眠三 */
        if (str.indexOf("__OOOH") != -1) return 4;
        if (str.indexOf("_O_OOH") != -1) return 4;
        if (str.indexOf("_OO_OH") != -1) return 4;
        if (str.indexOf("O__OO") != -1) return 4;
        if (str.indexOf("O_O_O") != -1) return 4;
        if (str.indexOf("H_OOO_H") != -1) return 4;
        /* 活二 */
        if (str.indexOf("__OO__") != -1) return 5;
        if (str.indexOf("__O_O_") != -1) return 5;
        if (str.indexOf("_O__O_") != -1) return 5;
        if (str.indexOf("___OO_") != -1) return 5;
        /* 眠二 */
        if (str.indexOf("___OOH") != -1) return 6;
        if (str.indexOf("__O_OH") != -1) return 6;
        if (str.indexOf("_O__OH") != -1) return 6;
        if (str.indexOf("H_O_O_H") != -1) return 6;
        if (str.indexOf("H_OO__H") != -1) return 6;
        return 7;
    }

    _stringReverse(str) {
        var newStr = "";
        for (var i = str.length - 1; i >= 0; -- i){
            newStr += str[i];
        }
        return newStr;
    }

    /* 给棋盘存储开内存 */
    _createGrid(size) {
        var grid = new Array(size);
        for (var i = 0; i < size; ++ i) {
            grid[i] = new Array(size);
        }
        return grid;
    }
}

var ai = new AI(15);

process.stdin.resume();
process.stdin.setEncoding('utf8');
var fullInput = "";
process.stdin.on('data', function(chunk) {
    fullInput += chunk;
});
process.stdin.on('end', function() { 
    var input = JSON.parse(fullInput);
    for (var i = input.requests.length - 1; i >= 0; i--) {
        ai.placeAt(input.requests[i].x, input.requests[i].y, 1);
    }
    for (var i = input.responses.length - 1; i >= 0; i--) {
        ai.placeAt(input.responses[i].x, input.responses[i].y, 0);
    }
    var output = {
        response: ai.randomAvailablePosition()
    };
    console.log(JSON.stringify(output));
});