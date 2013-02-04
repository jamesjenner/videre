/*
 * modalBar.js
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

function ModalBar(options) {
  options = options || {};

  this.id = options.id || 'Unknown';
  this.targetId = options.targetId || 'Unknown';
  
  this.acceptFunction = options.acceptFunction || function() {};
  
  this.cancelFunction = options.cancelFunction || function() {};
}

ModalBar.ACCEPT = 0;
ModalBar.CANCEL = 99;

ModalBar.prototype.initialise = function() {
  $('#' + this.targetId).prepend(
    '  <div id="' + this.id + 'ModalBar" class="taskBar boxLayout">' +
    /*
    '    <div id="' + this.id + 'ModalActionBar" class="tabBar flex boxLayout">' +
    '    </div>' +
    */
    
    '    <div id="cancelControl' + this.id + '" class="modalBarAction flex centered">' +
    '      <img src="assets/icons/drawable-hdpi-v11/ic_action_cancel.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
    '      <span class="actionBarText">Cancel</span>' +
    '    </div>' +
    
    '      <div class="tabDivider centered"></div>' +
    
    '    <div id="acceptControl' + this.id + '" class="modalBarAction flex centered">' +
    '      <img src="assets/icons/drawable-hdpi-v11/ic_action_accept.png" class="actionBarImage" height="34px" width="34px" alt="icon">' +
    '      <span class="actionBarText">Accept</span>' +
    '    </div>' +
    '  </div>');
  
  $('#acceptControl' + this.id).on('click', function() {
    this.hide();
    this.acceptFunction();
  }.bind(this));
  
  $('#cancelControl' + this.id).on('click', function() {
    this.hide();
    this.cancelFunction();
  }.bind(this));
  
  return this;
}

ModalBar.prototype.show = function() {
  $('#' + this.targetId).css('visibility', 'visible');
}

ModalBar.prototype.hide = function() {
  $('#' + this.targetId).css('visibility', 'hidden');
}

ModalBar.prototype.setAcceptFunction = function(func) {
  this.acceptFunction = func;
}