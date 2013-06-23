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

Navigation.HOME_ICON_CLASS = 'homeMapIcon';
Navigation.DIRECTION_ICON_CLASS = 'directionMapIcon';
Navigation.DIRECTION_ICON = 'assets/icons/drawable-xhdpi-v11/ic_action_direction.png';
Navigation.DIRECTION_ICON_INVERSE = 'assets/icons/drawable-xhdpi-v11/ic_action_direction_inverse.png';
Navigation.DIRECTION_ICON_SELECTED = 'assets/icons/drawable-xhdpi-v11/ic_action_direction_selected.png';
Navigation.DONE_ICON = 'assets/img/done.png';
Navigation.TARGET_ICON = 'assets/img/target.png';
Navigation.DONE_ICON = 'assets/img/done.png';
Navigation.MAP_ICON_32_32 = 'MapIcon32x32';

Navigation.AIRPLANE_ICON_CLASS = 'airplaneMapIcon';
Navigation.SURFACE_ICON_CLASS = 'surfaceMapIcon';
Navigation.SUBMERSIBLE_ICON_CLASS = 'submersibleMapIcon';

Navigation.POINT_PROPERTIES = "menuPointNavPointProperties";
Navigation.POINT_DELETE = "menuPointDeleteNavPoint";
Navigation.POINT_INSERT_BEFORE = "menuPointInsertBefore";
Navigation.POINT_INSERT_AFTER = "menuPointInsertAfter";
Navigation.POINT_LOITER_TOGGLE = "menuPointLoiterToggle";
Navigation.POINT_RETURN_TO_BASE = "menuPointReturnToBase";
Navigation.POINT_TERMINUS_TOGGLE = "menuPointTerminusToggle";

Navigation.POINT_TARGET_WAYPOINT = "menuPointTargetWaypoint";
Navigation.POINT_SELECT_VEHICLE = "menuPointSelectVehicle";

Navigation.VEHICLE_PROPERTIES = "menuVehicleProperties";
Navigation.VEHICLE_SELECT = "menuVehicleSelect";
Navigation.VEHICLE_DESELECT = "menuVehicleDeselect";
Navigation.VEHICLE_DELETE_PATH = "menuVehicleDeletePath";
Navigation.VEHICLE_REVERSE_DIRECTION = "menuVehicleReverseDirection";


Navigation.HOME_DELETE_PATH = "menuHomeDeletePath";
Navigation.HOME_REVERSE_DIRECTION = "menuHomeReverseDirection";

Navigation.MAP_SELECT_VEHICLE = "menuMapSelectVehicle";
Navigation.MAP_REFRESH = "menuMapRefresh";
Navigation.MAP_CLEAR_TRAILS = "menuMapClearTrails";
Navigation.MAP_ZOOM_TO_ALL_VEHICLES = "menuMapZoomToVehicles";
// Navigation.MAP_ZOOM_TO_SELECTED_VEHICLE = "menuMapZoomSelectedVehicle";
Navigation.MAP_DESELECT_VEHICLE = "menuMapDeselectVehicle";

Navigation.MODE_NO_ACTION = 0;
Navigation.MODE_APPEND = 1;
Navigation.MODE_INSERT_BEFORE = 2;
Navigation.MODE_INSERT_AFTER = 3;

Navigation.NUMBER_ICON_URL = 'assets/img/number-icon.png';
Navigation.PATROL_ICON_URL = 'assets/img/patrol-icon.png';
Navigation.FINISH_ICON_URL = 'assets/img/finish-icon.png';
Navigation.FINISH_PATROL_ICON_URL = 'assets/img/finish-patrol-icon.png';

Navigation.MAP_STYLE_FRESH = 0;
Navigation.MAP_STYLE_MINIMAL = 1;
Navigation.MAP_STYLE_MINMAL2 = 2;
Navigation.MAP_STYLE_NIGHT_VISION = 3;
Navigation.MAP_STYLE_NIGHT_VIEW = 4;
Navigation.MAP_STYLE_STREETS = 5;
Navigation.MAP_STYLE_SATELITE = 6;
Navigation.MAP_STYLE_TOPOGRAPHICAL = 7;

Navigation.RENUMBER_TO_END = -1;
Navigation.RENUMBER_FROM_END = +1;

