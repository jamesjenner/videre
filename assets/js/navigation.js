/*
 * navigation.js
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



Navigation.VEHICLE_ICON_CLASS = 'vehicleIcon';
Navigation.AIRPLANE_MAP_ICON = 'assets/icons/airplane.png';

Navigation.VEHICLE_DELETE_PATH = "menuVehicleDeletePath";
Navigation.VEHICLE_EDIT_PATH = "menuVehicleEditPath";
Navigation.VEHICLE_TOGGLE_DIR = "menuVehicleToggleDirection";
Navigation.VEHICLE_RETURN_TO_BASE = "menuVehicleReturnToBase";
Navigation.VEHICLE_COMPLETE = "menuVehicleComplete";

Navigation.POINT_PROPERTIES = "menuPointNavPointProperties";
Navigation.POINT_DELETE = "menuPointDeleteNavPoint";
Navigation.POINT_INSERT_BEFORE = "menuPointInsertBefore";
Navigation.POINT_INSERT_AFTER = "menuPointInsertAfter";
Navigation.POINT_LOITER_TOGGLE = "menuPointLoiterToggle";
Navigation.POINT_RETURN_TO_BASE = "menuPointReturnToBase";
Navigation.POINT_TERMINUS_TOGGLE = "menuPointTerminusToggle";

Navigation.MODE_NO_ACTION = 0;
Navigation.MODE_APPEND = 1;
Navigation.MODE_INSERT_BEFORE = 2;
Navigation.MODE_INSERT_AFTER = 3;

Navigation.NUMBER_ICON_URL = 'assets/img/number-icon.png';
Navigation.PATROL_ICON_URL = 'assets/img/patrol-icon.png';
Navigation.FINISH_ICON_URL = 'assets/img/finish-icon.png';
Navigation.FINISH_PATROL_ICON_URL = 'assets/img/finish-patrol-icon.png';


function Navigation(options) {
    options = options || {};
    
    this.vehicleMenuId = options.vehicleMenuId || 'navigationMapMenu';
    this.pointMenuId = options.pointMenuId || 'navigationPointMenu';
    this.vehicleMenuItemListener = options.vehicleMenuItemListener || function() {};
    this.pointMenuItemListener = options.pointMenuItemListener || function() {};
    
    this.pathOpacity = options.pathOpacity || 0.75;
    
    this.remoteVehicles = options.remoteVehicles;
    this.servers = options.servers || new Array();
    this.localVehicles = options.localVehicles || new Array();
    
    this.flightPathColor = options.flightPathColor || 'red';
    this.navPathColor = options.navPathColor || 'blue';
    this.navSelectedPathColor = options.navSelectedPathColor || 'orange';
    
    this.mapTouchMode = Navigation.MODE_NO_ACTION;
    this.selectedVehicle = null;
    
    this.mapquestOsmTileUrl = 'http://otile{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png';
    this.mapquestOsmAttribution = "Data CC-By-SA by <a href='http://openstreetmap.org/' target='_blank'>OpenStreetMap</a>, Tiles Courtesy of <a href='http://open.mapquest.com' target='_blank'>MapQuest</a>";
  
    this.opencyclemapLandscapeUrl = 'http://{s}.tile3.opencyclemap.org/landscape/{z}/{x}/{y}.png';
    this.opencyclemapLandscapeAttribution = '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>';
        
    this.esriWorldTopographicalUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    this.esriWorldTopographicalAttribution = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community';
    
    this.esriWorldImageryUrl = 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    this.esriWorldImageryAttribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
  
    this.cloudmadeTilesUrl = 'http://{s}.tile.cloudmade.com/21AE2933E8054FF8b90A537357289E78/{styleId}/256/{z}/{x}/{y}.png';
    this.cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade';
  
    this.esriWorldImageryTileLayer = new L.TileLayer(this.esriWorldImageryUrl, {maxZoom: 18, attribution: this.esriWorldImageryAttribution,subdomains: ['1', '2', '3', '4']});
    this.esriWorldTopographicalTileLayer = new L.TileLayer(this.esriWorldTopographicalUrl, {maxZoom: 18, attribution: this.esriWorldTopographicalAttribution,subdomains: ['1', '2', '3', '4']});
    this.esriWorldTopographicalTileLayer2 = new L.TileLayer(this.esriWorldTopographicalUrl, {maxZoom: 18, attribution: this.esriWorldTopographicalAttribution,subdomains: ['1', '2', '3', '4']});
  
    this.mapquestOsmTileLayer = new L.TileLayer(this.mapquestOsmTileUrl, {maxZoom: 18, attribution: this.mapquestOsmAttribution, subdomains: ['1', '2', '3', '4']});
    
    this.minimal   = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 22677, attribution: this.cloudmadeAttribution});
    this.fresh  = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 997, attribution: this.cloudmadeAttribution});
    this.midnightCommander  = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 999, attribution: this.cloudmadeAttribution});
    this.nightVision  = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 78125, attribution: this.cloudmadeAttribution});
    this.minimalMarkers = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 63044, attribution: this.cloudmadeAttribution});
    
    var that = this;
    
    L.Icon.Default.imagePath = options.imagePath || 'assets/img/';
    
    this.mapLayers = options.mapLayers ||  {
        "Cloudmade Fresh": this.fresh,
        "Cloudmade Minimal": this.minimal,
        "Cloudmade Minimal 2": this.minimalMarkers,
        "Cloudmade Night Vision": this.nightVision,
        "Cloudmade Night View": this.midnightCommander,
        "Map Quest Street": this.mapquestOsmTileLayer,
        "ESRI World Imagery": this.esriWorldImageryTileLayer,
        "ESRI World Topographical": this.esriWorldTopographicalTileLayer
    };
    
    this.map = options.map || new L.Map('navigationMap', {
        center: [-27.632600, 153.146466],
        zoom: 14,
        layers: [this.mapquestOsmTileLayer],
        zoomControl: false
    });

    L.control.layers(this.mapLayers).addTo(this.map);
    
    L.control.scale().addTo(this.map);
    
    // add all the vehicles...
    this._addVehiclesToMap();
    
    // this.vehicleMenu = new RadialMenu(this.vehicleMenuId, {selectionListener: this.vehicleMenuItemListener});
    // this.pointMenu = new RadialMenu(this.pointMenuId, {selectionListener: this.pointMenuItemListener});
    
    this.vehicleMenu = new RadialMenu(this.vehicleMenuId, {selectionListener: function(e) {that._vehicleMenuItemSelected(e, that); }});
    this.pointMenu = new RadialMenu(this.pointMenuId, {selectionListener: function(e) {that._pointMenuItemSelected(e, that); }});

    this.map.on('click', function(e) {that._onNavigationMapClick(e, that); });
}

Navigation.prototype.addVehicle = function(vehicle) {
    // add a vehicle and it's associated path to the map
}

Navigation.prototype.removeVehicle = function(vehicle) {
    // remove a vehicle and it's associated path from the map
    
}

Navigation.prototype.removeAllVehicles = function() {
    // remove all vehicles from the map
    this.vehicles = null;
    
}

Navigation.prototype.setVehicles = function(vehicles) {
    // set the vehicles to the passed vehicle list, this removes existing vehicles
    this.vehicles = vehicles;
}

Navigation.prototype._addVehiclesToMap = function() {
    // iterate through all the vehicles
    
    // iterate through the servers and then the vehicles for each server
    
    // iterate through the local vehicles
    for(var i = 0, l = this.servers.length; i < l; i++) {
        for(var i2 = 0, l2 = this.remoteVehicles[this.servers[i].name].length; i2 < l2; i2++) {
            this._addVehicleIcon(this.remoteVehicles[this.servers[i].name][i2]);
        }
    }
    
    for(var i = 0, l = this.localVehicles.length; i < l; i++) {
        // add the vehicle icon
        this._addVehicleIcon(this.localVehicles[i]);
        
        // add the navigation path
        // this._addNavPath();
        
        // add the actual path
        // this._addActualPath();
    }
    /*
    this._addNavPath(new Array(
        [-27.62531, 153.14351],
        [-27.61957, 153.15287],
        [-27.62499, 153.16169],
        [-27.63523, 153.16038],
        [-27.63252, 153.14302]), true);
        */
}

