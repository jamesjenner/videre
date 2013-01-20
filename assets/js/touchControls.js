/*
 * This script is derived from http://seb.ly/demos/JSTouchController/TouchControl.html by Seb Lee-Delisle (see http://seb.ly/)
 *
 * Note that there is no copyright information posted regarding the code by Seb Lee-Delisle or statement as to terms of use.
 *
 * Have emailed Seb to get a comment on the terms of use, currently awaiting a reply (emailed 13 Jan 2013).
 *
 * Email received from Seb on the 14th of Jan confirming that it's okay for me to use the code, he requested that credit be given.
 *
 */

// TODO: add support for buttons, maybe regions for each...

TouchControls = function(options) {
    options = options || {};

    if(options.canvas == null) {
	return;
    }
    
    this.canvas = options.canvas;
    
    this.debug = ((options.debug != null) ? options.debug : false);
    
    this.leftEnabled = ((options.leftEnabled != null) ? options.leftEnabled : true);
    this.rightEnabled = ((options.rightEnabled != null) ? options.rightEnabled : true);

    this.leftYEnabled = ((options.leftYEnabled != null) ? options.leftYEnabled : true);
    this.leftXEnabled = ((options.leftXEnabled != null) ? options.leftXEnabled : true);
    
    this.rightYEnabled = ((options.rightYEnabled != null) ? options.rightYEnabled : true);
    this.rightXEnabled = ((options.rightXEnabled != null) ? options.rightXEnabled : true);
    
    // TODO: implement sticky, double tap to release sticky and follows finger for sticky
    this.leftSticky = ((options.leftSticky != null) ? options.leftSticky : true);
    this.rightSticky = ((options.rightSticky != null) ? options.rightSticky : true);

    this.leftDoubleTapRelease = ((options.leftDoubleTapRelease != null) ? options.leftDoubleTapRelease : true);
    this.rightDoubleTapRelease = ((options.rightDoubleTapRelease != null) ? options.rightDoubleTapRelease : true);
    
    this.followsFinger = ((options.followsFinger != null) ? options.followsFinger : true);

    // TODO: implement drag distance before control is engaged
    this.leftEngageDistance = options.leftEngageDistance || 5;
    this.rightEngageDistance = options.rightEngageDistance || 5;

    this.leftThrowDistance = options.leftThrowDistance || 75;
    this.rightThrowDistance = options.rightThrowDistance || 75;
    
    this.leftLimitedThrow = ((options.leftLimitedThrow != null) ? options.leftLimitedThrow : true);
    this.rightLimitedThrow = ((options.rightLimitedThrow != null) ? options.rightLimitedThrow : true);
    
    // would rather use html4 events but apparently there is no support in safari and ie, so lets just use the following for now
    // the events will fire with two attributes on an object, the control type (left or right), and the strength. Strengh will be
    // from 0 to 100 based on the throw, if limited throw, otherwise the distance in pixels from the origin of the control.
    
    // as per mouse and touch events, control events will only fire when the control is modified, so if held in a specific position,
    // then there will only be the initial event for that position
    
    // note that events fire independant of the canvas being updated
    
    this.leftDirectionListener = options.leftDirectionListener || function() {};
    this.rightDirectionListener = options.rightDirectionListener || function() {};
    this.leftReleaseListener = options.leftReleaseListener || function() {};
    this.rightReleaseListener = options.rightReleaseListener || function() {};
    
    this.Listener = options.Listener || function() {};
    
    this.frameRate = options.frameRate || 35;

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


TouchControls.LEFT_CONTROL = 'left';
TouchControls.RIGHT_CONTROL = 'right';

TouchControls.UP = 'up';
TouchControls.DOWN = 'down';
TouchControls.LEFT = 'left';
TouchControls.RIGHT = 'right';

TouchControls.UP_LEFT = 'up_left';
TouchControls.UP_RIGHT = 'up_right';
TouchControls.DOWN_LEFT = 'down_left';
TouchControls.DOWN_RIGHT = 'down_right';


TouchControls.prototype.initialise = function() {
    this.setupCanvas();
    
    if(this.touchable) {
        this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false);
        this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false);
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false);

        this.offsets = recursiveOffsetLeftAndTop(this.canvas);
	
        window.onorientationchange = this.resetCanvas;  
        window.onresize = this.resetCanvas;  
    } else {
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
	this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    }
}

TouchControls.prototype.resetCanvas = function(e) {  
    // set the canvas width/height to the offset width/height, which will be the parent dims
    // TODO: should we change references to offsetWidth/offsetHeight instead of changing the canvas? why is offsetWidth correct, but width not?
    this.canvas.width = this.canvas.offsetWidth; 
    this.canvas.height = this.canvas.offsetHeight;
    
    // setup half and half so we can use for touch detection of buttons
    this.halfWidth = this.canvas.width / 2; 
    this.halfHeight = this.canvas.height / 2;
}

