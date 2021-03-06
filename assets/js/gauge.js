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
    
    /*
     *
     * TODO the following is the preference however code in index.html is testing typeof <...> != "undefined", so needs some work.
    this.name = ((options.name != null) ? options.name : '');    
    this.id = ((options.id != null) ? options.id : this.name + 'Panel');
    
    this.canvasId = this.id + '_canvas';

    this.title = ((options.title != null) ? options.title : '');
    this.description = ((options.description != null) ? options.description : '');
    
    this.width = ((options.width != null) ? options.width : '100%');
    this.height = ((options.height != null) ? options.height : '100%');
    this.x = ((options.x != null) ? options.x : '10px');
    this.y = ((options.y != null) ? options.y : '10px');
    this.backgroundImg = ((options.backgroundImg != null) ? options.backgroundImg : undefined);
    this.foregroundImg = ((options.foregroundImg != null) ? options.foregroundImg : undefined);
    this.foregroundHeight = ((options.foregroundHeight != null) ? options.foregroundHeight : this.height);
    this.foregroundClips = ((options.foregroundClips != null) ? options.foregroundClips : false);
    
    this.dialImg = ((options.dialImg != null) ? options.dialImg : undefined);
    this.needleImg1                   = ((options.needleImg1                   != null) ? options.needleImg1                   : undefined);
    this.needleImg1XOffset            = ((options.needleImg1XOffset            != null) ? options.needleImg1XOffset            : '0px');
    this.needleImg1Rotates            = ((options.needleImg1Rotates            != null) ? options.needleImg1Rotates            : true);
    this.needleImg1VerticalScroll     = ((options.needleImg1VerticalScroll     != null) ? options.needleImg1VerticalScroll     : false);
    this.needleImg1VerticalScrollType = ((options.needleImg1VerticalScrollType != null) ? options.needleImg1VerticalScrollType : 'fixed');
    this.needleImg1Height             = ((options.needleImg1Height             != null) ? options.needleImg1Height             : this.height);
    
    this.needleImg2                   = ((options.needleImg2                   != null) ? options.needleImg2                   : undefined);
    this.needleImg2Rotates            = ((options.needleImg2Rotates            != null) ? options.needleImg2Rotates            : true);
    
    this.needleImg3                   = ((options.needleImg3                   != null) ? options.needleImg3                   : undefined);
    this.needleImg3Rotates            = ((options.needleImg3Rotates            != null) ? options.needleImg3Rotates            : true);
    
    this.overlayImg = ((options.overlayImg != null) ? options.overlayImg : '');
    this.icon = ((options.icon != null) ? options.icon : '');
    
    this.enabled = false;
    
    this.contentIsCanvas = ((options.contentIsCanvas != null) ? options.contentIsCanvas : false);
    
    this.mask = ((options.mask != null) ? options.mask : '');
*/
    this.size = ((argmap.size != null) ? argmap.size : 'small');

    this.stateBackgroundImg = ((argmap.stateBackgroundImg != null) ? argmap.stateBackgroundImg : '');
    this.stateIndicatorActiveImg = ((argmap.stateIndicatorActiveImg != null) ? argmap.stateIndicatorActiveImg : '');
    this.stateIndicatorInactiveImg = ((argmap.stateIndicatorInactiveImg != null) ? argmap.stateIndicatorInactiveImg : '');
    this.stateIndicatorDisabledImg = ((argmap.stateIndicatorDisabledImg != null) ? argmap.stateIndicatorDisabledImg : '');
    this.stateToggleImg = ((argmap.stateToggleImg != null) ? argmap.stateToggleImg : '');
    
    this.states = new Array();
    if(argmap.states != null) {
        for(var i in argmap.states) {
            this.states.push(new GaugeState(argmap.states[i]));
        }
    }

    this.horizontalBarBackgroundImg = ((argmap.horizontalBarBackgroundImg != null) ? argmap.horizontalBarBackgroundImg : '');
    this.horizontalBarWhiteImg = ((argmap.horizontalBarWhiteImg != null) ? argmap.horizontalBarWhiteImg : '');
    this.horizontalBarRedImg = ((argmap.horizontalBarRedImg != null) ? argmap.horizontalBarRedImg : '');
    this.horizontalBarOrangeImg = ((argmap.horizontalBarOrangeImg != null) ? argmap.horizontalBarOrangeImg : '');
    this.horizontalBarGreenImg = ((argmap.horizontalBarGreenImg != null) ? argmap.horizontalBarGreenImg : '');
    this.horizontalBarIndicatorRedImg = ((argmap.horizontalBarIndicatorRedImg != null) ? argmap.horizontalBarIndicatorRedImg : '');
    this.horizontalBarIndicatorWhiteImg = ((argmap.horizontalBarIndicatorWhiteImg != null) ? argmap.horizontalBarIndicatorWhiteImg : '');
    
    this.horizontalBars = new Array();
    if(argmap.horizontalBars != null) {
        for(var i in argmap.horizontalBars) {
            this.horizontalBars.push(new GaugeBar(argmap.horizontalBars[i]));
        }
    }
}

