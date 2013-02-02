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

Navigation.POINT_DELETE = "menuPointDeleteNavPoint";
Navigation.POINT_INSERT_BEFORE = "menuPointInsertBefore";
Navigation.POINT_INSERT_AFTER = "menuPointInsertAfter";
Navigation.POINT_LOITER_TOGGLE = "menuPointLoiterToggle";
Navigation.POINT_RETURN_TO_BASE = "menuPointReturnToBase";
Navigation.POINT_FINISH_HERE = "menuPointFinishHere";

Navigation.MODE_NO_ACTION = 0;
Navigation.MODE_APPEND = 1;
Navigation.MODE_INSERT_BEFORE = 2;
Navigation.MODE_INSERT_AFTER = 3;


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
    
        mapPath.addMarker(marker);
    }
    
    /* TODO: decide if we need the following, ie. will we show markers for non selected vehicles?
     * suspect that the logic here should go in a generic load routine for paths
    else {
        L.marker(toPoint, {
            draggable: false,
            opacity: 0.5})
             .addTo(navGroup)
            .on('click', function(e) {that._onNavigationPointClick(e, that); });
    } */
    
    return mapPath;
}

Navigation.prototype._loadNavPath = function(vehicle, navGroup, polyLine, vehicleSelected, that) {
}

Navigation.prototype._markerDragged = function (e, that) {
    // determine which marker position was dragged
    for(var pos = 0, l = that.currentMapPath.markers.length; pos < l; pos++) {
        if(that.currentMapPath.markers[pos] === e.target) {
            break;
        }
    }
    
    // need to add 1 as the first point is the vehicle, while the mapPath doesn't include the vehicle
    pos++;
    
    var newPoint = e.target.getLatLng();
    
    // update the points on the navigation path
    that.selectedVehicle.navigationPath.updatePointPos(pos, newPoint.lat, newPoint.lng);
    
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
                that.selectedVehicle.navigationPath.append(e.latlng.lat, e.latlng.lng);

                // add the point to the map
                that.currentMapPath = that._addNavPoint(that.currentMapPath, that.prevLatLng, e.latlng, that.selectedVehicle.navigationPath.length() - 1, true);
                that.prevLatLng = e.latlng;
                
                // remove the path from the map
                // that.map.removeLayer(that.currentNavGroup);
                
                // TODO: either add polys to L.LayerGroup and then add LayerGroup to map, or remember all added so they can be removed.
                // refer http://leafletjs.com/reference.html#layergroup and http://leafletjs.com/reference.html#featuregroup
                
                
                // add the path to the map
            }
            break;
        
        case Navigation.MODE_INSERT_BEFORE:
            // insert a new point between the current and previous points, at the current co-ords
            break;
        
        case Navigation.MODE_INSERT_AFTER:
            // insert a new point between the current and next points, at the current co-ords
            break;
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

Navigation.prototype._pointMenuItemSelected = function(e, that, position) {
    that.pointMenu.hideMenu();
    
    switch(e.originalEvent.currentTarget.id) {
        case(Navigation.POINT_DELETE):
            // remove the point from the vehicle nav path
            that.selectedVehicle.navigationPath.delete(position);

            // remove the marker
            that.currentMapPath.removeMarker(position);
            
            // remove the point from the polyline
            that.currentMapPath.polyLine.spliceLatLngs(position, 1);
            
            // iterate through the positions and reset the number 
            for(var i = position + 1, l = that.currentMapPath.markers.length + 1; i <= l; i++) {
                // get the div container that holds the number
                var numberDiv =  $('#' + that.selectedVehicle.id + '_marker_' + i);
                // reset the number down by 1
                numberDiv.text((i - 1) +'');
                // reset the div id as well, as the div refers to it's position to be unique
                numberDiv.attr('id', that.selectedVehicle.id + '_marker_' + (i - 1));
            }
            
            break;
        
        case(Navigation.POINT_INSERT_BEFORE):
            // insert between the current and the previous progresisvely
            that.mapTouchMode = Navigation.MODE_INSERT_BEFORE;
            break;
        
        case(Navigation.POINT_INSERT_AFTER):
            // if the last mode then switch to append mode
            that.mapTouchMode = Navigation.MODE_APPEND;
            // otherwise insert between the current and the next progresisvely 
            that.mapTouchMode = Navigation.MODE_INSERT_AFTER;
            break;
        
        case(Navigation.POINT_LOITER_TOGGLE):
            // toggle loiter for the point
            break;
        
        case(Navigation.POINT_RETURN_TO_BASE):
            // set the path to complete and the current point to return to base afterwards
            
            // this is only valid if the last point on the path
            break;
        
        case(Navigation.POINT_FINISH_HERE):
            // set the path to complete and the current point as the final point
            
            // this is only valid if the last point on the path
            break;
    }
  
    return false;
}

Navigation.prototype._addPath = function() {

}
