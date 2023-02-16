var colors = "eee-ea3737-233d4d-fe7f2d-fcca46-a1c181-619b8a".split("-").map(a=>"#"+a)

function easeOutElastic(x) {
const c4 = (2 * Math.PI) / 3;

return x === 0
  ? 0
  : x === 1
  ? 1
  : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
}

function easeOutExpo(x) {
return x === 1 ? 1 : 1 - pow(2, -10 * x);
}

class Fish{
	constructor(args){
		this.p = args.p || createVector(0,0)
		this.v = args.v || createVector(0,0)
		this.a = args.a || createVector(0,0)
		this.r = args.r || 50
		this.id = random(100)
		this.rotFreq = random(30,50)
		this.color1 = args.color1 || random(colors)
		this.color2 = args.color2 || random(colors)
		this.targetR = this.r 
		this.originalR = this.r 

		this.activeRatio = 1
		this.collideTs = 0
		this.targetActiveRatio = 0
		this.lerpSpeed = 0.01
		this.ts=0
		this.colliding=false
		this.lastColliding=false
	}
	draw(){
		
		drawingContext.shadowColor = color(0,80)
		// drawingContext.shadowOffsetX = 5
		drawingContext.shadowOffsetY = 5
		drawingContext.shadowOffsetY = 5
		push()
			translate(this.p)
			rotate( sin(this.id+frameCount/this.rotFreq)/10)
			scale(1,0.95)
			if (this.v.x>0){
				scale(-1,1)
			}
			noStroke()
			//spikes
		
			push()
			fill(255)
			rotate(-this.activeRatio*PI/10 + sin(this.id+frameCount/this.rotFreq))

			for(var i=0;i<20;i++){
				rotate(PI/10)
				let spikeAnimationRatio= map(this.activeRatio-i/20,0,2,0,1,true)
				triangle(this.activeRatio*this.r,-4,
								 easeOutExpo(spikeAnimationRatio)*(this.r)*2,0,
								 this.activeRatio*this.r,4)
			}
			pop()
		
			push()
			//body
				fill(this.color1)
				arc(0,0,this.r*2,this.r*2,0,PI,CHORD)
				fill(this.color2)
				arc(0,0,this.r*2,this.r*2,PI,2*PI,CHORD)
				fill(this.color1)
				arc(0,-1,this.r/3,this.r/3,0,PI,CHORD)
				stroke(255,100)
				strokeWeight(2)
		drawingContext.shadowColor = color(0,0)
				for(var i=0;i<this.r;i+=this.r/3){
					for(var o=0;o<3;o++){
						stroke(255)
						push()
						translate(5+i+(o%2==0?-this.r/6:0),-o*this.r/3)
							line(0,0,this.r/8,-this.r/8)
							line(0,0,this.r/8,this.r/8)
						pop()
					}
				}
			pop()
		
			//eye
			let openEye = this.activeRatio>0.5?1:0
			let eyeR = sqrt(this.r)*6/(2-openEye/8)+5
			fill(255)
			arc(-this.r*0.4,-this.r*0.4,
					eyeR,eyeR,0,PI+openEye*PI)
				drawingContext.shadowColor = color(0,0)
			
			fill(0)
			arc(-this.r*0.4,-this.r*0.4,
					eyeR/2,eyeR/2,0,PI+openEye*PI)
			
		
			//fin
			push()
				fill(255)
				rotate(sin(frameCount/8)/2 )
				triangle(0,0,
								 this.r/1.8,-this.r/2.4,
								 this.r/1.8,this.r/2.4)
			pop()
		
			
			//tail
			push()
				translate(this.r*0.95,0)
				fill(this.color1)
				rotate(sin(frameCount/4)/2 )
				triangle( 0,0,
								 this.r/3,-this.r/3,
								 this.r/3,this.r/3)
			pop()
		
		pop()
	}
	update(){
		this.p.add(this.v)
		this.v.add(this.a)
		this.v.mult(0.97)
		this.v.x+=noise(this.p.x/10)/10
		this.v.y+=cos(this.p.x/10+1000+this.id+frameCount/100)/10
		this.a.mult(0.95)
		this.activeRatio = lerp(this.activeRatio,this.targetActiveRatio,this.lerpSpeed )
		this.r = lerp(this.r,this.targetR,0.05)
		this.lastColliding = this.colliding

		if (dist(mouseX,mouseY,this.p.x,this.p.y)<this.r || this.colliding){
			this.targetActiveRatio=1
			this.lerpSpeed =0.2
			this.targetR = this.originalR*1.5
			this.ts =frameCount
			this.a.x =(noise(this.id+frameCount/10,this.p.x/10,this.p.y/10)-0.5)
			this.a.y =(noise(this.id+50000+frameCount/10,this.p.x/10,this.p.y/10)-0.5)
		}else{
			this.targetActiveRatio=0
			this.targetR = this.originalR*1
			this.lerpSpeed =0.1
		}
		
		if (this.p.x>width+25){
			this.p.x = -20
		}
		
		if (this.p.x<-20){
			this.p.x = width+25
		}
		
		if (this.p.y>height+25){
			this.p.y = -20
		}
		
		if (this.p.y<-20){
			this.p.y = height+25
		}
		// if (this.colliding){

		// }
	}
}