Navigation.prototype._addVehicleIcon = function(vehicle, position) {
    var that = this;
    // add the vehicle icon to the map
    var vehicleIcon = L.icon({iconUrl: Navigation.AIRPLANE_MAP_ICON, iconAnchor: [21, 21]});
    
    // use the div icon so we can rotate it based on the custom class
    var vehicleIconDiv = L.divIcon({className: Navigation.VEHICLE_ICON_CLASS, iconAnchor: [17, 21], iconSize: [35, 42]});
    
    var vehicleMarker = L.marker([-27.61657, 153.15387], {
        icon: vehicleIconDiv,
//         vehicle: vehicle,
        })
        .addTo(this.map)
        .on('click', function(e) {that._onVehicleMarkerClick(e, that, vehicle); });
    
    /* rotate the vehicle icon...
    var vehicleIconElement = $("." + Navigation.VEHICLE_ICON_CLASS);
    
    var currentTransform = vehicleIconElement.css("-webkit-transform");
    
    // vehicleIconElement.css("-webkit-transform", "rotate(30deg)");
    
    // get the transform matrix
    var t = _T.fromString(vehicleIconElement.css('-webkit-transform'));
    // create a rotate matrix
    var r = _T.rotate(50);
    // multiply the two matrixes together
    var n = t.x(r);
    
    // apply the new matrix
    vehicleIconElement.css({
    '-webkit-transform': _T.toString(n)
    });
    */
 }

