/*
 * gauge.js
 *
 * Copyright (c) 2012 James G Jenner
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/
 */


var Gauge = function (argmap) {
    if('name' in argmap) {
        this.name = argmap.name;
    }
    if('id' in argmap) {
        this.id = argmap.id;
    } else {
        this.id = this.name + 'Panel';
    }
    this.canvasId = this.id + '_canvas';

    if('title' in argmap) {
        this.title = argmap.title;
    }
    if('title' in argmap) {
        this.description = argmap.description;
    }
    if('width' in argmap) {
        this.width = argmap.width;
    } else {
        this.width = '100%';
    }
    if('height' in argmap) {
        this.height = argmap.height;
    } else {
        this.height = '100%';
    }
    if('x' in argmap) {
        this.x = argmap.x;
    } else {
        x = '10px';
    }
    if('y' in argmap) {
        this.y = argmap.y;
    } else {
        y = '10px';
    }
    if('backgroundImg' in argmap) {
        this.backgroundImg = argmap.backgroundImg;
    }
    if('foregroundImg' in argmap) {
        this.foregroundImg = argmap.foregroundImg;
    }
    if('foregroundHeight' in argmap) {
        this.foregroundHeight = argmap.foregroundHeight;
    } else {
        this.foregroundHeight = this.height;
    }
    if('foregroundClips' in argmap) {
        this.foregroundClips = argmap.foregroundClips;
    } else {
        this.foregroundImgClips = false;
    }    if('dialImg' in argmap) {
        this.dialImg = argmap.dialImg;
    }
    // make needle a sub type with it's own properties?
    if('needleImg1' in argmap) {
        this.needleImg1 = argmap.needleImg1;
    }
    if('needleImg1XOffset' in argmap) {
        this.needleImg1XOffset = argmap.needleImg1XOffset;
    } else {
        needleImg1XOffset = '0px';
    }
    if('needleImg1Rotates' in argmap) {
        this.needleImg1Rotates = argmap.needleImg1Rotates;
    } else {
        this.needleImg1Rotates = true;
    }
    if('needleImg1VerticalScroll' in argmap) {
        this.needleImg1VerticalScroll = argmap.needleImg1VerticalScroll;
    } else {
        this.needleImg1VerticalScroll = false;
    }
    if('needleImg1VerticalScrollType' in argmap) {
        this.needleImg1VerticalScrollType = argmap.needleImg1VerticalScrollType;
    } else {
        this.needleImg1VerticalScrollType = 'fixed';
    }
    if('needleImg1Height' in argmap) {
        this.needleImg1Height = argmap.needleImg1Height;
    } else {
        this.needleImg1Height = this.height;
    }
    if('needleImg2' in argmap) {
        this.needleImg2 = argmap.needleImg2;
    }
    if('needleImg2Rotates' in argmap) {
        this.needleImg2Rotates = argmap.needleImg2Rotates;
    } else {
        this.needleImg2Rotates = true;
    }
    if('needleImg3' in argmap) {
        this.needleImg3 = argmap.needleImg3;
    }
    if('needleImg3Rotates' in argmap) {
        this.needleImg3Rotates = argmap.needleImg3Rotates;
    } else {
        this.needleImg3Rotates = true;
    }
    if('overlayImg' in argmap) {
        this.overlayImg = argmap.overlayImg;
    }
    if('icon' in argmap) {
        this.icon = argmap.icon;
    }
    this.enabled = false;
    
    if('contentIsCanvas' in argmap) {
        this.contentIsCanvas = argmap.contentIsCanvas;
    } else {
        this.contentIsCanvas = false;
    }
    if('mask' in argmap) {
        this.mask = argmap.mask;
    }
}

Gauge.SPEED = 'SpeadGauge';
Gauge.ATTITUDE = 'AttitudeGauge';
Gauge.ALTIMETER = 'AltimeterGauge';
Gauge.THERMOMETER = 'ThermometerGauge';
Gauge.HEADING = 'HeadingGauge';
Gauge.VSI  = 'VSIGauge';

Gauge.NEEDLE_1 = 'needle1';
Gauge.NEEDLE_2 = 'needle2';
Gauge.NEEDLE_3 = 'needle3';

    
Gauge.prototype = {
    setBackgroundImage: function(i, b) {
        b = (typeof b === "undefined") ? false : b;
        this.panelBackgroundImg = i;
        this.backgroundImgClips = b;
    },
    setForegroundImage: function(i) {
        this.panelForegroundImg = i;
    },
    setNeedle1Image: function(i) {
        this.panelNeedleImg1 = i;
    },
    setNeedle2Image: function(i) {
        this.panelNeedleImg2 = i;
    },
    setNeedle3Image: function(i) {
        this.panelNeedleImg3 = i;
    },
    setValue: function(v) {
        
    },
};