function Navigation(options) {
    options = options || {};
    
    this.mapMenuId = options.mapMenuId || 'navigationMapMenu';
    this.vehicleMenuId = options.vehicleMenuId || 'navigationVehicleMenu';
    this.homeMenuId = options.homeMenuId || 'navigationHomeMenu';
    this.pointEditingMenuId = options.pointEditingMenuId || 'navigationPointMenu';
    this.pointNonEditingMenuId = options.pointNonEditingMenuId || 'navigationNonEditingPointMenu';
    // TODO: remove the following listeners? They appear not to be used
    this.vehicleMenuItemListener = options.vehicleMenuItemListener || function() {};
    this.pointEditingMenuItemListener = options.pointEditingMenuItemListener || function() {};
    
    this.preferences = ((options.preferences != undefined) ? options.preferences : new Preferences());
    
    this.pathOpacity = options.pathOpacity || 0.75;
    
    this.remoteVehicles = new Array();
    this.servers = options.servers || new Array();
    this.localVehicles = options.localVehicles || new Array();
    
    this.flightPathColor = options.flightPathColor || 'red';
    this.flightPathOpacity = options.flightPathOpacity || 0.85;

    this.markerOpacity = options.markerOpacity || 0.75;
    
    this.navPathColor = options.navPathColor || 'darkGray';
    this.navPathOpacity = options.navPathOpacity || 0.75;
    this.navPathSelectedColor = options.navPathSelectedColor || '#4a95d1';
    this.navPathSelectedOpacity = options.navPathSelectedOpacity || 0.75;
    this.actualPathSelectedColor = options.actualPathSelectedColor || '#ff0066';
    this.actualPathSelectedOpacity = options.actualPathSelectedOpacity || 0.75;

    this.deselectedNavPathStyle = {color: this.navPathColor, opacity: this.navPathOpacity, clickable: false};
    this.selectedNavPathStyle = {color: this.navPathSelectedColor, opacity: this.navPathSelectedOpacity, clickable: false};
    this.actualPathStyle = {color: this.actualPathSelectedColor, opacity: this.navPathSelectedOpacity, clickable: false};

    this.clearFunction = options.clearFunction || function() {};
    this.setTargetWaypointFunction = options.setTargetWaypointFunction || function() {};
    
    
    this.navigationMapPaths = new Object();
    this.actualMapPaths = new Object();
    this.flightMapPaths = new Object();
    this.vehicleMarkers = new Object();
    this.vehicleTargetMarkers = new Object();
    this.vehicleDoneMarkers = new Object();
    
    this.mapTouchMode = Navigation.MODE_NO_ACTION;
    this.selectedVehicle = null;
    this.clickedVehicle = null;
    
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
  
    this.mapquestOsmTileLayer = new L.TileLayer(this.mapquestOsmTileUrl, {maxZoom: 18, attribution: this.mapquestOsmAttribution, subdomains: ['1', '2', '3', '4']});
    
    this.minimalLayer  = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 22677, attribution: this.cloudmadeAttribution});
    this.freshLayer = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 997, attribution: this.cloudmadeAttribution});
    this.midnightCommanderLayer  = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 999, attribution: this.cloudmadeAttribution});
    this.nightVisionLayer = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 78125, attribution: this.cloudmadeAttribution});
    this.minimalMarkersLayer = L.tileLayer(this.cloudmadeTilesUrl, {styleId: 63044, attribution: this.cloudmadeAttribution});
    
    var self = this;
    
    L.Icon.Default.imagePath = options.imagePath || 'assets/img/';
    
    this.mapLayers = options.mapLayers ||  [
      new MapLayer({title: "Fresh", description: 'Simplified streets view', tileSet: this.freshLayer}), 
      new MapLayer({title: "Minimal", description: 'Minimal streets view', tileSet: this.minimalLayer}),
      new MapLayer({title: "Minimal 2", description: 'Minimal streets view 2', tileSet: this.minimalMarkersLayer}),
      new MapLayer({title: "Night Vision", description: 'Red theme to reduce affect on vision at night', tileSet: this.nightVisionLayer}),
      new MapLayer({title: "Night View", description: 'Night theme, black and greenish', tileSet: this.midnightCommanderLayer}),
      new MapLayer({title: "Streets", description: 'Map Quest Street', tileSet: this.mapquestOsmTileLayer}),
      new MapLayer({title: "Satelite", description: 'ESRI World Imagery', tileSet: this.esriWorldImageryTileLayer}),
      new MapLayer({title: "Topographical", description: 'ESRI World Topographical', tileSet: this.esriWorldTopographicalTileLayer}),
    ];
      
    // TODO: sort out how the center is determined...
    this.map = options.map || new L.Map('navigationMap', {
        center: [-27.632600, 153.146466],
        zoom: 14,
        layers: [this.freshLayer],
        zoomControl: false
    });
    
    // TODO: add search option to find a location

    this.currentTileSet = this.freshLayer;
    
    L.control.scale().addTo(this.map);
    
    this.mapMenu = new RadialMenu(this.mapMenuId, {selectionListener: function(e) {self._mapMenuItemSelected(e, self); }});
    this.vehicleMenu = new RadialMenu(this.vehicleMenuId, {selectionListener: function(e) {self._vehicleMenuItemSelected(e, self); }});
    this.homeMenu = new RadialMenu(this.homeMenuId, {selectionListener: function(e) {self._homeMenuItemSelected(e, self); }});
    this.pointEditingMenu = new RadialMenu(this.pointEditingMenuId, {selectionListener: function(e) {self._pointEditingMenuItemSelected(e, self); }});
    this.pointNonEditingMenu = new RadialMenu(this.pointNonEditingMenuId, {selectionListener: function(e) {self._pointNonEditingMenuItemSelected(e, self); }});

    this.map.on('click', function(e) {self._onMapClick(e, self); });
}

Navigation.prototype.setPreferences = function(preferences) {
    this.preferences = preferences;
}

Navigation.prototype.getModifiedVehicles = function(preferences) {
    
}

Navigation.prototype.hideMenus = function() {
    var menuHidden = false;
    
    if(this.mapMenu.isActive()) {
        this.mapMenu.hideMenu();
        menuHidden = true;
    }
    
    if(this.pointEditingMenu.isActive()) {
        this.pointEditingMenu.hideMenu();
        menuHidden = true;
    }
    
    if(this.pointNonEditingMenu.isActive()) {
        this.pointNonEditingMenu.hideMenu();
        menuHidden = true;
    }
    
    if(this.vehicleMenu.isActive()) {
        this.vehicleMenu.hideMenu();
        menuHidden = true;
    }
    
    return menuHidden;
}

Navigation.prototype._checkVehicleExists = function(vehicle) {
    // TODO: should be supporting different servers... this will not
    var existingVehicle = null;
    
    // check if the remote vehicle exists
    for(var i = 0, l = this.remoteVehicles.length; i < l; i++) {
        if(this.remoteVehicles[i].id === vehicle.id) {
            existingVehicle = this.remoteVehicles[i];
            break;
        }
    }
    
    if(existingVehicle === null) {
        // we don't have it recorded so add it
        this.remoteVehicles.push(vehicle);
        
        // setup the actual path
        this.actualMapPaths[vehicle.id] = this._setupActualPath(vehicle);
        return false;
    }
    
    return true;
}

