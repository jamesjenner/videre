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


var ContentManager = function (options) {
    this.panes = new Object();
    this.focusedPaneId = '';
    this.vehicles = new Array();
    this.servers = new Array();
    
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
}
    
ContentManager.prototype = {
    addVehicle: function(vehicle) {
        var i = this.vehicles.length;
        this.vehicles[i] = vehicle;
        this.vehicles[i].position = i;
    },
    deleteVehicle: function(index) {
        this.vehicles.splice(index, 1);
    },
    addServer: function(server) {
        var i = this.servers.length;
        this.servers[i] = server;
        this.servers[i].position = i;
    },
    addPane: function(id) {
        this.panes[id] = new Pane();
    },
    addTab: function(paneId, tabId, settings) {
        this.panes[paneId].tabs[tabId] = new Tab(settings, tabId);
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
    getFocusedTabSettings: function(paneId) {
        paneId = (typeof paneId === "undefined") ? this.focusedPaneId : paneId;
        if(typeof this.panes[paneId].tabs[this.getFocusedTabId(paneId)] === "undefined" ||
           typeof this.panes[paneId].tabs[this.getFocusedTabId(paneId)].settings === "undefined") {
            return undefined;
        } else {
            return this.panes[paneId].tabs[this.getFocusedTabId(paneId)].settings.settings;
        }
    },
};

var VEHICLE_AIR = 'air';
var VEHICLE_SURFACE = 'surface';
var VEHICLE_SUBMERSIBLE = 'submersible';
var DEFAULT_NAME = 'Thunderbird 1';

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
    
    this.payloadEnabled = this.options.payloadEnabled || false;
    this.navigationEnabled = this.options.navigationEnabled || false;
    this.remoteControlEnabled = this.options.remoteControlEnabled || false;
}

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
}

var Pane = function (options) {
    this.currentTab = 0;
    this.tabs = new Object();
}

var Tab = function (settings, contentAreaId) {
    this.settings = settings;
    this.contentAreaId = contentAreaId;
    // todo: add contentAreaId to this
    // this.x = this.options.x || 0;
    // this.contentAreaId = 
}

var TabSettings = function() {
    this.settings = new Array();
}

TabSettings.prototype = {
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