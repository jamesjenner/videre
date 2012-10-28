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
    addTab: function(pane, options) {
        // do we really need this?
    },
    setFocusedTabId: function(paneId, tabId) {
        this.panes[paneId].focusedTabId = tabId;
    },
    getFocusedTabId: function(paneId) {
        paneId = (typeof paneId === "undefined") ? this.focusedPaneId : paneId;
        
        return this.panes[paneId].focusedTabId;
    },
    setFocusedTab: function(paneId, nbr) {
        this.panes[paneId].focusedTab = nbr;
    },
    getFocusedTab: function(paneId) {
        return this.panes[paneId].focusedTab;
    },
};

var Pane = function (options) {
    this.currentTab = 0;
}