Navigation.prototype.setNavigationPath = function(vehicle, navigationPath) {
    var point = navigationPath.getPoint(0);
    vehicle.navigationPath = navigationPath;
    
    if(this._checkVehicleExists(vehicle)) {
        if(this.selectedVehicle && this.selectedVehicle.id == vehicle.id) {
            this.deselectVehicle();
        }
    
        // remove the nav path for the vehicle
        this.navigationMapPaths[vehicle.id].remove();
        
        // delete the map paths for the vehicle
        delete this.navigationMapPaths[vehicle.id];
    }
    
    this.navigationMapPaths[vehicle.id] = this._setupMapPath(navigationPath, vehicle, point.position.latitude, point.position.longitude, false, this.deselectedNavPathStyle);
    
    // draw the points for the path
    this._addMarkers(this.navigationMapPaths[vehicle.id], vehicle, this);
    
    // deselect the path
    this.navigationMapPaths[vehicle.id].deselect();
}

// TODO: look at adding a layer for vehicle positions, maybe it's not required...

Navigation.prototype.setVehicleLocation = function(vehicle, position) {

    latLng = new L.LatLng(position.latitude, position.longitude);

    var self = this;
    // test if the marker exists for the vehicle
    if(this.vehicleMarkers[vehicle.id]) {
        // it does, so update the position of the marker
        this.vehicleMarkers[vehicle.id].setLatLng(latLng);
    } else {
        // it doesn't, so create it at the position
        this.vehicleMarkers[vehicle.id] = new L.Marker(latLng, {
            icon: new L.AdvDivIcon({
                iconUrl: Navigation.DIRECTION_ICON_INVERSE,
                iconAnchor: [32, 32],
                iconSize: [64, 64],
                idPostfix: vehicle.id
            }),
            zIndexOffset: -100,
            draggable: false,
            opacity: self.markerOpacity})
            .on('click', function(e) {self._onVehicleMarkerClick(e, self, vehicle); });

        this.vehicleMarkers[vehicle.id].addTo(this.map);
    }

    if(this._checkVehicleExists(vehicle)) {
        // add the new location to the actual map path
        this.actualMapPaths[vehicle.id].polyLine.addLatLng(latLng);
    }
}

Navigation.prototype.setVehicleDirection = function(vehicle, direction) {
    // note, by default the icon points to east. so subtract 90. 0 is east 90 is south, 180 is west and 270 is north, note that -90 is also north
    var rotation = direction - 90;
    
    $('#innerDiv_' + vehicle.id).css('-webkit-transform', 'rotate(' + rotation + 'deg)');
}

Navigation.prototype.setTarget = function(vehicle, nbr) {
    var latLng = null;
    var point = null;
    // move the current target for the vehicle to the specified waypoint

    // get the lat lng of the path for the target, if no path then return
    if(vehicle.navigationPath.isEmpty()) {
        return;
    } else {
        var point = vehicle.navigationPath.getPoint(nbr);
        latLng = new L.LatLng(point.position.latitude, point.position.longitude)
    }
    
    // test if the target marker exists for the vehicle
    if(this.vehicleTargetMarkers[vehicle.id]) {
        // it does, so update the position of the marker
        this.vehicleTargetMarkers[vehicle.id].setLatLng(latLng);
    } else {
        // it doesn't, so create it at the specified position
        this.vehicleTargetMarkers[vehicle.id] = new L.Marker(latLng, {
            icon: new L.AdvDivIcon({
                iconUrl: Navigation.TARGET_ICON,
                iconClass: Navigation.MAP_ICON_32_32,
                iconAnchor: [16, 16],
                iconSize: [32, 32],
                idPostfix: "_target_" + vehicle.id
            }),
            zIndexOffset: -100,
            draggable: false,
            opacity: self.markerOpacity})
            .on('click', function(e) {self._onVehicleMarkerClick(e, self, vehicle); });

        this.vehicleTargetMarkers[vehicle.id].addTo(this.map);
    }
}

Navigation.prototype.setDone = function(vehicle, nbr) {
    // add a done icon for the specified waypoint
    
    // Navigation.DONE_ICON

    var latLng = null;
    var point = null;
    // move the current target for the vehicle to the specified waypoint

    // get the lat lng of the path for the target, if no path then return
    if(vehicle.navigationPath.isEmpty()) {
        return;
    } else {
        var point = vehicle.navigationPath.getPoint(nbr);
        latLng = new L.LatLng(point.position.latitude, point.position.longitude)
    }
    
    if(!this.vehicleDoneMarkers[vehicle.id]) {
        this.vehicleDoneMarkers[vehicle.id] = new Array();
    }
    
    // test if the done marker exists for the vehicle at the specified point
    if(this.vehicleDoneMarkers[vehicle.id][nbr]) {
        // it does, so update the position of the marker
        this.vehicleDoneMarkers[vehicle.id][nbr].setLatLng(latLng);
    } else {
        // it doesn't, so create it at the specified position
        this.vehicleDoneMarkers[vehicle.id][nbr] = new L.Marker(latLng, {
            icon: new L.AdvDivIcon({
                iconUrl: Navigation.DONE_ICON,
                iconClass: Navigation.MAP_ICON_32_32,
                iconAnchor: [16, 16],
                iconSize: [32, 32],
                idPostfix: "_done_" + vehicle.id + '_' + nbr
            }),
            zIndexOffset: -100,
            draggable: false,
            opacity: self.markerOpacity})
            .on('click', function(e) {self._onVehicleMarkerClick(e, self, vehicle); });

        this.vehicleDoneMarkers[vehicle.id][nbr].addTo(this.map);
    }
}