TouchControls.prototype.drawCanvas = function(self) {
    // clear the canvas
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height); 

    if(this.touchable) {
        for(var i = 0; i < this.touches.length; i++) {
	    var touch = this.touches[i]; 
	
	    if(touch.identifier == this.leftTouchID) {
		// draw the left touch
		this.drawTouch(touch, this.leftTouchStartPos, this.leftTouchPos, this.leftVector);
	    } else if(touch.identifier == this.rightTouchID) {
		// draw the right touch
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
	// we're are mouse, so show the co-ords
	this.c.fillStyle	 = "white"; 
	this.c.fillText("mouse : " + this.mouseX + ", " + this.mouseY, this.mouseX, this.mouseY);
    }
}

TouchControls.prototype.drawTouch = function(touch, touchStartPosition, touchPosition, vector) {
    // inside thicker circle for start touch position
    this.drawGlowCircle(touchStartPosition.x, touchStartPosition.y, 40, 0, Math.PI * 2, true, 20, 50, 50, 255, 0.05);
    
    // outside thin circle for start touch position
    this.drawGlowCircle(touchStartPosition.x, touchStartPosition.y, 65, 0, Math.PI * 2, true, 10, 50, 50, 255, 0.05);
    
    // touch position circle for the current location of the touch
    this.drawGlowCircle(touchPosition.x, touchPosition.y, 40, 0, Math.PI * 2, true, 12, 255, 75, 75, 0.05);
    
    if(this.debugging) {
	this.c.beginPath(); 
	this.c.fillStyle = "red";
	this.c.fillText("touch id : " +
	    touch.identifier +
	    " x:" + touchPosition.x +
	    " y:" + touchPosition.y +
	    " distance x: " + vector.x +
	    " y: " + vector.y +
	    " tx:" + (touch.clientX - this.offsets.offsetLeft) +
	    " ty:" + (touch.clientY - this.offsets.offsetTop)
	    ,
	    touchPosition.x + 30, touchPosition.y - 30);
    }
}

TouchControls.prototype.drawGlowCircle = function(x, y, radius, startAngle, endAngle, antiClockwise, lineWidth, r, g, b, a) {
    // adjust the radius by half the line width as the method to draw the glow circle draws on the inside of the radius
    var adj = Math.abs(lineWidth / 2);
    
    rad = radius + adj;

    var stop1 = (rad - lineWidth) / rad;
    var stop2 = 0;
    var stop3 = stop1 + (1 - stop1) / 2;
    var stop4 = 0;
    var stop5 = 1;
    
    stop2 = stop3 - (stop3 - stop1) / 2;
    stop4 = stop3 + (stop5 - stop3) / 2;
    
    var radgrad = this.c.createRadialGradient(x, y, 0, x, y, rad);
    
    radgrad.addColorStop(stop1, 'rgba(' + r + ',' + g + ',' + b + ', 0)');
    radgrad.addColorStop(stop2, 'rgba(' + r + ',' + g + ',' + b + ', .4)');
    radgrad.addColorStop(stop3, 'rgba(' + r + ',' + g + ',' + b + ', 1)');
    radgrad.addColorStop(stop4, 'rgba(' + r + ',' + g + ',' + b + ', .4)');
    radgrad.addColorStop(stop5, 'rgba(' + r + ',' + g + ',' + b + ', 0)');
    
    this.c.fillStyle = radgrad;
    this.c.arc(x, y, rad, 0, 2 * Math.PI, true);
    this.c.fill();
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
        if((this.leftTouchID < 0) && (touch.clientX - this.offsets.offsetLeft < this.halfWidth)) {
            this.leftTouchID = touch.identifier; 
            this.leftTouchStartPos.reset(touch.clientX - this.offsets.offsetLeft, touch.clientY - this.offsets.offsetTop);
            this.leftTouchPos.copyFrom(this.leftTouchStartPos); 
            this.leftVector.reset(0,0);
            // continue;
        }
        if((this.rightTouchID < 0) && (touch.clientX - this.offsets.offsetLeft >= this.halfWidth)) {
            this.rightTouchID = touch.identifier; 
            this.rightTouchStartPos.reset(touch.clientX - this.offsets.offsetLeft, touch.clientY - this.offsets.offsetTop);
            this.rightTouchPos.copyFrom(this.rightTouchStartPos); 
            this.rightVector.reset(0,0); 
        } else {
            // we have a touch but it is another type...
        }	
    }
    this.touches = e.touches; 
}
 