Navigation.prototype._loadNavPath = function(vehicle, navGroup, polyLine, vehicleSelected, that) {
}

Navigation.prototype._markerDragged = function (e, that) {
    var newPoint = e.target.getLatLng();
    
    for(var pos = 0, l = that.currentMapPath.markers.length; pos < l; pos++) {
        if(that.currentMapPath.markers[pos] === e.target) {
            break;
        }
    }
    
    // need to add 1 as the first point is the vehicle, while the mapPath doesn't include the vehicle
    pos++;
    
    // retreive the point on the path for the current position and the home point
    var point = that.selectedVehicle.navigationPath.getPoint(pos);
    
    point.position.latitude = newPoint.lat;
    point.position.longitude = newPoint.lng;
    
    // presume that only the last point can return home
    if(point.returnHome) {
        var homePoint = that.selectedVehicle.navigationPath.getPoint(0);
        
        // need to update the return home path as well
        that.currentMapPath.returnHomePolyLine.setLatLngs(
            [[point.position.latitude, point.position.longitude],
             [homePoint.position.latitude, homePoint.position.longitude]]);
    }
    
    // update the whole poly line, we could use splice to replace the point in question. TODO: test which is more efficient, suspect they are the same
    that.currentMapPath.polyLine.setLatLngs(that.selectedVehicle.navigationPath.toArray());
}

Navigation.prototype._addActualPath = function(points) {
    var that = this;
    /*
    // add the flight path points to the map
    this.flightPathPoints = new Array(
        [-27.62531, 153.14351],
        [-27.62297, 153.14487],
        [-27.62057, 153.14587],
        [-27.61857, 153.14687],
        [-27.61657, 153.14787],
        [-27.61557, 153.14887],
        [-27.61457, 153.14987],
        [-27.61427, 153.15087],
        [-27.61457, 153.15187],
        [-27.61557, 153.15287],
        [-27.61657, 153.15387]);
    */
    var flightPathPolyLine = L.polyline(this.flightPathPoints, {color: this.flightPathColor})
        .addTo(this.map)
        .on('click', function(e) {that._onFlightPathClick(e, that); });
}


    /*
     *e.latlng.lat, e.latlng.lng
    var popup2 = L.popup();
    popup2
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(this.map);
        */



Navigation.prototype._onNavigationMapClick = function(e, that) {
    // if a menu is open, treat the click on the map as a request to close the menu
    if(that.pointMenu.isActive()) {
        that.pointMenu.hideMenu();
        return;
    }
    if(that.vehicleMenu.isActive()) {
        that.vehicleMenu.hideMenu();
        return;
    }
    
    switch(that.mapTouchMode) {
        case Navigation.MODE_APPEND:
            // add a new nav point based on the current co-ords
            if(that.selectedVehicle) {
                that._appendPoint(e, that, true);
            }
            break;
        
        case Navigation.MODE_INSERT_BEFORE:
        case Navigation.MODE_INSERT_AFTER:
            // insert a new point between the current and next points, at the current co-ords
            if(that.selectedVehicle.navigationPath.length() == that.mapInsertPoint || that.selectedVehicle.navigationPath.isEmpty()) {
                // insert point is after the last point so change to append mode and append
                that.mapTouchMode = Navigation.MODE_APPEND;
                that._appendPoint(e, that, true);
            } else {
                // insert the point
                that._insertPoint(e, that, that.mapInsertPoint, true);
                
                // increment the insert point if inserting after
                if(that.mapTouchMode === Navigation.MODE_INSERT_AFTER) {
                    that.mapInsertPoint++;
                }
            }
            
            break;
    }
}