Navigation.prototype.selectVehicle = function(vehicle) {
    // TODO: change the colour of the vehicle to selected (possibly not required)
    
    // if a vehicle is selected then deselect it before selecting this one
    if(this.selectedVehicle) {
        this.deselectVehicle();
    }
    
    this.selectedVehicle = vehicle;
    
    // allocate the current map path to the selected map path
    this.currentMapPath = this.navigationMapPaths[this.selectedVehicle.id];
    
    if(this.currentMapPath) {
        // change the colour of the path to selected
        this.currentMapPath.setPathStyle(this.selectedNavPathStyle);

        // select the path
        this.currentMapPath.select();
    }
    
    // set vehicle marker to selected
    var obj = $('#img_' + vehicle.id);
    obj.attr('src', Navigation.DIRECTION_ICON_SELECTED);
    
    if(this.selectedVehicle.navigationPath.isEmpty() || !this.selectedVehicle.navigationPath.complete()) {
        // path is either empty or not complete, so go to append mode
        this.mapTouchMode = Navigation.MODE_APPEND;
    } else {
        // path is complete, so no action mode
        this.mapTouchMode = Navigation.MODE_NO_ACTION;
    }
    
    // clear out the prevLatLng
    this.prevLatLng = null;
}

Navigation.prototype.deselectVehicle = function() {
    // set vehicle marker to unselected
    var obj = $('#img_' + this.selectedVehicle.id);
    obj.attr('src', Navigation.DIRECTION_ICON_INVERSE);
    
    if(this.currentMapPath) {
        // change the colour of the path to deselected
        this.currentMapPath.setPathStyle(this.deselectedNavPathStyle);
    
        // deselect the path
        this.currentMapPath.deselect();
    }
    
    // change to no action
    this.mapTouchMode = Navigation.MODE_NO_ACTION;
    
    // clear selection of the vehicle
    this.selectedVehicle = null;

    // clear out the prevLatLng
    this.prevLatLng = null;
}

Navigation.prototype.removeVehicle = function(vehicle) {
    // deselect the vehicle if it is selected
    if(this.selectedVehicle && this.selectedVehicle.id == vehicle.id) {
        this.deselectVehicle();
    }

    // remove the nav path for the vehicle
    this.navigationMapPaths[vehicle.id].remove();
    
    // delete the map paths for the vehicle
    delete this.navigationMapPaths[vehicle.id];
    
    // TODO: remove the current point for the vehicle
}

Navigation.prototype.selectMapStyle = function(styleIndex) {
    if(this.mapLayers.length > styleIndex) {
        this.map.addLayer(this.mapLayers[styleIndex].tileSet, true);
        this.map.removeLayer(this.currentTileSet);
        this.currentTileSet = this.mapLayers[styleIndex].tileSet;
    }
}

Navigation.prototype.clearActualPaths = function() {
    for(var i = 0, l = this.remoteVehicles.length; i < l; i++) {
        
        // remove the nav path for the vehicle
        this.actualMapPaths[this.remoteVehicles[i].id].remove();
        
        // delete the map paths for the vehicle
        delete this.actualMapPaths[this.remoteVehicles[i].id];

        // setup the path again        
        this.actualMapPaths[this.remoteVehicles[i].id] = this._setupActualPath(this.remoteVehicles[i])
    }
}

Navigation.prototype._setupActualPath = function(vehicle) {
    // setup the actual path    
    var actualPath = new Path();
    
    if(vehicle.position !== null && vehicle.position.latitude !== 0 && vehicle.position.longitude !== 0) {
        actualPath.append(vehicle.position.latitude, vehicle.position.longitude);
    }
    
    var polyLine = L.polyline(actualPath.toArray(), this.actualPathStyle);    
    return new MapPath({vehicleId: vehicle.id, map: this.map, polyLine: polyLine, weight: 2});
}

Navigation.prototype._setupMapPath = function(path, vehicle, latitude, longitude, vehicleSelected, pathStyle) {
    var points = path.toArray();
    
    var polyLine = L.polyline(points, pathStyle);
    
    var self = this;
    
    // var mapPath = new MapPath({vehicleId: vehicle.id, map: this.map, homeMarker: homeMarker, polyLine: polyLine});
    var mapPath = new MapPath({vehicleId: vehicle.id, map: this.map, polyLine: polyLine});
    
    if(path.returnsHome()) {
        var lastPoint = path.getPoint(path.length() - 1);
        var homePoint = path.getPoint(0);
        var polyline = L.polyline([[lastPoint.position.latitude, lastPoint.position.longitude],
                                   [homePoint.position.latitude, homePoint.position.longitude]],
                                  pathStyle);
        mapPath.addReturnHomePolyLine(polyline);
    }
    
    return mapPath;
}

Navigation.prototype._createOnNavigationPointClickFunction = function(self, vehicleId, position) {
    return function(e) {
        self._onNavigationPointClick(e, self, vehicleId, position)
    }
}

Navigation.prototype._addMarkers = function(mapPath, vehicle, self) {
    var point = null;
    
    for(var i = 0, l = vehicle.navigationPath.length(); i < l; i++) {
        point = vehicle.navigationPath.getPoint(i);
        
        var marker = new L.Marker(new L.LatLng(point.position.latitude, point.position.longitude), {
            icon: self._getIconForPoint(vehicle.id, point, this),
            zIndexOffset: 200,
            draggable: true,
            opacity: self.markerOpacity})
            .on('drag', function(e) {self._markerDragged(e, self);})
            .on('click', self._createOnNavigationPointClickFunction(self, vehicle.id, i));
    
        mapPath.addMarker(marker);
    }
}


Navigation.prototype._getVehicleIconClass = function(vehicle) {
  var icon = Navigation.AIRPLANE_ICON_CLASS;
  
  switch(vehicle.type) {
    case Vehicle.TYPE_AIR:
      icon = Navigation.AIRPLANE_ICON_CLASS;
      break;
    case Vehicle.TYPE_SURFACE:
      icon = Navigation.SURFACE_ICON_CLASS;
      break;
    case Vehicle.TYPE_SUBMERSIBLE:
      icon = Navigation.SUBMERSIBLE_ICON_CLASS;
      break;
  }
  
  return icon;
}

