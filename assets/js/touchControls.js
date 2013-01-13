/*
 * This script is derived from http://seb.ly/demos/JSTouchController/TouchControl.html by Seb Lee-Delisle (see http://seb.ly/)
 *
 * Note that there is no copyright information posted regarding the code by Seb Lee-Delisle or statement as to terms of use.
 *
 * Have emailed Seb to get a comment on the terms of use, currently awaiting a reply (emailed 13 Jan 2013).
 *
 */


TouchControls = function(options) {
    options = options || {};
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.touchable = 'createTouch' in document,
    this.touches = []; 

    this.canvas;
    this.c; // c is the canvas' context 2D
    this.container;
    this.halfWidth;
    this.halfHeight;
        
    this.leftTouchID = -1;
    this.leftTouchPos = new Vector2(0,0);
    this.leftTouchStartPos = new Vector2(0,0);
    this.leftVector = new Vector2(0,0);
    
    this.rightTouchID = -1;
    this.rightTouchPos = new Vector2(0,0);
    this.rightTouchStartPos = new Vector2(0,0);
    this.rightVector = new Vector2(0,0);

}

TouchControls.prototype.initialise = function() {
    this.setupCanvas();
    
    setInterval(this.drawCanvas.bind(this), 1000/35);
    
    if(this.touchable) {
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);
        
        window.onorientationchange = this.resetCanvas;  
        window.onresize = this.resetCanvas;  
    } else {
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }
}

TouchControls.prototype.resetCanvas = function(e) {  
 	// resize the canvas - but remember - this clears the canvas too. 
  	this.canvas.width = window.innerWidth; 
	this.canvas.height = window.innerHeight;
	
	this.halfWidth = this.canvas.width / 2; 
	this.halfHeight = this.canvas.height / 2;
	
	//make sure we scroll to the top left. 
	window.scrollTo(0,0); 
}

TouchControls.prototype.drawCanvas = function(self) {
  
	this.c.clearRect(0, 0, this.canvas.width, this.canvas.height); 

	if(this.touchable) {
	
		for(var i = 0; i < this.touches.length; i++) {
			
			var touch = this.touches[i]; 
			
			if(touch.identifier == this.leftTouchID) {
                this.drawTouch(touch, this.leftTouchStartPos, this.leftTouchPos, this.leftVector);
			} else
			
            if(touch.identifier == this.rightTouchID) {
                this.drawTouch(touch, this.rightTouchStartPos, this.rightTouchPos, this.rightVector);
            } else {
				/*
                // show the co-ords
				c.beginPath(); 
				c.fillStyle = "white";
				c.fillText("touch id : "+touch.identifier+" x:"+touch.clientX+" y:"+touch.clientY, touch.clientX+30, touch.clientY-30);
				*/
/*
				c.beginPath(); 
				c.strokeStyle = "red";
				c.lineWidth = "6";
				c.arc(touch.clientX, touch.clientY, 40, 0, Math.PI*2, true); 
				c.stroke();
				*/
			}
		}
	} else {
        // we're are mouse, so just show the co-ords
		this.c.fillStyle	 = "white"; 
		this.c.fillText("mouse : " + this.mouseX + ", " + this.mouseY, this.mouseX, this.mouseY);
	}
	//c.fillText("hello", 0,0); 
	
}

TouchControls.prototype.drawTouch = function(touch, touchStartPosition, touchPosition, vector) {
    this.c.beginPath(); 
    this.c.strokeStyle = "cyan"; 
    this.c.lineWidth = 6; 
    this.c.arc(touchStartPosition.x, touchStartPosition.y, 40, 0, Math.PI * 2, true); 
    this.c.stroke();
    
    // outside thin circle for start touch positiohn
    this.c.beginPath(); 
    this.c.strokeStyle = "cyan"; 
    this.c.lineWidth = 2; 
    this.c.arc(touchStartPosition.x, touchStartPosition.y, 60, 0, Math.PI * 2, true); 
    this.c.stroke();
    
    // touch position circle for the current location of the touch
    this.c.beginPath(); 
    this.c.strokeStyle = "cyan"; 
    this.c.arc(touchPosition.x, touchPosition.y, 40, 0, Math.PI * 2, true); 
    this.c.stroke();
    
    this.c.beginPath(); 
    this.c.fillStyle = "red";
    this.c.fillText("touch id : " +
        touch.identifier +
        " x:" + touchPosition.x +
        " y:" + touchPosition.y +
        " distance x: " + vector.x +
        " y: " + vector.y,
        touch.clientX + 30, touch.clientY - 30);
    
}