Navigation.prototype._appendPoint = function(e, that, selected) {
    // if the navigation path is empty then we need to add the vehicle base position
    if(that.selectedVehicle.navigationPath.isEmpty()) {
        // TODO: when adding vehicle is sorted, make this point the vehicle point
        console.log("setting start pos at " + -27.61657 + ', ' + 153.15387);
        that.selectedVehicle.navigationPath.append(-27.61657, 153.15387);
        that.prevLatLng = new L.LatLng(-27.61657, 153.15387);
    }
    
    // setup the previous point if required
    if(!that.prevLatLng) {
        // set to the last point on the path
        var point = that.selectedVehicle.navigationPath.getPoint(that.selectedVehicle.navigationPath.length() - 1);
        that.prevLatLng = new L.LatLng(point.position.latitude, point.position.longitude);
    }
    
    // append the point to the vehicle's navigation path
    console.log("appending point at " + e.latlng.toString());
    
    // TODO: add options for default settings on append
    that.selectedVehicle.navigationPath.append(e.latlng.lat, e.latlng.lng);
    
    // add the point to the map
    that.currentMapPath = that._addNavPoint(that.currentMapPath, that.prevLatLng, e.latlng, that.selectedVehicle.navigationPath.length() - 1, selected);
    that.prevLatLng = e.latlng;
}

Navigation.prototype._insertPoint = function(e, that, position, selected) {
    // the previous point is based on the position. the insert is between the position and the position + 1
    console.log("inserting point at " + e.latlng.toString());

    // TODO: add options for default settings on insert
    that.selectedVehicle.navigationPath.insert(position + 1, e.latlng.lat, e.latlng.lng);
    
    // insert the point to the map
    that._insertNavPoint(that, that.currentMapPath, e.latlng, position + 1, selected);
    that.prevLatLng = e.latlng;
    
    // re-number the points after the inserted point
    that._renumberMarkers(position, that, Navigation.RENUMBER_FROM_END, +1);
}

Navigation.RENUMBER_TO_END = -1;
Navigation.RENUMBER_FROM_END = +1;

// TODO: this should be updated to include adding points for actual path as well as nav path
Navigation.prototype._addNavPoint = function(mapPath, fromPoint, toPoint, position, vehicleSelected) {
    vehicleSelected = ((vehicleSelected != null) ? vehicleSelected : false);
    var that = this;

    if(!mapPath) {
        // we're starting out, so set the poly line based on the from and to points
        var polyLine = L.polyline([fromPoint, toPoint], {color: this.navPathColor});
        
        mapPath = new MapPath({map: this.map, polyLine: polyLine});
    } else {
        mapPath.polyLine.spliceLatLngs(position, 0, toPoint);
    }
    
    // add a marker for the point when the vehicle is selected
    if(vehicleSelected) {
        var marker = L.marker(toPoint, {
            icon: new L.NumberedDivIcon({idPrefix: that.selectedVehicle.id + '_marker_', number: position+''}),
            draggable: true,
            opacity: this.pathOpacity})
            .on('drag', function(e) {that._markerDragged(e, that);})
            .on('click', function(e) {that._onNavigationPointClick(e, that); });
    
        // this appends a marker, it doesn't insert
        mapPath.addMarker(marker);
    }
    
    return mapPath;
}

Navigation.prototype._insertNavPoint = function(that, mapPath, point, position, vehicleSelected) {
    vehicleSelected = ((vehicleSelected != null) ? vehicleSelected : false);

    mapPath.polyLine.spliceLatLngs(position, 0, point);
    
    // add a marker for the point when the vehicle is selected
    if(vehicleSelected) {
        var marker = L.marker(point, {
            icon: new L.NumberedDivIcon({idPrefix: that.selectedVehicle.id + '_marker_', number: position+''}),
            draggable: true,
            opacity: this.pathOpacity})
            .on('drag', function(e) {that._markerDragged(e, that);})
            .on('click', function(e) {that._onNavigationPointClick(e, that); });
    
        // map path starts from 1 less than the polyline, as there is no marker at the start
        mapPath.insertMarker(position - 1, marker);
    }
}