Navigation.prototype._markerDragged = function (e, that) {
    var newPoint = e.target.getLatLng();
    
    if(that.currentMapPath == null) {
        return;
    }
    
    for(var pos = 0, l = that.currentMapPath.markers.length; pos < l; pos++) {
        if(that.currentMapPath.markers[pos] === e.target) {
            break;
        }
    }
    
    // retreive the point on the path for the current position
    var point = that.selectedVehicle.navigationPath.getPoint(pos);
    
    point.position.latitude = newPoint.lat;
    point.position.longitude = newPoint.lng;
    that.selectedVehicle.navigationPath.dirty = true;
    
    // update the return home poly line if either the last point or first point is dragged
    if(point.returnHome) {
        // if the current point is return home then presume that only the last point can do this
        var homePoint = that.selectedVehicle.navigationPath.getPoint(0);
        
        // need to update the return home path as well
        that.currentMapPath.returnHomePolyLine.setLatLngs(
            [[point.position.latitude, point.position.longitude],
             [homePoint.position.latitude, homePoint.position.longitude]]);
    } else if(point.sequence === 0) {
        // we are the first point so check if last point is return home
        var lastPoint = that.selectedVehicle.navigationPath.getPoint(that.selectedVehicle.navigationPath.length() - 1);
        
        if(lastPoint.returnHome) {
            // need to update the return home path as well
            that.currentMapPath.returnHomePolyLine.setLatLngs(
                [[lastPoint.position.latitude, lastPoint.position.longitude],
                 [point.position.latitude, point.position.longitude]]);
        }
    }
    
    // update the whole poly line, we could use splice to replace the point in question. TODO: test which is more efficient, suspect they are the same
    that.currentMapPath.polyLine.setLatLngs(that.selectedVehicle.navigationPath.toArray());
}

Navigation.prototype._onMapClick = function(e, that) {
    // if a menu is open, treat the click on the map as a request to close the menu
    if(that.hideMenus.bind(that)()) {
        // menu was hidden, so just return
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
        
        case Navigation.MODE_NO_ACTION:
            // display the map menu
            that._displayMapMenu(e, that);
            break;
    }
}

Navigation.prototype._displayMapMenu = function(e, that) {
    var allAllocated = true;
    var vehiclesOnMap = false;
    
    // if there are vehicles on the map then enable removal of vehicles and zoom to vehicles
    that.mapMenu.enableMenuItem(Navigation.MAP_ZOOM_TO_ALL_VEHICLES);

    if(that.selectedVehicle) {    
        // that.mapMenu.enableMenuItem(Navigation.MAP_ZOOM_TO_SELECTED_VEHICLE);
        that.mapMenu.enableMenuItem(Navigation.MAP_DESELECT_VEHICLE);
        that.mapMenu.disableMenuItem(Navigation.MAP_SELECT_VEHICLE);
    } else {
        // that.mapMenu.disableMenuItem(Navigation.MAP_ZOOM_TO_SELECTED_VEHICLE);
        that.mapMenu.disableMenuItem(Navigation.MAP_DESELECT_VEHICLE);
        that.mapMenu.enableMenuItem(Navigation.MAP_SELECT_VEHICLE);
    }
    
    that.currentLatLng = e.latlng;
    
    // show the menu
    that.mapMenu.displayMenu(e.originalEvent.clientY, e.originalEvent.clientX);
}

Navigation.prototype._appendPoint = function(e, that, selected) {
    // if the navigation path is empty then we need to add the vehicle base position
    if(that.selectedVehicle.navigationPath.isEmpty()) {
        // first time we have added a point 
        that.selectedVehicle.navigationPath = new Path();
    } else {
        // setup the previous point if required
        if(!that.prevLatLng) {
            // set to the last point on the path
            var point = that.selectedVehicle.navigationPath.getPoint(that.selectedVehicle.navigationPath.length() - 1);
            that.prevLatLng = new L.LatLng(point.position.latitude, point.position.longitude);
        }
    }
    
    // TODO: add options for default settings on append
    that.selectedVehicle.navigationPath.append(e.latlng.lat, e.latlng.lng, {
        altitude: this.preferences.defaultAltitude,
        speed: this.preferences.defaultSpeed,
        accuracy: this.preferences.defaultAccuracy,
        loiterRadius: this.preferences.defaultLoiterRadius,
        loiterTime: this.preferences.defaultLoiterTime,
        loiterLaps: this.preferences.defaultLoiterLaps,
        autoContinue: this.preferences.defaultAutoContinue,
    });
    that.selectedVehicle.navigationPath.dirty = true;

    // add the point to the map
    that.currentMapPath = that._addNavPoint(that.currentMapPath, that.prevLatLng, e.latlng, that.selectedVehicle.navigationPath.length() - 1, selected);
    that.prevLatLng = e.latlng;
}

Navigation.prototype._insertPoint = function(e, that, position, selected) {
    // the previous point is based on the position. the insert is between the position and the position + 1
    console.log("inserting point at " + e.latlng.toString());

    // TODO: add options for default settings on insert
    that.selectedVehicle.navigationPath.insert(position + 1, e.latlng.lat, e.latlng.lng, {
        altitude: this.preferences.defaultAltitude,
        speed: this.preferences.defaultSpeed,
        accuracy: this.preferences.defaultAccuracy,
        loiterRadius: this.preferences.defaultLoiterRadius,
        loiterTime: this.preferences.defaultLoiterTime,
        loiterLaps: this.preferences.defaultLoiterLaps,
        autoContinue: this.preferences.defaultAutoContinue,
    });
    that.selectedVehicle.navigationPath.dirty = true;
    
    // insert the point to the map
    that._insertNavPoint(that, that.currentMapPath, e.latlng, position + 1, selected);
    that.prevLatLng = e.latlng;
    
    // re-number the points after the inserted point
    that._renumberMarkers(position, that, Navigation.RENUMBER_FROM_END, +1);
}

