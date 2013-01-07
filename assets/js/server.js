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
    
    this.rcvdUnsupportedMessage = options.rcvdUnsupportedMessage || function() {};
    this.connectionListener = options.connectionListener || function() {};
    this.disconnectionListener = options.disconnectionListener || function() {};
    this.errorListener = options.errorListener || function() {};
    
    this.rcvdAddVehicle = options.rcvdAddVehicle || this.rcvdUnsupportedMessage;
    this.rcvdDeleteVehicle = options.rcvdDeleteVehicle || this.rcvdUnsupportedMessage;
    this.rcvdUpdateVehicle = options.rcvdUpdateVehicle || this.rcvdUnsupportedMessage;
    this.rcvdTelemetry = options.rcvdTelemetry || this.rcvdUnsupportedMessage;
    this.rcvdPayload = options.rcvdPayload || this.rcvdUnsupportedMessage;
    
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
        if(this.log) {
            console.log(this.name + " webSocket connect " + this.ipAddress + ":" + this.port + " " + this.protocol);
        }
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

        if(event.data) {
            var msg = Message.deconstructMessage(event.data);
        
            switch(msg.id) {
                case MSG_VEHICLES:
                    var data = JSON.parse(msg.body);
                    for(i = 0, l = data.length; i < l; i++) {
                        this.rcvdAddVehicle(new Vehicle(data[i]));
                    }
                    break;
                
                case MSG_ADD_VEHICLE:
                    this.rcvdAddVehicle(new Vehicle(JSON.parse(msg.body)));
                    break;
          
                case MSG_DELETE_VEHICLE:
                    this.rcvdDeleteVehicle(new Vehicle(JSON.parse(msg.body)));
                    break;
          
                case MSG_UPDATE_VEHICLE:
                    this.rcvdUpdateVehicle(new Vehicle(JSON.parse(msg.body)));
                    break;
                
                case MSG_VEHICLE_TELEMETRY:
                    this.rcvdTelemetry(JSON.parse(msg.body));
                    break;
                
                case MSG_VEHICLE_PAYLOAD:
                    this.rcvdPayload(JSON.parse(msg.body));
                    break;
            }
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