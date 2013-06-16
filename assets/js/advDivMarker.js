/*
 * advDivMarker.js
 *
 * Copyright (c) 2013 James G Jenner
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

// Navigation.AIRPLANE_MAP_ICON = 'assets/icons/airplane.png';

L.AdvDivIcon = L.Icon.extend({
    options: {
        iconUrl: '',
        idPostfix: '',
        internalClass: '',
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
        var advDiv = document.createElement('div');
        
        if(this.options['internalClass']) {
            advDiv.setAttribute("class", this.options['internalClass']);
        }
        
        if(this.options['idPostfix']) {
            advDiv.setAttribute("id", 'innerDiv_' + this.options['idPostfix']);
            img.setAttribute("id", "img_" + this.options['idPostfix']);
            div.setAttribute("id", "div_" + this.options['idPostfix']);
        } else {
            advDiv.setAttribute("id", "advDiv_uknown");
            img.setAttribute("id", "advDiv_img");
            div.setAttribute("id", "advDiv_div");
        }
        
        advDiv.innerHTML = '';
        
        div.appendChild(advDiv);
        advDiv.appendChild(img);
        
        this._setIconStyles(div, 'icon');
        
        return div;
    },

    //you could change this to add a shadow like in the normal marker if you really wanted
    createShadow: function () {
        return null;
    }
});