Navigation.prototype._addNavPoint = function(mapPath, fromPoint, toPoint, position, vehicleSelected) {
    vehicleSelected = ((vehicleSelected != null) ? vehicleSelected : false);
    var self = this;

    // if we're starting out then there is no polyline to set as it's the first point
    if(position === 0) {
        mapPath = new MapPath({vehicleId: this.selectedVehicle.id, map: this.map});
        this.navigationMapPaths[this.selectedVehicle.id] = mapPath;
    } else {
        if(position === 1) {
            // we're the second point so we need to setup the polyline
            mapPath.setPolyLine(L.polyline([fromPoint, toPoint], self.selectedNavPathStyle));
        } else {
            // we have at least two points so we just need to splice the polyline
            mapPath.polyLine.spliceLatLngs(position, 0, toPoint);
        }
    }
    
    // add a marker for the point when the vehicle is selected
    if(vehicleSelected) {
        var marker = new L.Marker(toPoint, {
            icon: new L.NumberedDivIcon({idPrefix: self.selectedVehicle.id + '_marker_', number: position+''}),
            draggable: true,
            zIndexOffset: 200,
            opacity: this.markerOpacity})
            .on('drag', function(e) {self._markerDragged(e, self);})
            .on('click', self._createOnNavigationPointClickFunction(self, self.selectedVehicle.id, position));
    
        // this appends a marker, it doesn't insert
        mapPath.addMarker(marker);
    }
    
    return mapPath;
}

Navigation.prototype._insertNavPoint = function(self, mapPath, point, position, vehicleSelected) {
    vehicleSelected = ((vehicleSelected != null) ? vehicleSelected : false);

    mapPath.polyLine.spliceLatLngs(position, 0, point);
    
    // add a marker for the point when the vehicle is selected
    if(vehicleSelected) {
        var marker = new L.Marker(point, {
            icon: new L.NumberedDivIcon({idPrefix: self.selectedVehicle.id + '_marker_', number: position+''}),
            draggable: true,
            zIndexOffset: 200,
            opacity: this.markerOpacity})
            .on('drag', function(e) {self._markerDragged(e, self);})
            .on('click', self._createOnNavigationPointClickFunction(self, self.selectedVehicle.id, position));
    
        mapPath.insertMarker(position, marker);
    }
}

Navigation.prototype._onVehicleMarkerClick = function(e, that, vehicle) {
    // if a menu is open, treat the click on the map as a request to close the menu
    if(that.hideMenus.bind(that)()) {
        // menu was hidden, so just return
        return;
    }
    
    that.clickedVehicle = vehicle;

    // if the vehicle has a path then allow delete
    if(vehicle.navigationPath) {
        that.vehicleMenu.enableMenuItem(Navigation.VEHICLE_DELETE_PATH);
        
        // if more than 1 point and last point is return home then allow revserse
        if(vehicle.navigationPath.length() > 1 && vehicle.navigationPath.returnsHome()) {
            that.vehicleMenu.enableMenuItem(Navigation.VEHICLE_REVERSE_DIRECTION);
        } else {
            that.vehicleMenu.disableMenuItem(Navigation.VEHICLE_REVERSE_DIRECTION);
        }
    }
    
    if(that.clickedVehicle === that.selectedVehicle) {
        that.vehicleMenu.disableMenuItem(Navigation.VEHICLE_SELECT);
        that.vehicleMenu.enableMenuItem(Navigation.VEHICLE_DESELECT);
    } else {
        that.vehicleMenu.enableMenuItem(Navigation.VEHICLE_SELECT);
        that.vehicleMenu.disableMenuItem(Navigation.VEHICLE_DESELECT);
    }
    
    // show the menu
    that.vehicleMenu.displayMenu(e.originalEvent.clientY, e.originalEvent.clientX);
}
  
Navigation.prototype._onHomeMarkerClick = function(e, that, vehicle) {
    // if a menu is open, treat the click on the map as a request to close the menu
    if(that.hideMenus.bind(that)()) {
        // menu was hidden, so just return
        return;
    }
    
    that.clickedVehicle = vehicle;

    // if the vehicle has a path and the last point is return to home then allow revserse
    if(vehicle.navigationPath.returnsHome()) {
        that.homeMenu.enableMenuItem(Navigation.HOME_REVERSE_DIRECTION);
    } else {
        that.homeMenu.disableMenuItem(Navigation.HOME_REVERSE_DIRECTION);
    }
    
    // show the menu
    that.homeMenu.displayMenu(e.originalEvent.clientY, e.originalEvent.clientX);
}
  
Navigation.prototype._onNavigationPointClick = function(e, that, vehicleId, position) {

    // if a menu is open, treat the click on a point as a request to close the menu
    if(that.hideMenus.bind(that)()) {
        // menu was hidden, so just return
        return;
    }
    
    if(that.selectedVehicle) {
        // reset the listener so that the correct position is used
        that.pointEditingMenu.setListener(function(e) {
            that._pointEditingMenuItemSelected(e, that, position);
        });
        
        // setup the elements as enabled/disabled as appropriate
        var p = that.selectedVehicle.navigationPath.getPoint(position);
        
        // disable and enable as appropriate
        if(that.selectedVehicle.navigationPath.length() -1 != position) {
            that.pointEditingMenu.disableMenuItem(Navigation.POINT_RETURN_TO_BASE);
            that.pointEditingMenu.disableMenuItem(Navigation.POINT_TERMINUS_TOGGLE);
        } else {
            that.pointEditingMenu.enableMenuItem(Navigation.POINT_RETURN_TO_BASE);
            that.pointEditingMenu.enableMenuItem(Navigation.POINT_TERMINUS_TOGGLE);
        }
    
        that.pointEditingMenu.displayMenu(e.originalEvent.clientY, e.originalEvent.clientX);
    } else {
        // reset the listener so that the correct position is used
        that.pointNonEditingMenu.setListener(function(e) {
            that._pointNonEditingMenuItemSelected(e, that, vehicleId, position);
        });
        
        that.pointNonEditingMenu.displayMenu(e.originalEvent.clientY, e.originalEvent.clientX);
    }
}
  
  // TODO: not working, but beleive that the dev branch of leaflet supports it
