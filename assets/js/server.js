/*
 * server.js v0.1 alpha
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

var SERVER_KEY = 'Server';
var DEFAULT_IP_ADDRESS = '172.0.0.1';
var DEFAULT_PORT = '9007';
var DEFAULT_PROTOCOL = 'VIDERE_1.1';

var Server = function (options) {
    options = options || {};
    
    this.position = options.position || 0;
    
    this.name = options.name || "Server";
    this.ipAddress = options.ipAddress || DEFAULT_IP_ADDRESS;
    this.port = options.port || DEFAULT_PORT;
    this.protocol = options.protocol || DEFAULT_PROTOCOL;
    this.isConnected = false;
    this.nbrVehicles = 0;
    
    this.connectionListener = options.connectionListener || function() {};
    this.disconnectionListener = options.disconnectionListener || function() {};
    this.messageRcvdListener = options.messageRcvdListener || function() {};
    this.errorListener = options.errorListener || function() {};
    
    this.log = options.log || false;
    
    this.connection = {};
}

Server.prototype = {
    load: function(obj) {
        this.position = obj.position || 0;
        this.name = obj.name || "Server";
        this.ipAddress = obj.ipAddress || DEFAULT_IP_ADDRESS;
        this.port = obj.port || DEFAULT_PORT;
        this.protocol = obj.protocol || DEFAULT_PROTOCOL;
        this.log = obj.log || false;
    },
    connect: function() {
        if(window.WebSocket != undefined) {
            if(this.connection.readyState === undefined || this.connection.readyState > 1) {
                // host, port, resource name, secure
                // this.connection = new WebSocket('ws://' + this.ipAddress + ':' + this.port, this.protocol);
                this.connection = new WebSocket('ws://' + this.ipAddress + ':' + this.port, this.protocol);
                
                var a = this;
                
                this.connection.binaryType = "arraybuffer";
                this.connection.onopen = function (e) { a.openEvent(e); };
                this.connection.onmessage = function (e) { a.messageEvent(e) };
                this.connection.onclose = function (e) { a.closeEvent(e) };
                this.connection.onerror = function (e) { a.errorEvent(e) };
            }
        }
    },
    disconnect: function() {
        this.connection.close();
    },
    openEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket open " + this.ipAddress + ":" + this.port + " " + this.protocol);
        }
        this.connected = true;
        this.connectionListener(event);
    },
    closeEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket close");
        }
        this.connected = false;
        this.disconnectionListener(event);
    },
    messageEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket msg rcvd: " + event);
        }
        
        // TODO: include processing logic here, sort out the data, and then send a custom event that had processed the data
        this.messageRcvdListener(event);
        
        if(event.data instanceof ArrayBuffer) {
        /*
            var bytearray = new Uint8Array(event.data);
        
            var tempcanvas = document.createElement('canvas');
                tempcanvas.height = imageheight;
                tempcanvas.width = imagewidth;
            var tempcontext = tempcanvas.getContext('2d');
        
            var imgdata = tempcontext.getImageData(0,0,imagewidth,imageheight);
        
            var imgdatalen = imgdata.data.length;
        
            for (var i=8; i < imgdatalen; i++) {
              imgdata.data[i] = bytearray[i];
            }
        
            tempcontext.putImageData(imgdata,0,0);
        
            var img = document.createElement('img');
                img.height = imageheight;
                img.width = imagewidth;
                img.src = tempcanvas.toDataURL();
        
            chatdiv.appendChild(img);
            chatdiv.innerHTML = chatdiv.innerHTML + '<br/>';
        */
        } else {
            // console.log(event, event.data);
        }
    },
    errorEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket error: " + event);
        }
        this.errorListener(event);
    },
    sendMessage: function (id, body) {
        if(this.log) {
            console.log(this.name + " sending message, id: " + id + " body: " + body);
        }
        if(this.connected) {
            this.connection.send(JSON.stringify({id: id, msg: body}));
        }
    }
};