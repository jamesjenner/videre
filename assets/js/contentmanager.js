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
}
    
ContentManager.prototype = {
    addPane: function(id) {
        this.panes[id] = new Pane();
    },
    addTab: function(paneId, tabId, settings) {
        this.panes[paneId].tabs[tabId] = new Tab(settings);
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

var Pane = function (options) {
    this.currentTab = 0;
    this.tabs = new Object();
}

var Tab = function (settings) {
    this.settings = settings;
}

var TabSettings = function() {
    this.settings = new Array();
}

TabSettings.prototype = {
    add: function(setting) {
        this.settings[this.settings.length] = setting;
    },
};


var GaugeSetting = function (id, gauge, options) {
    if(!id) return null;
    if(!gauge) return null;
    
    this.id = id;
    this.gauge = gauge;
    
    this.options = options || {};

    this.currentValue = this.options.currentValue || 0;
    this.x = this.options.x || 0;
    this.y = this.options.y || 0;
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

var TextSetting = function (id, label, value) {
    if(!id) return null;
    
    this.id = id;
    this.value = value || '';
    this.label = label || 'undefined';
}