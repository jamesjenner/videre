/*
 * mapPath.js
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


function MapPath(options) {
    options = options || {};
    
    this.vehicleId = options.vehicleId || '';
    this.vehicleName = options.vehicelName || '';
    this.vehicle = options.vehicle || null;
    
    this.markers = new Array();
    this.polyLine = options.polyLine || null;
    
    this.map = options.map || null;

    this.layerGroup = options.layerGroup || new L.layerGroup();
    
    if(this.map) {
        this.layerGroup.addTo(this.map);
        
        if(this.polyLine) {
            this.polyLine.addTo(this.layerGroup);
        }
    }
    
    this.selected = options.selected || false;
}

/*
 * add a marker
 */
MapPath.prototype.addMarker = function(marker) {
    this.markers.push(marker);
    marker.addTo(this.layerGroup);
}

/*
 * insert a marker
 */
MapPath.prototype.insertMarker = function(idx, marker) {
    this.markers.splice(idx, 0, marker);
    marker.addTo(this.layerGroup);
}

/*
 * remove a marker
 */
MapPath.prototype.removeMarker = function(idx) {
    this.layerGroup.removeLayer(this.markers[idx - 1]);
    this.markers.splice(idx - 1, 1);
}

/*
 * get the markers
 */
MapPath.prototype.getMarkers = function() {
    return this.markers;
}

/*
 * set the poly line
 */
MapPath.prototype.setPolyLine = function(polyLine) {
    this.polyLine = polyLine;
    if(this.layerGroup) {
        this.polyLine.addTo(this.layerGroup);
    }
}

/*
 * get the poly line
 */
MapPath.prototype.getPolyLine = function() {
    return this.polyLine;
}


/*
 * select the path
 */
MapPath.prototype.select = function() {
    this.selected = true;
}

/*
 * deselect the path
 */
MapPath.prototype.deselect = function() {
    this.selected = false;
}

/*
 * set whether the path is selected
 */
MapPath.prototype.setSelected = function(selected) {
    this.selected = selected; 
}

/*
 * request whether the path is selected or not
 */
MapPath.prototype.isSelected = function() {
    return this.selected;
}