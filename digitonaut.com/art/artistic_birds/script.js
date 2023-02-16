const URL  = [
	"https://coolors.co/eb300f-fe7688-fff566-212121-2eb254",
	"https://coolors.co/550527-688e26-faa613-f44708-a10702-e1d6de",
	"https://coolors.co/124e78-f0f0c9-f2bb05-d74e09-6e0e0a",
	"https://coolors.co/564787-dbcbd8-f2fdff-9ad4d6-101935"
	]
let COLS;

function setup()
{
	fullScreen();
	frameRate(0.5);
}

function draw()
{
	COLS = createCols(URL[frameCount % URL.length]);
	COLS = shuffle(COLS);
	background(COLS[4]);
	clear();
	const mult = random(0.7, 1.05);
	const u = min(width , height) * 0.15 * mult;
	const fw = u ;
	const fh = u ;
	const mw = random() > 0.5 ? u * 0.5 * random(0.8, 5) : u * 0.5 * random(0.5, 1.3);
	const mh = u *0.5* random(0.5, 1.8);
	const bw = u * 2;
	const bh = bw;
	const th = u  * 2* random(0.5, 1.5);
	const cx = width * 0.5;
	const cy = height * 0.55;
	const x = cx - (bw) / 2;
	const y = cy - (fh + bh);
	const treeLen = width * 0.6;
	
	
	noStroke();
	fill(0);
	rect(cx - treeLen * 0.5, cy, treeLen, 20);
	
	push();
	translate(x, y);
	Bird(fw, fh, mw, mh, bw, bh, th);
	pop();
}

function Bird(fw, fh, mw, mh, bw, bh, th)
{
	ellipseMode(CENTER);
	rectMode(CORNER);
	noStroke();
	
	push();
	
	//face
	const fr = min(fw, fh) / 2;
	fill(COLS[3]);
	rect(0, 0, fw, fh, fr, 0, 0, 0);
	push();
	drawingContext.clip();
	fill(COLS[4]);
	circle(fw / 2, fh, fw);
	eye(fw * 0.75, fh * 0.25, fr / 2, 0);
	pop();
	
	//mouse
	push();
	translate(fw, 0);
	
	fill(COLS[2]);
	if(mw > mh)
	{
		rect(0, 0, mw - mh + 1, mh);
		arc(mw - mh, mh, mh * 2, mh * 2, -PI /2,0 );
	}
	else arc(0, mh, mw * 2, mh * 2, -PI /2,0 );
	pop();
	
	//body
	const br = min(bw, bh);
	const brw = bw - br /2;
	const brh = bh - br /2;
	translate(0, fh);
	drawRectTile(0, 0, brw, brh);
	drawArcUnit(brw, br / 2, br, br,  -PI /2,0);
	drawArcUnit(bw - brw, brh, br,  br,  PI /2, PI);
	drawRectTile(bw - brw, br / 2, brw, brh);
	
	//tail
	const tw = bw / 2;
	let tr;
	translate(bw - tw, bh);
	
	if(tw > th)
	{
		tr = max(tw, th) * 2;
		drawArcUnit(tw, 0, tr, tr, PI /2, PI);
	}
	else{
	tr = min(tw, th) * 2;
	drawRectTile(0,  0, tw, th - tr / 2);
	drawArcUnit(tw, th - tr / 2, tr, tr, PI /2, PI);
	}
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


function drawArcUnit(cx, cy, wdia, hdia, sr, er)
{
	const cArr = shuffle(COLS);
	ellipseMode(CENTER);
	push();
	translate(cx, cy);
	noStroke();
	fill(cArr[0]);
	arc(0, 0, wdia, hdia, sr, er);
	
	push();
	drawingContext.clip();
	
	
	const rn = random();
	
	if(rn > 0.5)
	{
		for(let i = 0; i < 3; i++)
		{
			fill(cArr[i]);
			ellipse(0, 0, wdia / 3 *( 3-  i), hdia / 3 * ( 3-  i));
		}
	}
	else
	{
		const ishori = random() > 0.5 ? true : false;
		for(let i = 0; i < 6; i++)
		{
			fill(cArr[i% cArr.length] );
			if(ishori)rect(- wdia / 2, -hdia / 2 + hdia / 6 * i, wdia, hdia / 6+ 1);
			else rect(- wdia / 2 + wdia / 6 * i, -hdia / 2, wdia / 6 + 1, hdia);
		}
	}
	pop();
	pop();
}



/////////////////////////

function drawRectTile(x, y, w, h)
{
	const fn = int(random() * UNITFUNCS.length);
	UNITFUNCS[fn](x, y, w, h, shuffle(COLS));
}

/////////////////////////

const UNITFUNCS = [check,triPattern, curveRect, stripe];


function stripe(x, y, w, h, cArr)
{
	const ishori = random() > 0.5 ? true : false;
	for(let i = 0; i < 3; i++)
	{
		fill(cArr[i]);
		if(ishori)rect(x, y + h / 3 * i, w, h / 3+ 1);
		else rect(x + w / 3 * i, y, w / 3 + 1, h);
	}
}

function curveRect(x, y, w, h, cArr)
{
	const r = min(w, h) / 2;
	fill(cArr[0]);
	rect(x, y, w, h);
	push();
	drawingContext.clip();
	translate(x + int(random(2)) * w, y);
	fill(cArr[1]);
	circle(0, 0, min(w, h) * 2);
	pop();
}

function triPattern(x, y, w, h, cArr)
{
	const span = w / 5;
	noStroke();
	push();
	translate(x, y);
	fill(cArr[0]);
	rect(0, 0, w, h);
	push();
	drawingContext.clip();
	const xSpan = w / 3;
	const ySpan = h / int(random(1, 3));
	let c = 0;
	for(let y = 0; y < h; y += ySpan)
	{
		const xOff = c % 2 == 0 ? 0 : xSpan / 2 * 0;
		for(let x = 0; x < w; x += xSpan)
		{
			fill(cArr[1]);
			triangle(x + xOff, y, x + xSpan + xOff , y, x + xSpan / 2 + xOff , y + ySpan);
		}
		c++;
	}
	pop();
	pop();
}

function check(x, y, w, h, cArr)
{
	const span = w / 5;
	noStroke();
	push();
	translate(x, y);
	fill(cArr[0]);
	rect(0, 0, w, h);
	push();
	drawingContext.clip();
	
	const xSpan = w / 3;
	const ySpan = h / 3;

	let c = 0;
	for(let y = 0; y < h; y += ySpan)
	{
		const cOff = c % 2 == 0 ? 0 : 1;
		for(let x = 0; x < w; x += xSpan)
		{
			fill(cArr[0 + cOff]);
			rect(x, y, xSpan /2, ySpan );
			fill(cArr[1 - cOff]);
			rect(x + xSpan /2, y, xSpan / 2, ySpan);	
		}
		c++;
	}
	pop();
	pop();
}



////////////////////////////////////////////////////////////////////////


function createCols(url)
{
	let slaIndex = url.lastIndexOf("/");
	let colStr = url.slice(slaIndex + 1);
	let colArr = colStr.split("-");
	for(let i = 0; i < colArr.length; i++)colArr[i] = "#" + colArr[i];
	return colArr;
}