Navigation.prototype._onVehicleMarkerClick = function(e, that, vehicle) {
    console.log("vehicle clicked");
    
    // TODO: select the vehicle, allow options to go to: just show that vehicle, go to vehicle, centre on vehicle, zoom to vehicles flight path, etc
    
    if(that.vehicleMenu.isActive()) {
        that.vehicleMenu.hideMenu();
        return;
    }

    if(that.pointMenu.isActive()) {
        that.pointMenu.hideMenu();
        return;
    }

    // auto select the current vehicle, if already selected then unselect
    if(that.selectedVehicle && that.selectedVehicle.id == vehicle.id) {
        
        // TODO: try: if selected and menu not displayed then display menu, perhaps tap and hold should be display menu, while tap is toggle?
        
        
        // when selected then we are in edit mode, so unselect
        that.selectedVehicle = null;
        
        // change the colour of the icon to deselected
        
        // change the colour of the path to deselected
        
    } else {
        // determine the vehicle and then set it selected
        that.selectedVehicle = vehicle;
        
        if(vehicle.navigationPath.isEmpty()) {
            // if there is no navigation path then go into append mode
            that.mapTouchMode = Navigation.MODE_APPEND;
        } else {
            // otherwise show the menu
            that.vehicleMenu.displayMenu(e.originalEvent.clientY, e.originalEvent.clientX);
        }
    }
    
    // note that the offset due to the action bar requires an adjustment to y by -40
    // vehicleMenu.displayMenu(e.containerPoint.y + 40, e.containerPoint.x);
}
  
Navigation.prototype._onNavigationPointClick = function(e, that) {
    // determine which marker position was dragged
    for(var pos = 0, l = that.currentMapPath.markers.length; pos < l; pos++) {
        if(that.currentMapPath.markers[pos] === e.target) {
            break;
        }
    }
    
    // need to add 1 as the first point is the vehicle, while the mapPath doesn't include the vehicle
    pos++;

    // if a menu is open, treat the click on a point as a request to close the menu
    if(that.vehicleMenu.isActive()) {
        that.vehicleMenu.hideMenu();
        return;
    }

    if(that.pointMenu.isActive()) {
        that.pointMenu.hideMenu();
        return;
    }
    
    // reset the listener so that the correct position is used
    that.pointMenu.setListener(function(e) {
        that._pointMenuItemSelected(e, that, pos);
    });
    
    // this.pointMenu.displayMenu(e.containerPoint.y + 40, e.containerPoint.x);
    that.pointMenu.displayMenu(e.originalEvent.clientY, e.originalEvent.clientX);
    
    // TODO: add options to remove point, remove flight path, append point, prepend point, set altitude, set speed, toggle patrol, set patrol duration
    console.log("navigation point clicked");
}
  
  // TODO: not working, but beleive that the dev branch of leaflet supports it
Navigation.prototype._onFlightPathClick = function(e) {
    console.log("navigation path clicked");
}

Navigation.prototype._vehicleMenuItemSelected = function(e, that) {
    // selected an option on the menu, so lets hide the menu
    that.vehicleMenu.hideMenu();

    switch(e.originalEvent.currentTarget.id) {
        case(Navigation.VEHICLE_DELETE_PATH):
            // remove the path (if there is a path for the vehicle)
            
            break;

        case(Navigation.VEHICLE_EDIT_PATH):
            // change the colour of the vehicle to selected
            // change the colour of the path to selected
            // draw the points for the path
            // change to edit mode
            that.mapTouchMode = Navigation.MODE_APPEND;
            break;

        case(Navigation.VEHICLE_TOGGLE_DIR):
            // change the direction/order of the path
            break;

        case(Navigation.VEHICLE_RETURN_TO_BASE):
            // complete path by adding a path between the last point and the base (only to be done if path is not complete)
            break;

        case(Navigation.VEHICLE_COMPLETE):
            // change the path to complete, making the last point the finishing point (only to be done if path is not complete)
            break;
    }
  
    return false;
}

Navigation.prototype._renumberMarkers = function(position, that, direction, adjustment) {
    if(direction == Navigation.RENUMBER_TO_END) {
        // iterate through the positions from position to the end and reset the number 
        for(var i = position, l = that.currentMapPath.markers.length + 1; i <= l; i++) {
            that._updateMarkerPosition(i, i + adjustment, that);
        }
    } else {
        // iterate through the positions from the end to position and reset the number 
        for(var i = that.currentMapPath.markers.length + 1, l = position; i > l; i--) {
            that._updateMarkerPosition(i, i + adjustment, that);
        }
    }
}

