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
var DEFAULT_SECURE_PORT = '9008';
var DEFAULT_PROTOCOL = 'VIDERE_1.1';
var DEFAULT_USER_ID = 'user';

var Server = function (options) {
    options = options || {};
    
    this.position = options.position || 0;
    
    this.name = options.name || "Server";
    this.ipAddress = options.ipAddress || DEFAULT_IP_ADDRESS;
    this.port = options.port || DEFAULT_PORT;
    this.securePort = options.securePort || DEFAULT_SECURE_PORT;
    this.protocol = options.protocol || DEFAULT_PROTOCOL;
    this.userId = options.userId || DEFAULT_USER_ID;
    this.password = options.password || '';
    this.rememberPassword = options.rememberPassword || false;
    this.secureOnly = options.secureOnly || false;
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
        this.securePort = obj.securePort || DEFAULT_SECURE_PORT;
        this.protocol = obj.protocol || DEFAULT_PROTOCOL;
        this.userId = obj.userId || DEFAULT_USER_ID;
        this.password = obj.password || '';
        this.rememberPassword = obj.rememberPassword || false;
        this.secureOnly = obj.secureOnly || false;
        this.log = obj.log || false;
        this.secureConnection || false;
    },
    connect: function() {
        if(this.log) {
            console.log(this.name + " webSocket secure connect " + this.ipAddress + ":" + this.securePort + " " + this.protocol);
        }
        if(window.WebSocket != undefined) {
            if(this.connection.readyState === undefined || this.connection.readyState > 1) {
                
                // if(this.secureOnly) {
                
                this.connection = new WebSocket('wss://' + this.ipAddress + ':' + this.securePort, this.protocol);
                // this.connection = new WebSocket('ws://' + this.ipAddress + ':' + this.port, this.protocol);
                
                var self = this;
                
                this.connection.binaryType = "arraybuffer";
                this.connection.onopen = function (e) { self.openEvent(e); };
                this.connection.onmessage = function (e) { self.messageEvent(e) };
                this.connection.onclose = function (e) { self.closeEvent(e) };
                this.connection.onerror = function (e) { self.errorEvent(e) };
            }
        }
    },
    connectUnsecure: function() {
        if(this.log) {
            console.log(this.name + " webSocket unsecure connect " + this.ipAddress + ":" + this.port + " " + this.protocol);
        }
        if(window.WebSocket != undefined) {
            if(this.connection.readyState === undefined || this.connection.readyState > 1) {
                
                // if(this.secureOnly) {
                
                this.connection = new WebSocket('ws://' + this.ipAddress + ':' + this.port, this.protocol);
                
                var self = this;
                
                this.connection.binaryType = "arraybuffer";
                this.connection.onopen = function (e) { self.openUnsecureEvent(e); };
                this.connection.onmessage = function (e) { self.messageEvent(e) };
                this.connection.onclose = function (e) { self.closeUnsecureEvent(e) };
                this.connection.onerror = function (e) { self.errorEvent(e) };
            }
        }
    },
    disconnect: function() {
        this.connection.close();
    },
    openEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket secure open " + this.ipAddress + ":" + this.securePort + " " + this.protocol);
        }
        this.connected = true;
        this.authenticated = false;
        this.connectionListener(event);
        var authDetails = new Object();
        authDetails.userId = this.userId;
        authDetails.password = this.password;
        this.sendMessage(MSG_AUTHENTICATE, JSON.stringify(authDetails));
    },
    openUnsecureEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket unsecure open " + this.ipAddress + ":" + this.port + " " + this.protocol);
        }
        this.unsecureConnected = true;
        this.connectionListener(event);
        var sessionDetails = new Object();
        sessionDetails.sessionId = this.sessionId;
        this.sendMessage(MSG_SESSION, JSON.stringify(sessionDetails));
    },
    closeEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket close");
        }
        this.connected = false;
        this.disconnectionListener(event);
    },
    closeUnsecureEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket unsecure close");
        }
        this.unsecureConnected = false;
        this.disconnectionListener(event);
    },
    messageEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket msg rcvd: " + event);
        }

        if(event.data) {
            var msg = Message.deconstructMessage(event.data);
        
            if(!this.authenticated) {
                switch(msg.id) {
                    case MSG_AUTHENTICATION_ACCEPTED:
                        console.log(this.name + " Authentication successful");
                        this.authenticated = true;
                        this.sessionId = msg.msg.sessionId;
                        if(!this.secureOnly) {
                            // get the session id and connect in clear
                            connectUnsecure();
                        }
                        break;
                    
                    case MSG_AUTHENTICATION_REJECTED:
                        console.log(this.name + " Authentication failed");
                        break;
                }
            }
        
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