Gauge.SIZE_LARGE = 'large';
Gauge.SIZE_SMALL = 'small';
Gauge.STATUS = 'StatusGauge_indicator';
Gauge.SPEED = 'SpeadGauge';
Gauge.ATTITUDE = 'AttitudeGauge';
Gauge.ALTIMETER = 'AltimeterGauge';
Gauge.THERMOMETER = 'ThermometerGauge';
Gauge.HEADING = 'HeadingGauge';
Gauge.VSI  = 'VSIGauge';
Gauge.STATUS = 'StatusGauge';
Gauge.BATTERIES = 'Batteries';

Gauge.NEEDLE_1 = 'needle1';
Gauge.NEEDLE_2 = 'needle2';
Gauge.NEEDLE_3 = 'needle3';

Gauge.STATE_ARMED = 'armed';
Gauge.STATE_STABILIZED = 'stabilized';
Gauge.STATE_AUTONOMOUS = 'autonomous';
Gauge.STATE_REMOTECONTROL = 'remoteControl';
Gauge.STATE_HARDWAREINLOOP = 'hardwareInLoop';
Gauge.STATE_GUIDED = 'guided';
Gauge.STATE_GPS = 'gps';
Gauge.STATE_MESSAGES = 'messages';

Gauge.BATTERY_VOLTAGE = 'voltage';
Gauge.BATTERY_CURRENT = 'current';
Gauge.BATTERY_PERCENTAGE = 'percentage';

    
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


var GaugeState = function (options) {
    this.id = ((options.id != null) ? options.id : '');
    this.label = ((options.label != null) ? options.label : '');
    this.toggle = ((options.toggle != null) ? options.toggle : false);
    this.textBox = ((options.textBox != null) ? options.textBox : false);
    this.action = ((options.action != null) ? options.action : function() {});
}

var GaugeBar = function (options) {
    this.id = ((options.id != null) ? options.id : '');
    this.label = ((options.label != null) ? options.label : '');
    this.labelCentered = ((options.labelCentered != null) ? options.labelCentered : false);
    this.redIndicatorEnabled = ((options.redIndicatorEnabled != null) ? options.redIndicatorEnabled : false);
    this.whiteIndicatorEnabled = ((options.whiteIndicatorEnabled != null) ? options.whiteIndicatorEnabled : false);
    
    this.whiteBarEnabled = ((options.whiteBarEnabled != null) ? options.whiteBarEnabled : false);
    this.redBarEnabled = ((options.redBarEnabled != null) ? options.redBarEnabled : false);
    this.orangeBarEnabled = ((options.orangeBarEnabled != null) ? options.orangeBarEnabled : false);
    this.greenBarEnabled = ((options.greenBarEnabled != null) ? options.greenBarEnabled : false);
    
    this.showValue = ((options.showValue != null) ? options.showValue : false);

    this.startValue = ((options.startValue != null) ? options.startValue : '');
    this.endValue = ((options.endValue != null) ? options.endValue : '');
    
    this.endValueIsActual = ((options.endValueIsActual != null) ? options.endValueIsActual : '');
}