Navigation.prototype._updateMarkerPosition = function(currentVal, newVal, that) {
    // get the div container that holds the number
    var numberDiv =  $('#' + that.selectedVehicle.id + '_marker_' + currentVal);
    // reset the number down by 1
    numberDiv.text((newVal) +'');
    // reset the div id as well, as the div refers to it's position to be unique
    numberDiv.attr('id', that.selectedVehicle.id + '_marker_' + (newVal));
}

Navigation.prototype._pointMenuItemSelected = function(e, that, position) {
    that.pointMenu.hideMenu();
    
    switch(e.originalEvent.currentTarget.id) {
        
        case(Navigation.POINT_PROPERTIES):
            // edit the properties of the point
            // TODO: implement point properties editing
            showNavPointForm(that.selectedVehicle.navigationPath.getPoint(position));
            break;
        
        case(Navigation.POINT_DELETE):
            that._deletePoint(that, position);
            break;
        
        case(Navigation.POINT_INSERT_BEFORE):
            // insert between the current and the previous progresisvely
            that.mapTouchMode = Navigation.MODE_INSERT_BEFORE;
            that.mapInsertPoint = position - 1;
            break;
        
        case(Navigation.POINT_INSERT_AFTER):
            that._pointInsertAfter(that, position);
            break;
        
        case(Navigation.POINT_LOITER_TOGGLE):
            // toggle loiter for the point
            that._loiterToggle(that, position);
            break;
        
        case(Navigation.POINT_RETURN_TO_BASE):
            // set the path to complete and the current point to return to base afterwards
            that._returnHomeToggle(that, position);
            break;
        
        case(Navigation.POINT_TERMINUS_TOGGLE):
            // set the path to complete and the current point as the final point
            that._toggleTerminus(that, position);
            break;
    }
  
    return false;
}

Navigation.prototype._deletePoint = function(that, position) {
    // if we're the last point then we need to do some special checks
    if(position + 1 == that.selectedVehicle.navigationPath.length()) {
        // get the last point
        var p = that.selectedVehicle.navigationPath.getPoint(position);
        
        if(p.terminus) {
            // we are a terminus point so change the terminus flag
            that._toggleTerminus(that, position);
        }
        if(p.returnHome) {
            // we are a return home point so change the return home flag
            that._returnHomeToggle(that, position);
        }
        // go to append mode
        that.mapTouchMode = Navigation.MODE_APPEND;
    }

    // remove the point from the vehicle nav path
    that.selectedVehicle.navigationPath.delete(position);

    // remove the marker
    that.currentMapPath.removeMarker(position);
    
    // remove the point from the polyline
    that.currentMapPath.polyLine.spliceLatLngs(position, 1);

    // renumber the markers, reducing the count by 1
    that._renumberMarkers(position + 1, that, Navigation.RENUMBER_TO_END, -1);
    
    // reset touch mode
    that.mapTouchMode = that._getMapTouchModeForCurrentPath(that);
}

Navigation.prototype._pointInsertAfter = function(that, position) {
    // if we're the last point then we need to do some special checks
    if(position + 1 == that.selectedVehicle.navigationPath.length()) {
        // get the last point
        var p = that.selectedVehicle.navigationPath.getPoint(position);
        
        if(p.terminus) {
            // we are a terminus point so change the terminus flag
            that._toggleTerminus(that, position);
        }
        if(p.returnHome) {
            // we are a return home point so change the return home flag
            that._returnHomeToggle(that, position);
        }
        // go to append mode
        that.mapTouchMode = Navigation.MODE_APPEND;
    } else {
        // insert after the current point
        that.mapTouchMode = Navigation.MODE_INSERT_AFTER;
        that.mapInsertPoint = position;
    }
}

Navigation.prototype._toggleTerminus = function(that, position) {
    // nav path includes start point, but position doesn't
    // do nothing if not the last point
    if(position + 1 < that.selectedVehicle.navigationPath.length()) {
        return;
    }
    
    // retreive the point on the path for the vehicle
    var p = that.selectedVehicle.navigationPath.getPoint(position);
    
    if(p.returnHome) {
        // we are a return home point so change the return home flag
        that._returnHomeToggle(that, position);
    }
    
    // update the flag for the nav path point
    p.terminus = !p.terminus;
    
    // update the touch mode for the point
    that.mapTouchMode = that._getTouchModeForPoint(p);
    
    // set the icon
    that.currentMapPath.setIcon(position, that._getIconForPoint(p, that));
}

