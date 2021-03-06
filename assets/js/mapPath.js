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
    
    this.markers = new Array();
    this.homeMarker = options.homeMarker || null;
    this.polyLine = options.polyLine || null;
    this.vehicleId = options.vehicleId || null;

    this.returnHomePolyLine = options.returnHomePolyLine || null;
    
    
    this.map = options.map || null;

    this.layerGroup = options.layerGroup || new L.layerGroup();
    
    if(this.map) {
        this.layerGroup.addTo(this.map);
        
        if(this.homeMarker) {
            this.homeMarker.addTo(this.layerGroup);
        }
        
        if(this.polyLine) {
            this.polyLine.addTo(this.layerGroup);
        }
        
        if(this.returnHomePolyLine) {
            this.returnHomePolyLine.addTo(this.layerGroup);
        }
    }
    
    this.selected = options.selected || false;
}

/*
 * get the lat/lngs as an array 
 */
MapPath.prototype.getLatLngs = function() {
    var latlngs = new Array();
    
    if(this.layerGroup) {
        if(this.polyLine) {
            latlngs.push(this.polyLine.getLatLngs());
        }
        if(this.returnHomePolyLine) {
            latlngs.push(this.returnHomePolyLine.getLatLngs());
        }

    }
    
    return latlngs;
}

/*
 * remove the group from the map
 */
MapPath.prototype.remove = function() {
    if(this.layerGroup) {
        this.map.removeLayer(this.layerGroup);
    }
}

/*
 * remove the paths
 */
MapPath.prototype.removePaths = function() {
    if(this.layerGroup) {
        if(this.polyLine) {
            this.layerGroup.removeLayer(this.polyLine);
        }
        if(this.returnHomePolyLine) {
            this.layerGroup.removeLayer(this.returnHomePolyLine);
        }
    }
}

/*
 * clear the paths
 */
MapPath.prototype.clearPaths = function() {
    if(this.layerGroup) {
        if(this.polyLine) {
            this.polyLine = L.Polyline([]);
        }
        if(this.returnHomePolyLine) {
            this.returnHomePolyLine = L.Polyline([]);
        }
    }
}

/*
 * remove the group from the map
 */
MapPath.prototype.add = function(map) {
    if(map) {
        if(!this.layerGroup) {
            this.layerGroup = new L.layerGroup();
            
            if(this.polyLine) {
                this.polyLine.addTo(this.layerGroup);
            }
            
            if(this.returnHomePolyLine) {
                this.returnHomePolyLine.addTo(this.layerGroup);
            }
            if(this.markers) {
                for(var i = 0, l = this.markers.length; i < l; i++) {
                    this.markers[i].addTo(this.layerGroup)
                }
            }
        }
            
        this.layerGroup.addTo(this.map);
    }
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
    this.layerGroup.removeLayer(this.markers[idx]);
    this.markers.splice(idx, 1);
}

/*
 * remove all markers
 */
MapPath.prototype.removeMarkers = function() {
    for(var i = 0, l = this.markers.length; i < l; i++) {
        this.layerGroup.removeLayer(this.markers[i]);
    }
    
    this.markers = new Array();
}

/*
 * set the colour of the path, options are:
 *
 *   stroke
 *   color
 *   weight
 *   opacity
 *   fill
 *   fillColor
 *   fillOpacity
 *   dashArray
 *
 *   refer http://leafletjs.com/reference.html#path-options
 */
MapPath.prototype.setPathStyle = function(style) {
    if(this.polyLine) {
        this.polyLine.setStyle(style);
    }
    if(this.returnHomePolyLine) {
        this.returnHomePolyLine.setStyle(style);
    }
}

/*
 * change the url of a marker
 */
MapPath.prototype.setIcon = function(idx, icon) {
    this.markers[idx].setIcon(icon);
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

    // remove it if it exists
    if(this.polyLine && this.layerGroup) {
        this.layerGroup.removeLayer(this.polyLine);
    }
    
    this.polyLine = polyLine;

    // add the poly line    
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
 * add the return home poly line
 */
MapPath.prototype.addReturnHomePolyLine = function(polyLine) {
    
    if(this.returnHomePolyLine) {
        this.removeReturnHomePolyLine();
    }
    
    this.returnHomePolyLine = polyLine;
    
    if(this.layerGroup) {
        this.returnHomePolyLine.addTo(this.layerGroup);
    }
}

/*
 * remove the return home poly line
 */
MapPath.prototype.removeReturnHomePolyLine = function() {
    if(this.layerGroup && this.returnHomePolyLine) {
        this.layerGroup.removeLayer(this.returnHomePolyLine);
        this.returnHomePolyLine = null;
    }
}

/*
 * get the return home poly line
 */
MapPath.prototype.getReturnHomePolyLine = function() {
    return this.returnHomePolyLine;
}


/*
 * select the path
 */
MapPath.prototype.select = function() {
    this.selected = true;

    if(this.vehicleId) {
        for(var i = 0, l = this.markers.length; i < l; i++) {
            var obj = $('#div_' + this.vehicleId + '_marker_' + i);
            obj.css('-webkit-filter', 'grayscale(0)');
            this.markers[i].dragging.enable();
        }
    }
}

/*
 * deselect the path
 */
MapPath.prototype.deselect = function() {
    this.selected = false;
    
    if(this.vehicleId) {
        for(var i = 0, l = this.markers.length; i < l; i++) {
            var obj = $('#div_' + this.vehicleId + '_marker_' + i);
            obj.css('-webkit-filter', 'grayscale(1)');
            this.markers[i].dragging.disable();
        }
    }
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