Navigation.prototype._onFlightPathClick = function(e) {
    console.log("navigation path clicked");
}

Navigation.prototype._mapMenuItemSelected = function(e, that) {
    that.mapMenu.hideMenu();

    switch(e.originalEvent.currentTarget.id) {
        case(Navigation.MAP_ZOOM_TO_ALL_VEHICLES):
            that.zoomToVehicles.call(that);
            that.map.fitBounds(that._getVehicleBounds());
            break;
        
        /*
        case(Navigation.MAP_ZOOM_TO_SELECTED_VEHICLE):
            that.map.fitBounds(that._getVehicleBounds());
            break;
            */
        
        case(Navigation.MAP_SELECT_VEHICLE):
            break;
        
        case(Navigation.MAP_DESELECT_VEHICLE):
            that.deselectVehicle.bind(that)();
            break;
        
        case(Navigation.MAP_REFRESH):
            break;
        
        case(Navigation.MAP_CLEAR_TRAILS):
            this.clearFunction();
            break;
    }
}

Navigation.prototype.zoomToVehicles = function() {
    bounds = this._getVehicleBounds();
    if(bounds) {
        this.map.fitBounds(bounds);
    }
}

Navigation.prototype._getVehicleBounds = function(vehicle) {
    var latlngs = new Array();
    
    var mapPath = null;
    
    if(this.selectedVehicle) {
        latlngs.push(this.navigationMapPaths[this.selectedVehicle.id].getLatLngs());
    } else {
        for(var id in this.navigationMapPaths) {
            latlngs.push(this.navigationMapPaths[id].getLatLngs());
        }
    }
    
    if(this.vehicleMarkers) {
        for(var id in this.vehicleMarkers) {
            latlngs.push(this.vehicleMarkers[id].getLatLng());
        }
    }
    
    return latlngs;
}

Navigation.prototype._vehicleMenuItemSelected = function(e, that) {
    // selected an option on the menu, so lets hide the menu
    that.vehicleMenu.hideMenu();

    switch(e.originalEvent.currentTarget.id) {
        
        case(Navigation.VEHICLE_DELETE_PATH):
            if(!that.clickedVehicle.navigationPath.isEmpty()) {
                // remove the current markers 
                if(that.selectedVehicle) {
                    // change to append mode as selected
                    that.mapTouchMode = Navigation.MODE_APPEND;            
                }

                // remove the markers from the map
                that.navigationMapPaths[that.clickedVehicle.id].removeMarkers();
            
                // remove the current nav path from the map
                that.navigationMapPaths[that.clickedVehicle.id].removePaths();
                
                // remove the path from the vehicle
                that.clickedVehicle.navigationPath.clear();
                
                // set to dirty
                that.clickedVehicle.navigationPath.dirty = true;
                
                // clear out the prevLatLng
                that.prevLatLng = null;
            }
            break;
        
        case(Navigation.VEHICLE_PROPERTIES):
            break;
        
        case(Navigation.VEHICLE_SELECT):
            that.selectVehicle.bind(that)(that.clickedVehicle);
            break;
        
        case(Navigation.VEHICLE_DESELECT):
            that.deselectVehicle.bind(that)();
            break;
        
        case(Navigation.VEHICLE_REVERSE_DIRECTION):
            if(!that.clickedVehicle.navigationPath.isEmpty() && that.selectedVehicle.navigationPath.returnsHome()) {
                // reverse the path
                that.clickedVehicle.navigationPath.reverse();
                
                // remove the current markers
                that.currentMapPath.removeMarkers();
                
                // set the new polyline
                that.currentMapPath.setPolyLine(L.polyline(that.clickedVehicle.navigationPath.toArray(), that.selectedNavPathStyle));

                // add the return home polyline (if required)
                if(that.selectedVehicle.navigationPath.returnsHome()) {
                    var lastPoint = that.selectedVehicle.navigationPath.getPoint(that.selectedVehicle.navigationPath.length() - 1);
                    var firstPoint = that.selectedVehicle.navigationPath.getPoint(0);
                    var polyline = L.polyline([[lastPoint.position.latitude, lastPoint.position.longitude],
                                               [firstPoint.position.latitude, firstPoint.position.longitude]],
                                              that.selectedNavPathStyle);
                    that.currentMapPath.addReturnHomePolyLine(polyline);
                }
                
                // add the current path
                that._addMarkers(that.navigationMapPaths[that.selectedVehicle.id], that.selectedVehicle, that);
            }
            break;
    }

    // clear the clicked vehicle
    that.clickedVehicle = null;
  
    return false;
}

