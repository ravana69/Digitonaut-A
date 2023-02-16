const URL  = [
	"https://coolors.co/b8b8d1-5b5f97-ffc145-00b884-ff6b6c-ff3c38-000f24",
	//"https://coolors.co/550527-688e26-faa613-f44708-a10702-e1d6de",
	"https://coolors.co/011627-f71735-41ead4-1d5ae7-fdfffc",
	"https://coolors.co/ad343e-474747-f2af29-000000-e0e0ce"
	]

let COLS ;
let BGCOL;
let Grid;
let DIV_NUM = 3;
let WID_MULT = 0.5;


function setup() {
	createCanvas(windowWidth, windowHeight);
	frameRate(20);
	//noLoop();
	
	}

function draw() {
	init();
	background(BGCOL);
	drawGrid(Grid);
}


function init()
{
	const xn = int(random(4, 6));
	const yn = int(random(4, 6));
	const segNum = int(xn * yn  * random(0.7, 1.2));
	Grid = new GridArr(xn, yn, segNum);	
	COLS = shuffle(createCols(random(URL)));
	BGCOL = COLS[0];
	COLS.shift();	
	DIV_NUM = int(random(3,5));
	WID_MULT = 0.6;

}


/////////////////////////////////////////////////////////////////////////////////////

function drawGrid(grid)
{
	const root = grid.root;
	const yn = grid.yn;
	const xn = grid.xn;
	
	const size = min(width , height) * 0.9;
	const span = floor(size / max(xn, yn));
	const wid = span * WID_MULT;
	
	push();
	translate(width / 2 - (span * xn * 0.5), height / 2 - (span * yn * 0.5));
	
	for(let i = 0; i < root.length; i++)
	{
		const cx = (root[i].x + 0.5) * span;
		const cy = (root[i].y + 0.5) * span;
		
		push();
		translate(cx, cy);
		
		const ci = root[i];
		const pi = root[max(i - 1, 0)];
		const ni = root[min(i + 1, root.length - 1)];
		
		const start = p5.Vector.lerp(pi,ci, 0.5).sub(ci);
		const sRad = atan2(-start.y, -start.x);
		const end = p5.Vector.lerp(ci, ni, 0.5).sub(ci);
		const eRad = atan2(-end.y, -end.x);
		const off = p5.Vector.sub(end , start);
		const offRad = atan2(off.y, off.x);
		const len = off.mag();
		
		noStroke();
		fill(random(COLS));
		
		if(len == 0.5){
			rectMode(CENTER);
			push();
			translate(p5.Vector.lerp(start, end, 0.5).mult(span));
			rotate(offRad);
			if(i == 0)rotate(PI);
			rect(0, 0, len * span, wid, 0, wid, wid, 0);
			if(i == root.length - 1) {
				fill(BGCOL);
				rect(len * span * 0.5 * 0.5,0, len * span * 0.5, span * 0.05);
				eye(-span * 0.2, 0, wid * 0.5, shuffle(COLS));
			}
			pop();
		}else if(len == 1)
		{
			const center = p5.Vector.lerp(start, end, 0.5).mult(span);
			customRect(0, 0, span, wid, offRad);
		}
		else{
			const radSpan = degrees((eRad - sRad));
			let angleOffet = radSpan == -90 || radSpan == 270 ? - PI / 4 * 3 : PI / 4;
			customArc(0, 0, span, (span - wid) / 2, offRad + angleOffet);
		}
		
		/*
		noFill();
		strokeWeight(1);
		stroke(0);
		rectMode(CENTER);
		rect(0, 0, span, span);
		text(i, 0, 0);
		*/
		pop();
	}
	pop();
	frameRate(0.25);
}



/////////////////////////////////////////////////////////////////////////////////////

class GridArr
{
	constructor(xn, yn, len)
	{
		this.xn = max(1, xn);
		this.yn = max(1, yn);
		this.grid = [];
		this.length = len;
		
		for(let yi = 0; yi < this.yn; yi++)
		{
			this.grid[yi] = [];
			for(let xi = 0; xi < this.xn; xi ++)this.grid[yi][xi] = 0;
		}
		
		this.root = [];
		this.cx = int(random(xn));
		this.cy = int(random(yn));
		this.px = this.cx;
		this.py = this.cy;
		
		this.grid[this.cy][this.cx]++;
		this.root.push(createVector(this.cx, this.cy));
		
		
		let count = 1;
		while(count < this.length)
		{
			this.setNext();
			count++;
		}
		
	}
	
	
	setNext()
	{
		const onGrid = this.getNextIndexArr(this.cx, this.cy);
		const isBlank = this.getNextBlankIndexArr(this.cx, this.cy);
		const next = isBlank.length == 0 ? random(onGrid) : random(isBlank);
		
		this.px = this.cx;
		this.py = this.cy;
		this.cx = next[0];
		this.cy = next[1];
		
		this.grid[this.cy][this.cx]++;
		this.root.push(createVector(this.cx, this.cy));
		if(this.root.length > this.length)this.root.shift();
	}

		
	
