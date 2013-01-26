/*
 * vehicle.js v0.1 alpha
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

var VEHICLE_AIR = 'air';
var VEHICLE_SURFACE = 'surface';
var VEHICLE_SUBMERSIBLE = 'submersible';
var VEHICLE_KEY = 'Vehicle';
var VEHICLE_DEFAULT_NAME = 'Thunderbird 1';

var VEHICLE_UOM_KMH = 'kilometersPerHour';
var VEHICLE_UOM_MH = 'milesPerHour';
var VEHICLE_UOM_MS = 'metersPerSecond';

var VEHICLE_DEVICE_PARROT_V1 = 'parrot.v1';
var VEHICLE_DEVICE_PARROT_V2 = 'parrot.v2';

var vehicleValidTypes = new Object();
vehicleValidTypes[VEHICLE_AIR] = 'Air';
vehicleValidTypes[VEHICLE_SURFACE] = 'Surface';
vehicleValidTypes[VEHICLE_SUBMERSIBLE] = 'Submersible';

var Vehicle = function (options) {
    
    
    // this.vehicleValidTypes = {'air':'Air','surface':'Surface','submersible':'Submersible'};
    
    options = options || {};
    
    this.position = options.position || 0;
    
    this.name = options.name || VEHICLE_DEFAULT_NAME;
    this.type = options.type || VEHICLE_AIR;
    this.deviceType = options.deviceType || VEHICLE_DEVICE_PARROT_V1;
    
    // check that the type if valid, if not then assign to the first entry
    this.isTypeValid = false;
    
    for(var i in vehicleValidTypes) {
        if(this.type == i) {
          this.isTypeValid = true;
          break;
        }
    }
    if(!this.isTypeValid) {
        this.type = VEHICLE_AIR;
    }
    
    this.navigationEnabled = options.navigationEnabled || false;
    this.remoteControlEnabled = options.remoteControlEnabled || false;

    this.navigationPath = options.navigationPath || new Path();
    this.actualPath = options.actualPath || new Path();
    
    this.heading = options.heading || 0;
    this.speed = options.speed || 0;
    this.roll = options.roll || 0;         // x axis
    this.pitch = options.pitch || 0;       // y axis
    this.yaw = options.yaw || 0;           // z axis
    this.maxSpeed = options.maxSpeed || 100;
    this.speedUom = options.speedUom || VEHICLE_UOM_KMH;
}