Navigation.prototype._loiterToggle = function(that, position) {
    // retreive the point on the path for the vehicle
    var p = that.selectedVehicle.navigationPath.getPoint(position);
    
    // update the flag for the nav path point
    p.loiter = !p.loiter;

    // update the icon for the marker
    that.currentMapPath.setIcon(position, that._getIconForPoint(p, that));
}

Navigation.prototype._returnHomeToggle = function(that, position) {
    // do nothing if not the last point
    if(position + 1 < that.selectedVehicle.navigationPath.length()) {
        return;
    }

    // retreive the point on the path for the vehicle
    var lastPoint = that.selectedVehicle.navigationPath.getPoint(position);
    var homePoint = that.selectedVehicle.navigationPath.getPoint(0);

    if(lastPoint.terminus) {
        // we are a terminus point so change the terminus flag
        that._toggleTerminus(that, position);
    }
    
    // update the flag for the nav path point
    lastPoint.returnHome = !lastPoint.returnHome;

    if(lastPoint.returnHome) {
        var polyline = L.polyline([[lastPoint.position.latitude, lastPoint.position.longitude],
                                   [homePoint.position.latitude, homePoint.position.longitude]],
                                  {color: this.navPathColor});
        that.currentMapPath.addReturnHomePolyLine(polyline);
    } else {
        that.currentMapPath.removeReturnHomePolyLine();
    }
    
    // update the touch mode for the point
    that.mapTouchMode = that._getTouchModeForPoint(lastPoint);
}

Navigation.prototype._getIconForPoint = function(point, that) {
    var icon = null;
    
    if(point.terminus) {
        if(point.loiter) {
            icon = that._createTerminusLoiterIcon(that.selectedVehicle.id, point.sequence);
        } else {
            icon = that._createTerminusIcon(that.selectedVehicle.id, point.sequence);
        }
    } else {
        if(point.loiter) {
            icon = that._createLoiterIcon(that.selectedVehicle.id, point.sequence);
        } else {
            icon = that._createNumberIcon(that.selectedVehicle.id, point.sequence);
        }
    }
    
    return icon;
}

Navigation.prototype._getMapTouchModeForCurrentPath = function(that) {
    // retreive the last point
    var p = that.selectedVehicle.navigationPath.getPoint(that.selectedVehicle.navigationPath.length() - 1);

    // check the status
    if(p.terminus || p.returnHome) {
        return Navigation.MODE_NO_ACTION;
    } else {
        return Navigation.MODE_APPEND;
    }
}

Navigation.prototype._getTouchModeForPoint = function(point) {
    if(point.terminus || point.returnHome) {
        return Navigation.MODE_NO_ACTION;
    } else {
        return Navigation.MODE_APPEND;
    }
}

Navigation.prototype._createNumberIcon = function(vehicleId, position) {
    return new L.NumberedDivIcon({
        idPrefix: vehicleId + '_marker_',
        number: position+'',
        iconSize: new L.Point(25, 41),
        iconAnchor: new L.Point(13, 41),
        iconUrl: Navigation.NUMBER_ICON_URL
        });
}

Navigation.prototype._createLoiterIcon = function(vehicleId, position) {
    return new L.NumberedDivIcon({
        idPrefix: vehicleId + '_marker_',
        number: position+'',
        iconSize: new L.Point(42, 41),
        iconAnchor: new L.Point(21, 41),
        iconUrl: Navigation.PATROL_ICON_URL,
        });
}

Navigation.prototype._createTerminusIcon = function(vehicleId, position) {
    return new L.NumberedDivIcon({
        idPrefix: vehicleId + '_marker_',
        number: position+'',
        iconSize: new L.Point(28, 41),
        iconAnchor: new L.Point(14, 41),
        iconUrl: Navigation.FINISH_ICON_URL,
        });
}

Navigation.prototype._createTerminusLoiterIcon = function(vehicleId, position) {
    return new L.NumberedDivIcon({
        idPrefix: vehicleId + '_marker_',
        number: position+'',
        iconSize: new L.Point(42, 41),
        iconAnchor: new L.Point(21, 41),
        iconUrl: Navigation.FINISH_PATROL_ICON_URL,
        });
}

// TODO: implement adding a path...
Navigation.prototype._addPath = function() {

}