/*	
 *	Touch event (e) properties : 
 *	e.touches: 			Array of touch objects for every finger currently touching the screen
 *	e.targetTouches: 	Array of touch objects for every finger touching the screen that
 *						originally touched down on the DOM object the transmitted the event.
 *	e.changedTouches	Array of touch objects for touches that are changed for this event. 					
 *						I'm not sure if this would ever be a list of more than one, but would 
 *						be bad to assume. 
 *
 *	Touch objects : 
 *
 *	identifier: An identifying number, unique to each touch event
 *	target: DOM object that broadcast the event
 *	clientX: X coordinate of touch relative to the viewport (excludes scroll offset)
 *	clientY: Y coordinate of touch relative to the viewport (excludes scroll offset)
 *	screenX: Relative to the screen
 *	screenY: Relative to the screen
 *	pageX: Relative to the full page (includes scrolling)
 *	pageY: Relative to the full page (includes scrolling)
 */	

TouchControls.prototype.onTouchStart = function(e) {

    for(var i = 0; i < e.changedTouches.length; i++){
        var touch = e.changedTouches[i]; 
        
        // if we have no touch id for the left and the touch is on the left hand side then we have our first touch for left
        if((this.leftTouchID < 0) && (touch.clientX < this.halfWidth)) {
            this.leftTouchID = touch.identifier; 
            this.leftTouchStartPos.reset(touch.clientX, touch.clientY); 	
            this.leftTouchPos.copyFrom(this.leftTouchStartPos); 
            this.leftVector.reset(0,0);
            // continue;
        }
        if((this.rightTouchID < 0) && (touch.clientX >= this.halfWidth)) {
            this.rightTouchID = touch.identifier; 
            this.rightTouchStartPos.reset(touch.clientX, touch.clientY); 	
            this.rightTouchPos.copyFrom(this.rightTouchStartPos); 
            this.rightVector.reset(0,0); 
        } else {
            // we have a touch but it is another type...
        }	
    }
    this.touches = e.touches; 
}
 
TouchControls.prototype.onTouchMove = function(e) {
	 // Prevent the browser from doing its default thing (scroll, zoom)
	e.preventDefault();
	
	for(var i = 0; i < e.changedTouches.length; i++){
		var touch = e.changedTouches[i];

		if(this.rightTouchID == touch.identifier) {
			this.rightTouchPos.reset(touch.clientX, touch.clientY); 
			this.rightVector.copyFrom(this.rightTouchPos); 
			this.rightVector.minusEq(this.rightTouchStartPos); 	
		}
        
		if(this.leftTouchID == touch.identifier) {
			this.leftTouchPos.reset(touch.clientX, touch.clientY); 
			this.leftVector.copyFrom(this.leftTouchPos); 
			this.leftVector.minusEq(this.leftTouchStartPos); 	
		}
	}
	
	this.touches = e.touches; 
	
} 
 
TouchControls.prototype.onTouchEnd = function(e) { 
   	this.touches = e.touches; 

	for(var i = 0; i < e.changedTouches.length; i++){
		var touch = e.changedTouches[i];
        
		if(this.leftTouchID == touch.identifier) {
			this.leftTouchID = -1; 
			this.leftVector.reset(0,0); 
		} else if(this.rightTouchID == touch.identifier) {
			this.rightTouchID = -1; 
			this.rightVector.reset(0,0); 
		}
	}
   
}

TouchControls.prototype.onMouseMove = function(event) {
	this.mouseX = event.offsetX;
	this.mouseY = event.offsetY;
}

TouchControls.prototype.setupCanvas = function() {
	this.canvas = document.createElement('canvas');
	this.c = this.canvas.getContext('2d');
    
	this.container = document.createElement('div');
	this.container.className = "container";

	document.body.appendChild(this.container);
	this.container.appendChild(this.canvas);	

	this.resetCanvas(); 
	
	this.c.strokeStyle = "#ffffff";
	this.c.lineWidth = 2;	
}
