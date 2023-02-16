const points=[]
const n=3
let   t=0

setup=_=>{
  createCanvas(w=windowWidth,windowHeight)
  for(i=0;i<w*n;i++){
		points[i]=[createVector(random(width)-width/2,random(height)-height/2),color(0,0,0,0)]  // Create all the points
	}
  background(19) // My god this color has some deep dark feelings    Mama Mia !
}

draw=_=>{
  translate(width/2, height/2);
	
  for(let p_ of points){ // For all the points
    p=p_[0];
		c=p_[1];
		
    // Flow Field
    let n=noise(p.x*0.01,p.y*0.01)*TWO_PI
    
    // Magic      aka "Constrains The number of directions the noise value can have"
		m=8                 // M for Marvellously-Majestic-Magnificient-Modifying-Magic
		a=TWO_PI/m          // Change direction
    b=round(n/TWO_PI*m) // Round the value
    n=a*b;              // New direction
    
    // Moving the points
		p.add(cos(n)/* *10 /**/,sin(n))
    
    // Colours !
		if (n-3>1) c=lerpColor(c, color(255,0,0,t), 1);
		else if (n-2>1) c=lerpColor(c, color(0,255,0,t), 1);
    else c=lerpColor(c, color(0,0,255,t), 1)
    stroke(c)
		
		// Constrain the points' positions
		if (dist(p.x,p.y,0,0)>height/2-height/16) {
			p.x=-p.x
			p.y=-p.y
		}else point(p.x,p.y)
		
		p_=[p,c]
  }
  
  t++;
}

/*
  hey
  ily
 -Shy
*/