let fishArray = []
let bubbles = []

function preload(){
}

let overAllTexture
function setup() {
	createCanvas(windowWidth, windowHeight);
	background(100);
	for(var i=0;i<25;i++){
		let c = random(colors)
		let c2 = random(colors.filter(a=>a!=c))
		let f = new Fish({
			p: createVector(random(width),random(height)),
			v: p5.Vector.random2D(),
			r: random(15,55),
			color1: c,
			color2: c2,
			color3: random(colors),
			color4: random(colors)
		})
		fishArray.push(f)
	}
	
	overAllTexture=createGraphics(width,height)
	overAllTexture.loadPixels()
	// noStroke()
	for(var i=0;i<width+50;i++){
		for(var o=0;o<height+50;o++){
			overAllTexture.set(i,o,color(100,noise(i/3,o/3,i*o/50)*random([0,30,60])))
		}
	}
	overAllTexture.updatePixels()
}

function draw() {
	fill(0)
	rect(0,0,width,height)
	
	let stColor =color(59, 138, 221)
	let edColor =color(12, 28, 59)
	for(var o=-1;o<10;o++){
		noStroke()
		let midColor = lerpColor(stColor,edColor,o/10)
				
		push()
			translate(0,o*height/10)
			fill(midColor)
			beginShape()
			vertex(0,150)
			for(var i=0;i<width;i+=2){
				vertex(i,sin(i/(30+noise(o,frameCount/100)*100)+o+cos(o+frameCount/10))*30)
			}
			vertex(width,150)
			endShape(CLOSE)
		pop()

	}
	fishArray.forEach(fish=>{
		fish.update()
		fish.draw()
		fish.colliding=false
			
		if (random()<0.03){
			bubbles.push({
				p: fish.p.copy(),
				v: createVector(0,random(-0.5,-5)),
				r: random(1,15),
				opacity: random(0.1,200)
			})
		}
	})
	
	drawingContext.shadowColor = color(0,0)
	bubbles.forEach(b=>{
		fill(255,b.opacity)
		ellipse(b.p.x + noise(b.p.y/20)*b.r*2,b.p.y,b.r)
		b.p.y+=b.v.y
	})
	bubbles = bubbles.filter(b=>b.p.y>-10)
	
	fishArray.forEach(fish=>{
		fishArray.forEach(fish2=>{
			if (fish!==fish2){
				if (fish.p.dist(fish2.p)<(fish.r+fish2.r)/1){
					
					fish.colliding=true
					fish2.colliding=true
					
				}
				
				if (fish.p.dist(fish2.p)<(fish.r+fish2.r)/1.5){
				
					let delta = fish2.p.copy().sub(fish.p)
					fish.v.sub(delta.mult(0.2).setMag(2))
					fish2.v.add(delta.mult(0.2).setMag(2))
				}
			}

		})
	})
	push()
		blendMode(MULTIPLY)
		image(overAllTexture,0,0)
	pop()
	// ellipse(mouseX, mouseY, 20, 20);
}





