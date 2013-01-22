/*
 * actionBar.js v0.1 alpha
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

function ActionBar(options) {
  options = options || {};

  this.title = options.title || 'Unknown';
  this.id = options.id || 'Unknown';
  this.targetId = options.targetId || 'Unknown';
  
  this.saveAction = ((options.save != null) ? options.save : false);
  this.saveFunction = options.saveFunction || function() {};
  
  this.removeAction = ((options.remove != null) ? options.remove : false);
  this.removeFunction = options.removeFunction || function() {};
  
  this.disconnectAction = ((options.disconnect != null) ? options.disconnect : false);
  this.disconnectFunction = options.disconnectFunction || function() {};
  
  this.connectAction = ((options.connect != null) ? options.connect : false);
  this.connectFunction = options.connectFunction || function() {};
  
  this.settingsAction = ((options.settings != null) ? options.settings : false);
  
  this.takeoffAction = ((options.takeoff != null) ? options.takeoff : false);
  this.takeoffFunction = options.takeoffFunction || function() {};
  this.landAction = ((options.land != null) ? options.land : false);
  this.landFunction = options.landFunction || function() {};
  this.abortAction = ((options.abort != null) ? options.abort : false);
  this.abortFunction = options.abortFunction || function() {};
  
  this.settingsFunction = options.settingsFunction || function() {
    loadSidebar(this.targetId, 'rightScroller');
    showSidebar('rightSidebar', 'right', 'mainApplication', 'mainApplicationOverlay', 'mainApplicationOverlay', '300ms');
    
    return false;
  }

  this.isEnabled = new Array();  
  this.isEnabled[ActionBar.SAVE] = this.saveAction;
  this.isEnabled[ActionBar.REMOVE] = this.removeAction;
  this.isEnabled[ActionBar.DISCONNECT] = this.disconnectAction;
  this.isEnabled[ActionBar.CONNECT] = this.connectAction;
  this.isEnabled[ActionBar.SETTINGS] = this.settingsAction;
  
  this.isEnabled[ActionBar.TAKEOFF] = this.takeoffAction;
  this.isEnabled[ActionBar.LAND] = this.landAction;
  this.isEnabled[ActionBar.ABORT] = this.abortAction;
}

ActionBar.SAVE = 0;
ActionBar.REMOVE = 1;
ActionBar.DISCONNECT = 2;
ActionBar.CONNECT = 3;

ActionBar.TAKEOFF = 21;
ActionBar.LAND = 22;

ActionBar.ABORT = 29;

ActionBar.SETTINGS = 99;

ActionBar.prototype.initialise = function() {
    $('#' + this.targetId).prepend(
      '  <div id="' + this.id + 'TaskBar" class="taskBar boxLayout">' +
      '    <div id="leftSidebarControl' + this.id + '" class="sidebarPanel noflex centered">' +
      '      <img src="icons/android/icon_xhdpi.png" class="centered" height="34px" width="34px" alt="icon">' +
      '    </div>' +
      '    <div id="' + LEFT_SIDEBAR_CONTROL_TEXT + this.id + '" class="title">' + this.title + '</div>' +
      '    <div id="' + this.id + 'TabBar" class="tabBar flex boxLayout">' +
      '    </div>' +
      
      // check the actions that are to be available... settings (if enabled) always goes last
      (this.takeoffAction ? 
      '    <div id="takeoffActionControl' + this.id + '" class="actionBarAction noflex centered">' +
      '      <img src="assets/icons/drawable-hdpi-v11/ic_action_takeoff.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
      '      <span class="actionBarText">Takeoff</span>' +
      '    </div>'
      : '') +
      (this.landAction ? 
      '    <div id="landActionControl' + this.id + '" class="actionBarAction noflex centered">' +
      '      <img src="assets/icons/drawable-hdpi-v11/ic_action_land.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
      '      <span class="actionBarText">Land</span>' +
      '    </div>'
      : '') +
      (this.abortAction ? 
      '    <div id="abortActionControl' + this.id + '" class="actionBarAction noflex centered">' +
      '      <img src="assets/icons/drawable-hdpi-v11/ic_action_abort.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
      '      <span class="actionBarText">Abort</span>' +
      '    </div>'
      : '') +
      
      (this.saveAction ? 
      '    <div id="saveActionControl' + this.id + '" class="actionBarAction noflex centered">' +
      '      <img src="assets/icons/drawable-hdpi-v11/ic_action_save.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
      '      <span class="actionBarText">Save</span>' +
      '    </div>'
      : '') +
      (this.disconnectAction ?
      '    <div id="disconnectActionControl' + this.id + '" class="actionBarAction noflex centered">' +
      '      <img src="assets/icons/drawable-hdpi-v11/ic_action_connection_disable.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
      '      <span class="actionBarText">Disconnect</span>' +
      '    </div>'
      : '') +
      (this.connectAction ? 
      '    <div id="connectActionControl' + this.id + '" class="actionBarAction noflex centered">' +
      '      <img src="assets/icons/drawable-hdpi-v11/ic_action_connection_enable.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
      '      <span class="actionBarText">Connect</span>' +
      '    </div>'
      : '') +
    
      (this.removeAction ? 
      '    <div id="removeActionControl' + this.id + '" class="actionBarAction noflex centered">' +
      '      <img src="assets/icons/drawable-hdpi-v11/ic_action_delete.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
      '      <span class="actionBarText">Delete</span>' +
      '    </div>'
      : '') +
      
      (this.settingsAction ? 
      '    <div id="rightSidebarControl' + this.id + '" class="actionBarAction noflex centered">' +
      '      <img src="assets/icons/drawable-hdpi-v11/ic_action_settings.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
      '    </div>' : '') +
      
      '  </div>');
    
    // add listener to the control that activates the left sidebar
    $('#leftSidebarControl' + this.id).click(function() {
      showSidebar(LEFT_SIDEBAR_ID, 'left', 'mainApplication', 'mainApplicationOverlay', 'mainApplicationOverlay', '300ms');
      
      return false;
    });
    $('#' + LEFT_SIDEBAR_CONTROL_TEXT + this.id).click(function() {
      showSidebar(LEFT_SIDEBAR_ID, 'left', 'mainApplication', 'mainApplicationOverlay', 'mainApplicationOverlay', '300ms');
      
      return false;
    });
  
    // check the actions that are to be available... settings (if enabled) always goes last
    var self = this;
    
    // add the click events for the actions that are to be available
    if(this.takeoffAction) {
      $('#takeoffActionControl' + this.id).on('click', function() {
        if(self.isEnabled[ActionBar.TAKEOFF]) {
          self.takeoffFunction();
        }
      });
    }
    if(this.landAction) {
      $('#landActionControl' + this.id).on('click', function() {
        if(self.isEnabled[ActionBar.LAND]) {
          self.landFunction();
        }
      });
    }
    if(this.abortAction) {
      $('#abortActionControl' + this.id).on('click', function() {
        if(self.isEnabled[ActionBar.ABORT]) {
          self.abortFunction();
        }
      });
    }

    if(this.saveAction) {
      $('#saveActionControl' + this.id).on('click', function() {
        if(self.isEnabled[ActionBar.SAVE]) {
          self.saveFunction();
        }
      });
    }
    if(this.removeAction) {
      $('#removeActionControl' + this.id).on('click', function() {
        if(self.isEnabled[ActionBar.REMOVE]) {
          self.removeFunction();
        }
      });
    }
    if(this.disconnectAction) {
      $('#disconnectActionControl' + this.id).on('click', function() {
        if(self.isEnabled[ActionBar.DISCONNECT]) {
          self.disconnectFunction();
        }
      });
    }
    if(this.connectAction) {
      $('#connectActionControl' + this.id).on('click', function() {
        if(self.isEnabled[ActionBar.CONNECT]) {
          self.connectFunction();
        }
      });
    }
    
    if(this.settingsAction) {
      $('#rightSidebarControl' + this.id).on('click', function() {
        if(self.isEnabled[ActionBar.SETTINGS]) {
          self.settingsFunction();
        }
      });
    }
    
    return this;
}

ActionBar.prototype.addTab = function(tabId, tabName, tabNumber, vehicleContentNbr, selected) {
    selected = (typeof selected === "undefined") ? false : selected;
    
    $('#' + this.id + 'TabBar').append(
        '      <div id="' + tabId + '" class="tabControl centered' +  (selected ? ' tabSelected' : '') + '">' + tabName + '</div>'
        );
    
    // add a listener to each tab for navigating to the correct div
    $('#' + tabId).click(function() {
        vehicleContentSlider[vehicleContentNbr].slide(tabNumber, 0);
    });
    
    return this;
}

ActionBar.prototype.addDivider = function () {
    $('#' + this.id + 'TabBar').append(
        '      <div class="tabDivider centered"></div>'
        );
  
    return this;
}

ActionBar.prototype.getPreId = function(action) {
  var preId = '';
  
  switch(action) {
    case ActionBar.SAVE:
      preId = '#saveActionControl';
      break;
    
    case ActionBar.REMOVE:
      preId = '#removeActionControl';
      break;
    
    case ActionBar.DISCONNECT:
      preId = '#disconnectActionControl';
      break;
    
    case ActionBar.CONNECT:
      preId = '#connectActionControl';
      break;
    
    case ActionBar.SETTINGS:
      preId = '#rightSidebarControl';
      break;
    
    default:
      // TODO: throw exception
  }
  
  return preId;
}

ActionBar.prototype.disableAction = function(action) {
  var preId = this.getPreId(action);

  this.isEnabled[action] = false;
  $(preId + this.id).addClass('actionBarActionDisabled');
  
  return this;
}

ActionBar.prototype.enableAction = function(action) {
  var preId = this.getPreId(action);

  this.isEnabled[action] = true;
  $(preId + this.id).removeClass('actionBarActionDisabled');
  
  return this;
}
