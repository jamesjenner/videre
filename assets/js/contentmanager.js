/*
 * contentmanager.js
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
    this.currentVehicle = '';
    this.currentActionBar = null;
    this.currentServer = '';
    this.vehicles = new Array();
    this.remoteVehicles = new Object();
    this.serverVehicleDeviceTypes = new Object();
    this.servers = new Array();
    this.preferences = new Preferences();
    
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
            } else {
                key = prop;
            }
            switch(key) {
                case Vehicle.KEY:
                    // we have a vehicle object
                    obj = ioRetreiveObject(prop);
                    this.addVehicle(new Vehicle(obj), false);
                    break;
                case SERVER_KEY:
                    // we have a server object
                    obj = ioRetreiveObject(prop);
                    temp = new Server();
                    temp.load(obj);
                    this.addServer(temp, false);
                    break;
                case Preferences.PREFERENCES_KEY:
                    // we have preferences
                    obj = ioRetreiveObject(prop);
                    this.preferences = new Preferences(obj);
            }
        }
    },
    addVehicle: function(vehicle, persist) {
        var i = this.vehicles.length;
        
        // this is a local vehicle, so just use an incremental number based on the array
        vehicle.id = i;
        
        this.vehicles.push(vehicle);

        // persist the data
        if(persist) {
            ioStoreObject(Vehicle.KEY + '_' + this.vehicles[i].id, vehicle);
        }
    },
    removeVehicle: function(vehicle) {
        // remove the persisted vehicle
        ioDelete(Vehicle.KEY + '_' + vehicle.id);
        
        // find the vehicle in the list
        idx = findObjectById(vehicles, vehicle.id);
        
        // remove from the array
        if(idx > -1) {
            this.vehicles.splice(idx, 1);
        }
    },
    addRemoteVehicle: function(server, vehicle) {
        var exists = false;
        
        if(!this.remoteVehicles[server.name]) {
            this.remoteVehicles[server.name] = new Array();
        } else {
            // check that the vehicle doesn't exist based on name
            for(var i = 0, l = this.remoteVehicles[server.name].length; i < l; i++) {
                if(this.remoteVehicles[server.name][i].name === vehicle.name) {
                    exists = true;
                }
            }
        }

        if(exists) {
            // it exists so we're not adding it, return false
            return false;
        } else {
            this.remoteVehicles[server.name].push(vehicle);
            
            // it didn't exist and we added it, so return true
            return true;
        }
    },
    removeRemoteVehicle: function(server, vehicle) {
        for(var i = 0, l = this.remoteVehicles[server.name].length; i < l; i++) {
            if(this.remoteVehicles[server.name][i].id === vehicle.id) {
                this.remoteVehicles[server.name].splice(i, 1);
                break;
            }
        }
    },
    updateVehicle: function(vehicle) {
        ioStoreObject(Vehicle.KEY + '_' + vehicle.id, vehicle);
    },
    setVehicleDeviceTypes: function(server, deviceTypes) {
        if(!this.serverVehicleDeviceTypes[server.name]) {
            this.serverVehicleDeviceTypes[server.name] = new Array();
        }
        
        this.serverVehicleDeviceTypes[server.name] = deviceTypes;
    },
    getVehicleDeviceTypes: function(serverName) {
        if(this.serverVehicleDeviceTypes[serverName]) {
            return this.serverVehicleDeviceTypes[serverName];
        } else {
            return new Array();
        }
    },
    addServer: function(server, persist) {
        var i = this.servers.length;
        this.servers[i] = server;
        this.servers[i].index = i;
        
        // persist the data
        if(persist) {
            ioStoreObject(SERVER_KEY + '_' + this.servers[i].index, server);
        }

        // create the array for vehicles managed by this server        
        if(!this.remoteVehicles[server.name]) {
            this.remoteVehicles[server.name] = new Array();
        }
    },
    removeServer: function(server) {
        // remove the persisted server
        ioDelete(SERVER_KEY + '_' + server.index);
        
        // remove from the array
        this.servers.splice(server.index, 1);
        
        // remove the array of vehicles as well
        if(this.remoteVehicles[server.name]) {
            delete this.remoteVehicles[server.name];
        }
    },
    getVehiclesForServer: function(serverName) {
        if(this.remoteVehicles[serverName]) {
            return this.remoteVehicles[serverName];
        } else {
            return new Array();
        }
    },
    getServerForVehicle: function(vehicleId) {
        for(var i in this.remoteVehicles) {
            for(var j = 0, l = this.remoteVehicles[i].length; j < l; j++) {
                if(this.remoteVehicles[i][j].id === vehicleId) {
                    return i;
                }
            }
        }
        
        return null;
    },
    getRemoteVehicles: function() {
        var vehicles = new Array();
        for(var key in this.remoteVehicles) {
            vehicles = vehicles.concat(this.remoteVehicles[key]);
        }
        
        return vehicles;
    },
    removeVehiclesFromServer: function(serverName) {
        if(this.remoteVehicles[serverName]) {
            this.remoteVehicles[serverName] = new Array();
        }
    },
    updateServer: function(server) {
        ioStoreObject(SERVER_KEY + '_' + server.index, server);
    },
    updatePreferences: function(preferences) {
        this.preferences = preferences;
        ioStoreObject(Preferences.PREFERENCES_KEY, preferences);
    },
    getPreferences: function() {
        return this.preferences;
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
    setCurrentVehicle: function(vehicle) {
        this.currentVehicle = vehicle;
    },
    setCurrentActionBar: function(actionBar) {
        this.currentActionBar = actionBar;
    },
    /** 
     * find index of vehicle based on id, taking into account local and remote vehicles
     * 
     * returns -1 if not found, otherwise the overall index
     */
    getVehicleIndex: function(server, id) {
        // vehicles
        // remoteVehicles
    
        var index = findObjectById(this.vehicles, id);
        
        if(index === -1) {
            index = findObjectById(this.remoteVehicles[server.name], id);
        }
        
        return index;
    },
    getServerIndex: function(name) {
        return findObjectByName(this.servers, name);
    }
    
};

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

/** 
 * find object by id - finds an object based on it's id
 * 
 * returns -1 if not found, otherwise the index in the array
 */
function findObjectById(object, id) {
    var index = -1;

    // if name isn't set then return
    if(!id) {
        return index;
    }

    for(var i = 0, l = object.length; i < l; i++) {
        if(object[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
}

/** 
 * find object by name - finds an object based on it's name
 * 
 * returns -1 if not found, otherwise the index in the array
 */
function findObjectByName(object, name) {
    var index = -1;

    // if name isn't set then return
    if(!name) {
        return index;
    }

    for(var i = 0, l = object.length; i < l; i++) {
        if(object[i].name === name) {
            index = i;
            break;
        }
    }

    return index;
}
