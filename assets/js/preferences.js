/*
 * preferences.js
 *
 * Copyright (c) 2013 James G Jenner
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


var Preferences = function (options) {
    options = options || {};
    
    this.defaultAltitude = ((options.defaultAltitude != null) ? options.defaultAltitude : 0);
    this.defaultSpeed = ((options.defaultSpeed != null) ? options.defaultSpeed : 0);
    this.defaultAccuracy = ((options.defaultAccuracy != null) ? options.defaultAccuracy : 0);
    
    this.defaultLoiterRadius = ((options.defaultLoiterRadius != null) ? options.defaultLoiterRadius : 0);
    this.defaultLoiterTime = ((options.defaultLoiterTime != null) ? options.defaultLoiterTime : 0);
    this.defaultLoiterLaps = ((options.defaultLoiterLaps != null) ? options.defaultLoiterLaps : 0);
    this.defaultAutoContinue = ((options.defaultAutoContinue != null) ? options.defaultAutoContinue : 0);
    
    this.debugLevel = ((options.debugLevel != null) ? options.debugLevel : 0);
    this.debugEnabled = ((options.debugEnabled != null) ? options.debugEnabled : false);
}

Preferences.PREFERENCES_KEY = "Preferences";