Navigation.prototype._homeMenuItemSelected = function(e, that) {
    // selected an option on the menu, so lets hide the menu
    that.homeMenu.hideMenu();

    switch(e.originalEvent.currentTarget.id) {
        case(Navigation.HOME_DELETE_PATH):
            if(!that.clickedVehicle.navigationPath.isEmpty()) {
                // remove the current markers if selected and change to append mode
                if(that.selectedVehicle) {
                    that.currentMapPath.removeMarkers();
                    that.mapTouchMode = Navigation.MODE_APPEND;            
                }
            
                // save first point (which is the vehicle)
                var p = that.clickedVehicle.navigationPath.getPoint(0);
                
                // remove the path from the vehicle
                that.clickedVehicle.navigationPath.clear();
                
                // add back the first point
                that.clickedVehicle.navigationPath.append(p.position.latitude, p.position.longitude, p);

                // clear out the prevLatLng
                that.prevLatLng = null;
                
                // remove the current nav path from the map
                that.navigationMapPaths[that.clickedVehicle.id].removePaths();
            }
            break;
        
        case(Navigation.HOME_REVERSE_DIRECTION):
            if(!that.clickedVehicle.navigationPath.isEmpty() && that.selectedVehicle.navigationPath.returnsHome()) {
                // reverse the path
                that.clickedVehicle.navigationPath.reverse();
                
                // remove the current markers
                that.currentMapPath.removeMarkers();
                
                // remove the return home polyline
                that.currentMapPath.removeReturnHomePolyLine();

                // set the new polyline
                that.currentMapPath.setPolyLine(L.polyline(that.clickedVehicle.navigationPath.toArray(), that.selectedNavPathStyle));

                // add the return home polyline (if required)
                if(that.selectedVehicle.navigationPath.returnsHome()) {
                    var lastPoint = that.selectedVehicle.navigationPath.getPoint(that.selectedVehicle.navigationPath.length() - 1);
                    var firstPoint = that.selectedVehicle.navigationPath.getPoint(0);
                    var polyline = L.polyline([[lastPoint.position.latitude, lastPoint.position.longitude],
                                               [firstPoint.position.latitude, firstPoint.position.longitude]],
                                              that.selectedNavPathStyle);
                    that.currentMapPath.addReturnHomePolyLine(polyline);
                }
                
                // add the current path
                that._addMarkers(that.navigationMapPaths[that.selectedVehicle.id], that.selectedVehicle, that);
            }
            break;
    }

    // clear the clicked vehicle
    that.clickedVehicle = null;
  
    return false;
}

Navigation.prototype._renumberMarkers = function(position, that, direction, adjustment) {
    if(direction == Navigation.RENUMBER_TO_END) {
        // iterate through the positions from position to the end and reset the number 
        for(var i = position, l = that.currentMapPath.markers.length; i <= l; i++) {
            // remove existing listeners
            that.currentMapPath.markers[i + adjustment].off('click');
            
            // update the listener so that it has the correct position for clicks
            that.currentMapPath.markers[i + adjustment].on('click', that._createOnNavigationPointClickFunction(that, that.selectedVehicle.id, i + adjustment));
            // update the marker position (internal div that displays the number)
            that._updateMarkerPosition(i, i + adjustment, that);
        }
    } else {
        // iterate through the positions from the end to position and reset the number 
        for(var i = that.currentMapPath.markers.length + 1, l = position; i > l; i--) {
            // remove existing listeners
            that.currentMapPath.markers[i + adjustment].off('click');
            
            // update the listener so that it has the correct position for clicks
            that.currentMapPath.markers[i + adjustment].on('click', that._createOnNavigationPointClickFunction(that, that.selectedVehicle.id, i + adjustment));
            // update the marker position (internal div that displays the number)
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

Navigation.prototype._pointEditingMenuItemSelected = function(e, that, position) {
    that.pointEditingMenu.hideMenu();
    
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

Navigation.prototype._pointNonEditingMenuItemSelected = function(e, that, vehicleId, position) {
    that.pointNonEditingMenu.hideMenu();
    
    switch(e.originalEvent.currentTarget.id) {
        case Navigation.POINT_TARGET_WAYPOINT:
            this.setTargetWaypointFunction(vehicleId, position);
            break;
        
        case Navigation.POINT_SELECT_VEHICLE:
            // determine the vehicle
            for(var i = 0, l = this.remoteVehicles.length; i < l; i++) {
                if(this.remoteVehicles[i].id === vehicleId) {
                    // select the vehicle
                    this.selectVehicle.bind(this)(this.remoteVehicles[i]);
                    break;
                }
            }
            break;
    }
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
    that.selectedVehicle.navigationPath.dirty = true;

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
    that.selectedVehicle.navigationPath.dirty = true;
    
    // update the touch mode for the point
    that.mapTouchMode = that._getTouchModeForPoint(p);
    
    // set the icon
    that.currentMapPath.setIcon(position, that._getIconForPoint(that.selectedVehicle.id, p, that));
}

Navigation.prototype._loiterToggle = function(that, position) {
    // retreive the point on the path for the vehicle
    var p = that.selectedVehicle.navigationPath.getPoint(position);
    
    // update the flag for the nav path point
    p.loiter = !p.loiter;
    that.selectedVehicle.navigationPath.dirty = true;

    // update the icon for the marker
    that.currentMapPath.setIcon(position, that._getIconForPoint(that.selectedVehicle.id, p, that));
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
    that.selectedVehicle.navigationPath.dirty = true;

    if(lastPoint.returnHome) {
        var polyline = L.polyline([[lastPoint.position.latitude, lastPoint.position.longitude],
                                   [homePoint.position.latitude, homePoint.position.longitude]],
                                  that.selectedNavPathStyle);
        that.currentMapPath.addReturnHomePolyLine(polyline);
    } else {
        that.currentMapPath.removeReturnHomePolyLine();
    }
    
    // update the touch mode for the point
    that.mapTouchMode = that._getTouchModeForPoint(lastPoint);
}

Navigation.prototype._getIconForPoint = function(vehicleId, point, that) {
    var icon = null;
    
    if(point.terminus) {
        if(point.loiter) {
            icon = that._createTerminusLoiterIcon(vehicleId, point.sequence);
        } else {
            icon = that._createTerminusIcon(vehicleId, point.sequence);
        }
    } else {
        if(point.loiter) {
            icon = that._createLoiterIcon(vehicleId, point.sequence);
        } else {
            icon = that._createNumberIcon(vehicleId, point.sequence);
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
