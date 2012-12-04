/*
 * contentmanager.js v0.1 alpha
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

    function ioStoreObject(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    
    function ioRetreiveObject(key) {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    }
    
    function ioDelete(key) {
        localStorage.removeItem(key);
    }
    
    function ioStoreValue(key, value) {
        localStorage.setItem(key, value);
    }
    
    function ioRetreiveValue(key) {
        return localStorage.getItem(key);
    }    

var ContentManager = function (options) {
    this.panes = new Object();
    this.settings = new Object();
    this.focusedPaneId = '';
    this.currentContentId = '';
    this.vehicles = new Array();
    this.servers = new Array();
    
}
    
ContentManager.prototype = {
    loadData: function() {
        var obj;
        var i;
        var key;
        var temp;
        
        for(var prop in localStorage) {
            console.log("prop:" + prop);
            i = prop.indexOf('_');
            if(i > -1) {
                key = prop.substring(0, i);
                
                switch(key) {
                    case VEHICLE_KEY:
                        // we have a vehicle object
                        obj = ioRetreiveObject(prop);
                        this.addVehicle(new Vehicle(obj.options), false);
                        break;
                    case SERVER_KEY:
                        // we have a server object
                        obj = ioRetreiveObject(prop);
                        temp = new Server();
                        temp.load(obj);
                        this.addServer(temp, false);
                        break;
                }
            }
        }
    },
    addVehicle: function(vehicle, persist) {
        var i = this.vehicles.length;
        this.vehicles[i] = vehicle;
        this.vehicles[i].position = i;
        
        // persist the data
        if(persist) {
            ioStoreObject(VEHICLE_KEY + '_' + this.vehicles[i].position, vehicle);
        }
    },
    removeVehicle: function(vehicle) {
        // remove the persisted vehicle
        ioDelete(VEHICLE_KEY + '_' + vehicle.position);
        
        // remove from the array
        this.vehicles.splice(vehicle.position, 1);
    },
    updateVehicle: function(vehicle) {
        ioStoreObject(VEHICLE_KEY + '_' + vehicle.position, vehicle);
    },
    addServer: function(server, persist) {
        var i = this.servers.length;
        this.servers[i] = server;
        this.servers[i].position = i;
        
        // persist the data
        if(persist) {
            ioStoreObject(SERVER_KEY + '_' + this.servers[i].position, server);
        }
    },
    removeServer: function(server) {
        // remove the persisted server
        ioDelete(SERVER_KEY + '_' + server.position);
        
        // remove from the array
        this.servers.splice(server.position, 1);
    },
    updateServer: function(server) {
        ioStoreObject(SERVER_KEY + '_' + server.position, server);
    },
    addPane: function(id) {
        this.panes[id] = new Pane();
    },
    addTab: function(paneId, tabId) {
        this.panes[paneId].tabs[tabId] = new Tab(tabId);
    },
    addSettings: function(contentId, settings) {
        this.settings[contentId] = settings;
    },
    addGauge: function(pane, gaugeId, gauge) {
        this.panes[id].gauges[gaugeId] = gauge;
    },
    setFocusedTabId: function(paneId, tabId) {
        this.panes[paneId].focusedTabId = tabId;
    },
    getFocusedTabId: function(paneId) {
        paneId = (typeof paneId === "undefined") ? this.focusedPaneId : paneId;
        
        return this.panes[paneId].focusedTabId;
    },
    setFocusedTabNbr: function(paneId, nbr) {
        this.panes[paneId].focusedTab = nbr;
    },
    getFocusedTabNbr: function(paneId) {
        paneId = (typeof paneId === "undefined") ? this.focusedPaneId : paneId;
        
        return this.panes[paneId].focusedTab;
    },
    getFocusedTab: function(paneId) {
        paneId = (typeof paneId === "undefined") ? this.focusedPaneId : paneId;
        
        return this.panes[paneId].tabs[this.getFocusedTabId(paneId)];
    },
    setCurrentContent: function(contentId) {
        this.currentContentId = contentId;
    },
    getContentSettings: function(contentId) {
        contentId = (typeof contentId === "undefined") ? this.currentContentId : contentId;

        if(typeof this.settings[contentId] === "undefined" ||
           typeof this.settings[contentId].settings === "undefined") {
            return undefined;
        } else {
            return this.settings[contentId].settings;
        }
    },
};

var VEHICLE_KEY = 'Vehicle';
var VEHICLE_AIR = 'air';
var VEHICLE_SURFACE = 'surface';
var VEHICLE_SUBMERSIBLE = 'submersible';
var DEFAULT_NAME = 'Thunderbird #';

var Vehicle = function (options) {
    
    this.validTypes = new Object();
    this.validTypes[VEHICLE_AIR] = 'Air';
    this.validTypes[VEHICLE_SURFACE] = 'Surface';
    this.validTypes[VEHICLE_SUBMERSIBLE] = 'Submersible';
    
    // this.validTypes = {'air':'Air','surface':'Surface','submersible':'Submersible'};
    
    this.options = options || {};
    
    this.position = this.options.position || 0;
    
    this.name = this.options.name || DEFAULT_NAME;
    this.type = this.options.type || VEHICLE_AIR;
    
    // check that the type if valid, if not then assign to the first entry
    this.isTypeValid = false;
    
    for(var i in this.validTypes) {
        if(this.type == i) {
          this.isTypeValid = true;
          break;
        }
    }
    if(!this.isTypeValid) {
        this.type = 'air';
    }
    
    this.navigationEnabled = this.options.navigationEnabled || false;
    this.remoteControlEnabled = this.options.remoteControlEnabled || false;

    this.navigationPath = this.options.navigationPath || new Path();
    this.actualPath = this.options.actualPath || new Path();
    
    this.heading = this.options.heading || 0;
    this.speed = this.options.speed || 0;
    this.roll = this.options.roll || 0;         // x axis
    this.pitch = this.options.pitch || 0;       // y axis
    this.yaw = this.options.yaw || 0;           // z axis
    this.maxSpeed = this.options.maxSpeed || 100;
    this.speedUom = this.options.speedUom || UOM_KMH;
}

var UOM_KMH = 'kilometersPerHour';
var UOM_MH = 'milesPerHour';
var UOM_MS = 'metersPerSecond';

var MAP_DEFAULT_LAYER = '';
var MAP_DEFAULT_ZOOM = '';
var MAP_DEFAULT_CENTER = '';

var Map = function (options) {
    this.options = options || {};

    this.trackToUserPosition = this.options.trackToUserPosition || false;
    this.trackToVehiclePosition = this.options.trackToVehiclePosition || false;
    this.locationLat = this.options.locationLat || 0;
    this.locationLng = this.options.locationLng || 0;
    this.center = this.options.center || MAP_DEFAULT_CENTER;
    this.zoom = this.options.zoom || MAP_DEFAULT_ZOOM;
    this.layer = this.options.layer || MAP_DEFAULT_LAYER;
}

var POINT_START = 0;
var POINT_FINISH = 1;
var POINT_TRANSIENT = 2;
var POINT_CURRENT = 0;

var Point = function (lat, lng, ele, flag) {
    this.latitude = lat || 0;
    this.longitude = lng || 0;
    this.elevation = ele || 0;
    this.flag = flag || POINT_TRANSIENT;
}

var Path = function (path) {
    this.path = path | new Array();
}

var SERVER_KEY = 'Server';
var DEFAULT_IP_ADDRESS = '172.0.0.1';
var DEFAULT_PORT = '8080';
var DEFAULT_PROTOCOL = 'VIDERE';

var Server = function (options) {
    this.options = options || {};
    
    this.position = this.options.position || 0;
    
    this.name = this.options.name || "Server";
    this.ipAddress = this.options.ipAddress || DEFAULT_IP_ADDRESS;
    this.port = this.options.port || DEFAULT_PORT;
    this.protocol = this.options.protocol || DEFAULT_PROTOCOL;
    this.isConnected = false;
    this.nbrVehicles = 0;
}

Server.prototype = {
    load: function(obj) {
        this.position = obj.position || 0;
        this.name = obj.name || "Server";
        this.ipAddress = obj.ipAddress || DEFAULT_IP_ADDRESS;
        this.port = obj.port || DEFAULT_PORT;
        this.protocol = obj.protocol || DEFAULT_PROTOCOL;
    },
};

var Pane = function (options) {
    this.currentTab = 0;
    this.tabs = new Object();
}

var Tab = function (contentAreaId) {
    this.contentAreaId = contentAreaId;
}

var ContentSettings = function() {
    this.settings = new Array();
}

ContentSettings.prototype = {
    add: function(setting) {
        this.settings[this.settings.length] = setting;
    },
};


var GaugeSetting = function (gaugeId, gauge, options) {
    if(!gaugeId) return null;
    if(!gauge) return null;
    
    this.gaugeId = gaugeId;
    this.gauge = gauge;
    
    this.options = options || {};

    this.currentValue = this.options.currentValue || 0;
    this.x = this.options.x || 0;
    this.y = this.options.y || 0;
    this.width = this.options.width || 150;
    this.visible = this.options.visible || false;
}

var HeadingSetting = function (title) {
    this.title = title || 'undefined';
}

var ToggleSetting = function (id, label, value) {
    if(!id) return null;
    
    this.id = id;
    this.value = value || false;
    this.label = label || 'undefined';
}

var RangeSetting = function (id, label, value, minValue, maxValue) {
    if(!id) return null;
    
    this.id = id;
    this.value = value || 0;
    this.minValue = minValue || 0;
    this.maxValue = maxValue || 100;
    this.label = label || 'undefined';
}

var TextSetting = function (id, label, value) {
    if(!id) return null;
    
    this.id = id;
    this.value = value || '';
    this.label = label || 'undefined';
}