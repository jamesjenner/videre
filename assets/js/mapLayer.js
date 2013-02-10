/*
 * mapLayer.js
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

MapLayer.MAP_ICON = 'assets/icons/drawable-xhdpi-v11/ic_action_map.png';

function MapLayer(options) {
  options = options || {};
  
  this.title = options.title === undefined ? "Unknown" : options.title;
  this.description = options.description === undefined ? "Not known" : options.description;
  this.icon = options.icon === undefined ? MapLayer.MAP_ICON : options.icon;
  this.tileSet = options.tileSet === undefined ? null : options.tileSet;
}

