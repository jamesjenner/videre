/*
 * server.js
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

var COMMS_SECURITY_SECURE_AND_UNSECURE = 'Secure and Unsecure';
var COMMS_SECURITY_SECURE_ONLY = 'Secure Only';
var COMMS_SECURITY_UNSECURE_ONLY = 'Unsecure Only';

var SERVER_KEY = 'Server';
var DEFAULT_IP_ADDRESS = '172.0.0.1';
var DEFAULT_PORT = '9007';
var DEFAULT_SECURE_PORT = '9008';
var DEFAULT_PROTOCOL = 'VIDERE_1.1';
var DEFAULT_USER_ID = 'user';
var DEFAULT_COMMS_SECURITY = COMMS_SECURITY_SECURE_AND_UNSECURE;

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
    // this.secureOnly = options.secureOnly || false;
    this.commsSecurity = options.commsSecurity || DEFAULT_COMMS_SECURITY;
    this.isConnected = false;
    this.nbrVehicles = 0;
    
    this.rcvdUnsupportedMessage = options.rcvdUnsupportedMessage || function() {};
    this.connectionListener = options.connectionListener || function() {};
    this.disconnectionListener = options.disconnectionListener || function() {};
    this.errorListener = options.errorListener || function() {};
    
    this.rcvdAddVehicle = options.rcvdAddVehicle || this.rcvdUnsupportedMessage;
    this.rcvdDeleteVehicle = options.rcvdDeleteVehicle || this.rcvdUnsupportedMessage;
    this.rcvdUpdateVehicle = options.rcvdUpdateVehicle || this.rcvdUnsupportedMessage;
    this.rcvdVehicleDeviceTypes = options.rcvdVehicleDeviceTypes || this.rcvdUnsupportedMessage;
    this.rcvdTelemetry = options.rcvdTelemetry || this.rcvdUnsupportedMessage;
    this.rcvdState = options.rcvdState || this.rcvdUnsupportedMessage;
    this.rcvdPayload = options.rcvdPayload || this.rcvdUnsupportedMessage;
    this.rcvdNavPathUpdated = options.rcvdNavPathUpdated || this.rcvdUnsupportedMessage;
    this.rcvdUpdateNavPath = options.rcvdUpdateNavPath || this.rcvdUnsupportedMessage;
    
    this.rcvdNavPathWaypointAchieved = options.rcvdNavPathWaypointAchieved || this.rcvdUnsupportedMessage;
    this.rcvdCurrentPosition = options.rcvdCurrentPosition || this.rcvdUnsupportedMessage;
    
    this.rcvdConnecting = options.rcvdConnecting || this.rcvdUnsupportedMessage;
    this.rcvdConnected = options.rcvdConnected || this.rcvdUnsupportedMessage;
    this.rcvdDisconnecting = options.rcvdDisconnecting || this.rcvdUnsupportedMessage;
    this.rcvdDisconnected = options.rcvdDisconnected || this.rcvdUnsupportedMessage;
    
    this.rcvdLaunching = options.rcvdLaunching || this.rcvdUnsupportedMessage;
    this.rcvdLaunched = options.rcvdLaunched || this.rcvdUnsupportedMessage;
    this.rcvdLanding = options.rcvdLanding || this.rcvdUnsupportedMessage;
    this.rcvdLanded = options.rcvdLanded || this.rcvdUnsupportedMessage;
    
    this.log = options.log || false;
    
    this.unsecureConnection = {};
    this.secureConnection = {};
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
        // this.secureOnly = obj.secureOnly || false;
        this.commsSecurity = obj.commsSecurity || DEFAULT_COMMS_SECURITY;
        this.log = obj.log || false;
    },
    connect: function() {
        if(this.log) {
            console.log(this.name + " webSocket connect " + this.ipAddress + ":" + this.securePort + " " + this.protocol);
        }

        this.secureOnly = this.commsSecurity === COMMS_SECURITY_SECURE_ONLY;
        this.unsecureOnly = this.commsSecurity === COMMS_SECURITY_UNSECURE_ONLY;
        this.secureAndUnsecure = this.commsSecurity === COMMS_SECURITY_SECURE_AND_UNSECURE;

        if (this.secureOnly || this.secureAndUnsecure) {
            this.connectSecure();
        } else {
            this.connectUnsecure();
        }
    },
    connectSecure: function() {
        if(this.log) {
            console.log(this.name + " webSocket secure connect " + this.ipAddress + ":" + this.securePort + " " + this.protocol);
        }

        if(window.WebSocket != undefined) {
            if(this.secureConnection.readyState === undefined || this.secureConnection.readyState > 1) {
                
                // if(this.secureOnly) {
                
                this.secureConnection = new WebSocket('wss://' + this.ipAddress + ':' + this.securePort, this.protocol);
                
                var self = this;
                
                this.secureConnection.binaryType = "arraybuffer";
                this.secureConnection.onopen = function (e) { self.openSecureEvent(e); };
                this.secureConnection.onmessage = function (e) { self.messageEvent(e) };
                this.secureConnection.onclose = function (e) { self.closeSecureEvent(e) };
                this.secureConnection.onerror = function (e) { self.errorEvent(e) };
            }
        }
    },
    connectUnsecure: function() {
        if(this.log) {
            console.log(this.name + " webSocket unsecure connect " + this.ipAddress + ":" + this.port + " " + this.protocol);
        }
        if(window.WebSocket != undefined) {
            if(this.unsecureConnection.readyState === undefined || this.unsecureConnection.readyState > 1) {
                
                this.unsecureConnection = new WebSocket('ws://' + this.ipAddress + ':' + this.port, this.protocol);
                
                var self = this;
                
                this.unsecureConnection.binaryType = "arraybuffer";
                this.unsecureConnection.onopen = function (e) { self.openUnsecureEvent(e); };
                this.unsecureConnection.onmessage = function (e) { self.messageEvent(e) };
                this.unsecureConnection.onclose = function (e) { self.closeUnsecureEvent(e) };
                this.unsecureConnection.onerror = function (e) { self.errorEvent(e) };
            }
        }
    },
    disconnect: function() {
        if(this.unsecureConnected) {
            this.unsecureConnection.close();
        }
        if(this.secureConnected) {
            this.secureConnection.close();
        }
    },
    openSecureEvent: function (event) {
        // note that we cannot fire the connectionListener event yet, as we don't know if the connection has been accepted based on the messaging protocol
        if(this.log) {
            console.log(this.name + " webSocket secure open " + this.ipAddress + ":" + this.securePort + " " + this.protocol);
        }
        this.secureConnected = true;
        this.authenticated = false;
        
        
        // setup the authenticate object
        if(this.secureOnly) {
            this.sendAuthentication(Message.COMMS_TYPE_SECURE_ONLY);
        } else {
            this.sendAuthentication(Message.COMMS_TYPE_MIXED);
        }
    },
    openUnsecureEvent: function (event) {
        // note that we cannot fire the connectionListener event yet, as we don't know if the connection has been accepted based on the messaging protocol
        if(this.log) {
            console.log(this.name + " webSocket unsecure open " + this.ipAddress + ":" + this.port + " " + this.protocol);
        }
        this.unsecureConnected = true;
        
        if(this.secureAndUnsecure) {
            var sessionDetails = new Object();
            sessionDetails.sessionId = this.sessionId;
            this.sendUnsecureMessage(Message.SESSION, sessionDetails);
        } else {
            this.authenticated = false;
            // must be unsecure only, send authentication
            this.sendAuthentication(Message.COMMS_TYPE_UNSECURE_ONLY);
        }
    },
    sendAuthentication: function(connectionType) {
        var authDetails = new Object();
        
        authDetails.userId = this.userId;
        authDetails.password = this.password;
        authDetails.connectionType = connectionType;
        
        this.sendMessage(Message.AUTHENTICATE, authDetails);
    },
    closeSecureEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket secure close");
        }
        this.secureConnected = false;
        
        // close the unsecure connection if it exists
        if(this.unsecureConnected) {
            // TODO: should this be after a delay?
            this.unsecureConnection.close();
        }

        // at this point the disconnection listener will only fire here
        // TODO: if a pure unsecure connection is allowed in the future, then this event will need to be fired from the close unsecure event 
        this.isConnected = false;
        this.disconnectionListener(event, this);
    },
    closeUnsecureEvent: function (event) {
        if(this.log) {
            console.log(this.name + " webSocket unsecure close");
        }
        this.unsecureConnected = false;
        
        // if there is a secure connection then close it
        if(this.secureConnected) {
            // TODO: should this be after a delay?
            this.secureConnection.close();
        }
        // if unsecure only then fire disconnection event 
        if(this.unsecureOnly) {
            this.isConnected = false;
            this.disconnectionListener(event, this);
        }
    },
    messageEvent: function (event) {
        if(event.data) {
            var msg = Message.deconstructMessage(event.data);

            if(this.log && msg.id != Message.VEHICLE_TELEMETRY) {
                console.log(this.name + " webSocket msg rcvd: " + msg.id + " : " + msg.body);
            }
            
        
            if(!this.authenticated) {
                switch(msg.id) {
                    case Message.AUTHENTICATION_ACCEPTED:
                        if(this.log) {
                            console.log(this.name + " Authentication successful");
                        }
                        this.authenticated = true;
                        this.sessionId = msg.body.sessionId;
                        
                        var connectionTypeAllowed = msg.body.connectionType;
                        
                        /*
                         * the host can pass back that only secure is allowed if connectiong secure and unsecure
                         * in such a case dont allow the session negotiation by connecting unsecure
                         */
                        
                        if(this.secureOnly || this.unsecureOnly || connectionTypeAllowed === Message.COMMS_TYPE_SECURE_ONLY) {
                            // can fire the connection sucessful event as secure only and unsecure only do not need session negotiation
                            this.isConnected = true;
                            this.connectionListener(event);
                        } else {
                            // get the session id and connect in clear
                            this.connectUnsecure();
                        }
                        
                        break;
                    
                    case Message.AUTHENTICATION_REJECTED:
                        if(this.log) {
                            console.log(this.name + " Authentication failed");
                        }
                        this.disconnect();
                        break;
                }
            }
        
            switch(msg.id) {
                case Message.SESSION_CONFIRMED:
                    // can fire the connection sucessful event, this only occurs for secureAndUnsecure
                    this.isConnected = true;
                    this.connectionListener(event);
                    break;

                case Message.VEHICLES:
                    var data = msg.body;
                    for(var i in msg.body) {
                        for(var j = 0, l = msg.body[i].length; j < l; j++) {
                            this.rcvdAddVehicle(this, new Vehicle(msg.body[i][j]));
                        }
                    }
                    break;
                
                case Message.VEHICLE_DEVICE_TYPES:
                    this.rcvdVehicleDeviceTypes(this, msg.body);
                    break;
                
                case Message.ADD_VEHICLE:
                    this.rcvdAddVehicle(this, new Vehicle(msg.body));
                    break;
          
                case Message.DELETE_VEHICLE:
                    this.rcvdDeleteVehicle(this, new Vehicle(msg.body));
                    break;
          
                case Message.UPDATE_VEHICLE:
                    this.rcvdUpdateVehicle(this, new Vehicle(msg.body));
                    break;
                
                case Message.VEHICLE_TELEMETRY:
                    this.rcvdTelemetry(this, msg.body);
                    break;
                
                case Message.VEHICLE_STATE:
                    this.rcvdState(this, msg.body);
                    break;
                
                case Message.VEHICLE_PAYLOAD:
                    this.rcvdPayload(this, msg.body);
                    break;
                
                case Message.NAV_PATH_UPDATED:
                    this.rcvdNavPathUpdated(this, msg.body);
                    break;
                
                case Message.UPDATE_NAV_PATH:
                    this.rcvdUpdateNavPath(this, msg.body);
                    break;
                
                case Message.NAV_PATH_WAYPOINT_ACHIEVED:
                    this.rcvdNavPathWaypointAchieved(this, msg.body);
                    break;
                
                case Message.CURRENT_POSITION:
                    this.rcvdCurrentPosition(this, msg.body);
                    break;

                case Message.VEHICLE_CONNECTING:
                    this.rcvdConnecting(this, msg.body);
                    break;
                
                case Message.VEHICLE_CONNECTED:
                    this.rcvdConnected(this, msg.body);
                    break;
                
                case Message.VEHICLE_DISCONNECTING:
                    this.rcvdDisconnecting(this, msg.body);
                    break;
                
                case Message.VEHICLE_DISCONNECTED:
                    this.rcvdDisconnected(this, msg.body);
                    break;

                case Message.VEHICLE_LAUNCHING:
                    console.log(this.name + " webSocket msg rcvd: firing vehicle launching ");
                    this.rcvdLaunching(this, msg.body);
                    break;
                
                case Message.VEHICLE_LAUNCHED:
                    this.rcvdLaunched(this, msg.body);
                    break;
                
                case Message.VEHICLE_LANDING:
                    this.rcvdLanding(this, msg.body);
                    break;
                
                case Message.VEHICLE_LANDED:
                    this.rcvdLanded(this, msg.body);
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
        if(this.secureOnly) {
            if(this.secureConnected) {
                if(this.log) {
                    console.log(this.name + " sending secure message, id: " + id + " body: " + body);
                }
                // only send secured due to configuration
                this.secureConnection.send(Message.constructMessage(id, body));
            }
        } else {
            if(this.secureConnected) {
                if(this.log) {
                    console.log(this.name + " sending secure message, id: " + id + " body: " + body);
                }
                // only send secure if we have a secure connection
                this.secureConnection.send(Message.constructMessage(id, body));
            } else if(this.unsecureConnected) {
                if(this.log) {
                    console.log(this.name + " sending unsecure message, id: " + id + " body: " + body);
                }
                // fallback is to send unsecure only when no secure connection and not secure only
                this.unsecureConnection.send(Message.constructMessage(id, body));
            }
        }
    },
    sendUnsecureMessage: function (id, body) {
        if(this.log) {
            console.log(this.name + " sending unsecure message, id: " + id + " body: " + body);
        }
        if(this.unsecureConnected) {
            this.unsecureConnection.send(Message.constructMessage(id, body));
        }
    }
};
