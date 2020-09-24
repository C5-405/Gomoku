class AI {
	// public
	/* 构造函数 */
	constructor(size) {
		/* 记录棋盘大小 */
		this.size = size;
		/* 给棋盘存储开内存 */
		this.grid = this._createGrid(size);
	}

	/* 该坐标是否在棋盘内 */
	inGrid(x, y) {
		return x >= 0 && x < this.size && y >= 0 && y < this.size;
	}

	/* 放置棋子 返回是否放置成功 */
	placeAt(x, y) {
		/* 判断坐标是否出界, 判断该坐标上是否有棋子 */
		if (this.inGrid(x, y) && this.grid[x][y] == undefined){
			this.grid[x][y] = 1;
			return true;
		}
		return false;
	}

	// private
	/* 给棋盘存储开内存 */
	_createGrid(size) {
		var grid = new Array(size);
		for (var i = 0; i < grid.size; ++i) {
			grid = new Array(size);
		}
		return grid;
	}
}

var randomAvailablePosition = function() {
	var result = [];
	for (var i = 0; i < SIZE; i++) {
		for (var j = 0; j < SIZE; j++) {
			if (Grid[i][j] === undefined) {
				result.push({ x: i, y: j });
			}
		}
	}
	return result[Math.floor(Math.random()*result.length)];
};

process.stdin.resume();
process.stdin.setEncoding('utf8');
var fullInput = "";
process.stdin.on('data', function(chunk) {
	fullInput += chunk;
});
process.stdin.on('end', function() { 
	// 解析读入的JSON
	var input = JSON.parse(fullInput);
	var output;
	for (var i = input.requests.length - 1; i >= 0; i--) {
		placeAt(input.requests[i].x, input.requests[i].y);
	}
	for (i = input.responses.length - 1; i >= 0; i--) {
		placeAt(input.responses[i].x, input.responses[i].y);
	}
	output = {
		response: randomAvailablePosition()
	};
	console.log(JSON.stringify(output));
});