	//???????????????????????????
	getNextIndexArr(cx, cy)
	{
		const dir = [[1, 0], [0, 1], [-1, 0],[0, -1]];
		let onGrid = [];
		
		for(let i = 0; i < dir.length; i++)
		{
			const xi = cx + dir[i][0];
			const yi = cy + dir[i][1];
			//?????
			if(xi < 0 || xi >= this.xn || yi < 0 || yi >= this.yn)continue;
			//???????
			if(xi == this.px && yi == this.py)continue;
			onGrid.push([xi, yi]);
		}
		return onGrid;
	}
	
	//?????????????????????????????
	getNextBlankIndexArr(cx, cy)
	{
		const onGrid = this.getNextIndexArr(cx, cy);
		
		let isBlank = [];
		for( let i = 0; i < onGrid.length; i++)
		{
			const index = onGrid[i];
			const xi = index[0];
			const yi = index[1];
			if(this.grid[yi][xi] == 0)isBlank.push([xi, yi]);
		}
		return isBlank;
	}

}

////////////////////////////////////////////////////////////


function createCols(url)
{
	let slaIndex = url.lastIndexOf("/");
	let colStr = url.slice(slaIndex +1);
	let cols = colStr.split("-");
	for(let i = 0; i < cols.length; i++)cols[i] = "#" + cols[i];
	return cols;
}


function customArc(cx, cy, size, rSpan, rotation)
{
	const c = shuffle(COLS);
	const cbk = 0.55228474983;
	
	const ro = size - rSpan;
	const ri = rSpan;
	const w = ro - ri;
	
	noStroke();
	fill(c[0]);
	push();
	translate(cx, cy);
	rotate(rotation);
	translate(-size / 2, -size /2);
	beginShape();
	vertex(ro, 0);
	bezierVertex(ro, cbk * ro, cbk * ro , ro, 0, ro);
	vertex(0, ri);
	bezierVertex(ri * cbk, ri, ri, ri * cbk, ri, 0);
	endShape(CLOSE);	
	push();
	drawingContext.clip();
	
	
	const dNum = DIV_NUM;
	const rn = random();
	
	if(rn < 0.33)
	{
		const span = (size - rSpan * 2) * 2 / dNum;
		let dia = ro * 2;
		for(let i = 0; i < dNum; i++)
		{
			fill(c[i % c.length]);
			circle(0,0, dia - span * i);
		}
	}else if(rn < 0.66)
	{
		const span = PI /2 / dNum;
		let dia = ro * 2;
		for(let i = 0 ; i < dNum; i++)
		{
			fill(c[i % c.length]);
			arc(0, 0, dia, dia, i * span, (i + 1) * span);
		}
	}else
	{
		fill(c[1]);
		const span = size / dNum;
		const sizeMul = 0.8;
		for(let yi = 0; yi <= dNum; yi++)
		for(let xi = 0; xi <= dNum; xi++)
		{
			circle(xi * span, yi * span, span * sizeMul);
		}
	}
	pop();
	pop();
}


function customRect(cx, cy, size, wid, rotation)
{
	const c = shuffle(COLS);
	const dNum = DIV_NUM;
	
	rectMode(CENTER);
	noStroke();
	fill(c[0]);
	
	push();
	translate(cx, cy);
	rotate(rotation);
	rect(0, 0, size, wid);
	
	push();
	drawingContext.clip();
	translate(-size / 2, -size / 2);
	
	const rn = random();
	if(rn < 0.33)
	{
		const span = size / dNum;
		rectMode(CORNER);
		for(let i = 0; i < dNum; i++)
		{
			if(rn < 0.15){
				fill(c[i % c.length]);
				rect(i * span, 0, span, size);
			}
			else{
				fill(c[1]);
				triangle(i * span, (size - wid) / 2, (i + 1) * span, (size - wid) / 2, i * span, size - (size - wid) / 2);
			}
		}
		rectMode(CENTER);
	}
	else if(rn < 0.66)
	{
		const span = wid / dNum;
		rectMode(CORNER);
		for(let i = 0; i < dNum; i++)
		{
			fill(c[i % c.length]);
			rect(0, i * span + (size - wid) / 2, size, span);
		}
		rectMode(CENTER);
	}
	else
	{
		fill(c[1]);
		const span = size / dNum;
		const sizeMul = 0.8;
		for(let yi = 0; yi <= dNum; yi++)
			for(let xi = 0; xi <= dNum; xi++)
				circle(xi * span, yi * span, span * sizeMul);
	}
	pop();
	pop();

}


function eye(cx, cy, dia, c)
{
	push();
	translate(cx, cy);
	fill(255);
	circle(0, 0, dia);
	fill(random(COLS));
	circle(0, 0, dia *0.8);
	fill(0);
	circle(0, 0, dia *0.5);
	pop();
}