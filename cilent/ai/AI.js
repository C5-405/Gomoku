var chessColor = {
    black: true,
    white: false
}

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

    findChessPlace(bestK, color) {
        var list = [];
        for (var i = 0; i < this.size; ++ i) {
            for (var j = 0; j < this.size; ++ j) {
                if (this.grid[i][j] === undefined) {
                    list.push({position:{x: i, y:j}, v: this.evaluate({x: i, y: j}, color)});
                }
            }
        }
        list.sort(function(a, b) {
            return b.v - a.v;
        });
        var result = [];
        for (var i = 0; i < bestK; ++ i) {
            result.push(list[i]);
        }
        return result;
    }

    /* 评估本次落子得分 */
    evaluate(position, color) {
        var v = this.board[position.x][position.y];
        for (var i = 0; i < 4; i ++){
            var s = ["", ""];
            for (var j = 0; j < 2; j ++) {
                var tmpPosition = {...position};
                while(true) {
                    if (s[j].length >= 4) break;
                    tmpPosition.x += this.next[i*2+j][0];
                    tmpPosition.y += this.next[i*2+j][1];
                    if (this.inGrid(tmpPosition)){
                        if (this.grid[tmpPosition.x][tmpPosition.y] === undefined){
                            s[j] += "_";
                        }else if (this.grid[tmpPosition.x][tmpPosition.y] == color){
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

            v += Math.max(v1, v2);
        }

        return v;
    }

    /* 该坐标是否在棋盘内 */
    inGrid(position) {
        return position.x >= 0 && position.x < this.size && position.y >= 0 && position.y < this.size;
    }

    /* 放置棋子 返回是否放置成功 */
    placeAt(position, color) {
        /* 判断坐标是否出界, 判断该坐标上是否有棋子 */
        if (this.inGrid(position) && this.grid[position.x][position.y] === undefined){
            this.grid[position.x][position.y] = color;
            return true;
        }
        return false;
    }

    /* 测试落子 */
    thinkDeeply(depth, color) {
        return this._abMax(depth, 0, color, -Infinity, Infinity).position;
    }

    // private

    /* ab剪枝 */
    _abMax(depth, value, color, alpha, beta) {
        if (depth == 0) {
            return {position:{x:0, y:0}, v: value};
        }
        var result = {position:{x:0, y:0}, v: 0};
        var list = this.findChessPlace(10, color);
        for (var i = 0; i < list.length; i ++) {
            var x = list[i].position.x;
            var y = list[i].position.y;
            var v = list[i].v;
            this.grid[x][y] = color;
            var tmp = this._abMin(depth-1, value + v, !color, alpha, beta);
            if (tmp.v > alpha){
                alpha = tmp.v;
                result = {position: {x: x, y: y}, v: alpha};
            }
            if (beta <= alpha){
                this.grid[x][y] = undefined;
                return {position: {x: x, y: y}, v: alpha};
            }
            this.grid[x][y] = undefined;
        }
        return result;
    }
    
    _abMin(depth, value, color, alpha, beta) {
        var result = {position:{x:0, y:0}, v: 0};
        var list = this.findChessPlace(10, color);
        for (var i = 0; i < list.length; i ++) {
            var x = list[i].position.x;
            var y = list[i].position.y;
            var v = list[i].v;
            this.grid[x][y] = color;
            var tmp = this._abMax(depth-1, value - v, !color, alpha, beta);
            if (tmp.v < beta){
                beta = tmp.v;
                result = {position: {x: x, y: y}, v: beta};
            }
            if (beta <= alpha){
                this.grid[x][y] = undefined;
                return {position: {x: x, y: y}, v: beta};
            }
            this.grid[x][y] = undefined;
        }
        return result;
    }
    /* 判断当前情况 */
    _analysis(str = "") {
        /* 长连 */
        if(str.indexOf("OOOOO") != -1) return 1000000;
        /* 活四 */
        if(str.indexOf("_OOOO_") != -1) return 100000;
        if(str.indexOf("O_OOO_O") != -1) return 100000;
        /* 冲四 */
        if (str.indexOf("OOO_O") != -1) return 10000;
        if (str.indexOf("_OOOOH") != -1) return 10000;
        if (str.indexOf("OO_OO") != -1) return 10000;
        /* 活三 */
        if (str.indexOf("__OOO_") != -1) return 10000;
        if (str.indexOf("_OO_O_") != -1) return 10000;
        /* 眠三 */
        if (str.indexOf("__OOOH") != -1) return 1050;
        if (str.indexOf("_O_OOH") != -1) return 1050;
        if (str.indexOf("_OO_OH") != -1) return 1050;
        if (str.indexOf("O__OO") != -1) return 1020;
        if (str.indexOf("O_O_O") != -1) return 1010;
        if (str.indexOf("H_OOO_H") != -1) return 1000;
        /* 活二 */
        if (str.indexOf("__OO__") != -1) return 105;
        if (str.indexOf("___OO_") != -1) return 105;
        if (str.indexOf("__O_O_") != -1) return 102;
        if (str.indexOf("_O__O_") != -1) return 100;
        /* 眠二 */
        if (str.indexOf("___OOH") != -1) return 11;
        if (str.indexOf("__O_OH") != -1) return 10;
        if (str.indexOf("_O__OH") != -1) return 9;
        if (str.indexOf("H_O_O_H") != -1) return 8;
        if (str.indexOf("H_OO__H") != -1) return 6;
        return 0;
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
        ai.placeAt({x: input.requests[i].x, y: input.requests[i].y}, chessColor.white);
    }
    for (var i = input.responses.length - 1; i >= 0; i--) {
        ai.placeAt({x: input.responses[i].x, y: input.responses[i].y}, chessColor.black);
    }
    var output = {
        response: ai.thinkDeeply(6, chessColor.black)
    };
    console.log(JSON.stringify(output));
});