TouchControls.prototype.onTouchMove = function(e) {
    var getStrength = function(distance, throwDistance) {
	// strength is a factor of 100, with 100 being full and 0 being none
	return Math.abs(Math.round((distance / throwDistance) * 100));
    }
    
    var getDirection = function(vector) {
	var direction = '';
	if(vector.y < 0) {
	    if(vector.x == 0) {
		direction = TouchControls.UP;
	    } else if(vector.x > 0) {
		direction = TouchControls.UP_RIGHT;
	    } else {
		direction = TouchControls.UP_LEFT;
	    }
	} else if(vector.y > 0) {
	    if(vector.x == 0) {
		direction = TouchControls.DOWN;
	    } else if(vector.x > 0) {
		direction = TouchControls.DOWN_RIGHT;
	    } else {
		direction = TouchControls.DOWN_LEFT;
	    }
	} else {
	    if(vector.x > 0) {
		direction = TouchControls.RIGHT;
	    } else {
		direction = TouchControls.LEFT;
	    }
	}
	
	return direction;
    }
    // Prevent the browser from doing its default behaviour (scroll, zoom)
    e.preventDefault();
    var strength = 0;
    
    for(var i = 0; i < e.changedTouches.length; i++){
	var touch = e.changedTouches[i];
	
	if(this.rightTouchID == touch.identifier) {
	    this.rightVector.reset(touch.clientX - this.offsets.offsetLeft, touch.clientY - this.offsets.offsetTop);

	    if(this.rightLimitedThrow) {
		this.rightVector.minusEqLimit(this.rightTouchStartPos, this.rightThrowDistance, this.rightXEnabled, this.rightYEnabled);
		this.rightTouchPos.copyFrom(this.rightTouchStartPos);
		this.rightTouchPos.plusEq(this.rightVector);
	
		strengthX = getStrength(this.rightVector.x, this.rightThrowDistance);
		strengthY = getStrength(this.rightVector.y, this.rightThrowDistance);
		
		if(strengthX != this.rightStrengthX || strengthY != this.rightStrengthY) {
		    this.rightDirectionListener({
			controlId: TouchControls.RIGHT_CONTROL,
			direction: getDirection(this.rightVector),
			strengthX:getStrength(this.rightVector.x, this.rightThrowDistance),
			strengthY:getStrength(this.rightVector.y, this.rightThrowDistance)});
		    
		    this.rightStrengthX = strengthX;
		    this.rightStrengthY = strengthY;
		}
	    } else {
		this.rightTouchPos.copyFrom(this.rightVector);
		this.rightVector.minusEq(this.rightTouchStartPos);
	    }
	}
	
	if(this.leftTouchID == touch.identifier) {
	    this.leftVector.reset(touch.clientX - this.offsets.offsetLeft, touch.clientY - this.offsets.offsetTop);
	    if(this.leftLimitedThrow) {
		this.leftVector.minusEqLimit(this.leftTouchStartPos, this.leftThrowDistance, this.leftXEnabled, this.leftYEnabled);
		this.leftTouchPos.copyFrom(this.leftTouchStartPos);
		this.leftTouchPos.plusEq(this.leftVector);
		
		strengthX = getStrength(this.leftVector.x, this.leftThrowDistance);
		strengthY = getStrength(this.leftVector.y, this.leftThrowDistance);
		
		if(strengthX != this.leftStrengthX || strengthY != this.leftStrengthY) {
		    this.leftDirectionListener({
			controlId: TouchControls.LEFT_CONTROL,
			direction: getDirection(this.leftVector),
			strengthX:strengthX,
			strengthY:strengthY});
		    
		    this.leftStrengthX = strengthX;
		    this.leftStrengthY = strengthY;
		}
	    } else {
		this.leftTouchPos.copyFrom(this.leftVector);
		this.leftVector.minusEq(this.leftTouchStartPos);
	    }
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
	    this.leftStrengthX = 0;
	    this.leftStrengthY = 0;
	    
	    this.leftReleaseListener({controlId: TouchControls.LEFT_CONTROL, strength:0});
	} else if(this.rightTouchID == touch.identifier) {
	    this.rightTouchID = -1; 
	    this.rightVector.reset(0,0);
	    this.rightStrengthX = 0;
	    this.rightStrengthY = 0;
	    
	    this.rightReleaseListener({controlId: TouchControls.RIGHT_CONTROL, strength:0});
	}
    }
}

TouchControls.prototype.onMouseMove = function(event) {
    this.mouseX = event.offsetX;
    this.mouseY = event.offsetY;
}

TouchControls.prototype.onMouseDown = function(event) {
    this.c.clearRect(0, 0, this.canvas.width, this.canvas.height); 
    this.drawGlowCircle(event.offsetX, event.offsetY, 50, 0, Math.PI * 2, true, 20, 300, 0, 0, 0.9);
}

TouchControls.prototype.setupCanvas = function() {
    this.c = this.canvas.getContext('2d');
    
    this.resetCanvas(); 
}

var recursiveOffsetLeftAndTop = function(element) {
    var offsetLeft = 0;
    var offsetTop = 0;
    
    // TODO: doesn't take into account when elements are off the screen, eg. slides from right/left, etc.
    
    while (element) {
        // offsetLeft += element.offsetLeft;
        offsetTop += element.offsetTop;

        element = element.offsetParent;
    }
    
    return {
        offsetLeft: offsetLeft,
        offsetTop: offsetTop
    };
};