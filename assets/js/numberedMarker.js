/*
 * numberedMarker.js
 *
 * This work is derived from code in a post on Charlie Croom's blog by Charlie Croom.
 * (http://charliecroom.com/index.php/web/numbered-markers-in-leaflet)
 * 
 * Charlie's work is licensed as Creative Commons Attribution-Noncommercial-Share
 * Alike 3.0 United States License.
 * (http://creativecommons.org/licenses/by-nc-sa/3.0/us/)
 *
 * The derived work is licensed as follows:
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
 *
 * Note that it is required that credit be given to Charlie's work. It is 
 */

// Navigation.AIRPLANE_MAP_ICON = 'assets/icons/airplane.png';

L.NumberedDivIcon = L.Icon.extend({
    options: {
        iconUrl: 'assets/img/number-icon.png',
        number: '',
        idPrefix: '',
        shadowUrl: null,
        iconSize: new L.Point(25, 41),
        iconAnchor: new L.Point(13, 41),
        popupAnchor: new L.Point(0, -33),
        /*
        iconAnchor: (Point)
        popupAnchor: (Point)
        */
        className: 'leaflet-numbered-icon'
    },
    
    createIcon: function () {
        var div = document.createElement('div');
        var img = this._createImg(this.options['iconUrl']);
        var numdiv = document.createElement('div');
        
        numdiv.setAttribute("class", "number");
        if(this.options['number']) {
            if(this.options['idPrefix']) {
                numdiv.setAttribute("id", this.options['idPrefix'] + this.options['number']);
            } else {
                numdiv.setAttribute("id", "nbr" + this.options['number']);
            }
        }
        
        numdiv.innerHTML = this.options['number'] || '';
        
        div.appendChild(img);
        div.appendChild(numdiv);
        
        this._setIconStyles(div, 'icon');
        
        return div;
    },

    //you could change this to add a shadow like in the normal marker if you really wanted
    createShadow: function () {
        return null;
    }
});