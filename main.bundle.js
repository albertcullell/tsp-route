webpackJsonp([1,4],{

/***/ 431:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(704);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapsService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



var MapsService = (function () {
    function MapsService(window, dialog) {
        this.dialog = dialog;
        this.markers = [];
        this.places = [];
        this.markersRoute = [];
        //directions.setMap(this.map);
        this.counter = 1;
        this.directionsDisplayArray = [];
        this.placesEmitter = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */]();
        this._window = window;
    }
    MapsService.prototype.getPlaces = function () {
        return this.places;
    };
    MapsService.prototype.onPlacesChange = function () {
        return this.placesEmitter.asObservable();
    };
    MapsService.prototype.setupMapService = function (map) {
        this.directionsService = new this._window.google.maps.DirectionsService;
        this.directionsDisplay = new this._window.google.maps.DirectionsRenderer({ suppressMarkers: true });
        this.map = map;
        this.directionsDisplay.setMap(this.map);
    };
    MapsService.prototype.loadMap = function () {
        this.directionsService = new this._window.google.maps.DirectionsService;
        this.directionsDisplay = new this._window.google.maps.DirectionsRenderer({ suppressMarkers: true });
        this.map = new this._window.google.maps.Map(document.getElementById('map'), {
            zoom: 7,
            center: { lat: 41.85, lng: -87.65 },
            mapTypeId: this._window.google.maps.MapTypeId.ROADMAP
        });
        this.directionsDisplay.setMap(this.map);
    };
    MapsService.prototype.loadSearchBox = function () {
        var _this = this;
        this.markers = [];
        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new this._window.google.maps.places.SearchBox(input);
        //this.map.controls[this._window.google.maps.ControlPosition.TOP_LEFT].push(input);
        // Bias the SearchBox results towards current map's viewport.
        this.map.addListener('bounds_changed', function () {
            searchBox.setBounds(_this.map.getBounds());
        });
        // [START region_getplaces]
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function () {
            var places = searchBox.getPlaces();
            if (places.length == 0) {
                return;
            }
            // Clear out the old markers.
            _this.markers.forEach(function (marker) {
                marker.setMap(null);
            });
            // For each place, get the icon, name and location.
            var bounds = new _this._window.google.maps.LatLngBounds();
            places.forEach(function (place) {
                console.log('place', place);
                // save places
                _this.places.push(place);
                // emit new place to subscribers
                _this.placesEmitter.emit(_this.places);
                var icon = {
                    url: place.icon,
                    size: new _this._window.google.maps.Size(71, 71),
                    origin: new _this._window.google.maps.Point(0, 0),
                    anchor: new _this._window.google.maps.Point(17, 34),
                    scaledSize: new _this._window.google.maps.Size(25, 25)
                };
                // Create a marker for each place.
                _this.markers.push(new _this._window.google.maps.Marker({
                    map: _this.map,
                    icon: icon,
                    title: place.name,
                    position: place.geometry.location
                }));
                if (place.geometry.viewport) {
                    // Only geocodes have viewport.
                    bounds.union(place.geometry.viewport);
                }
                else {
                    bounds.extend(place.geometry.location);
                }
            });
            _this.map.fitBounds(bounds);
        });
    };
    MapsService.prototype.showRoute = function (origin, destination) {
        var _this = this;
        this.directionsService.route({
            origin: origin,
            destination: destination,
            travelMode: this._window.google.maps.TravelMode.DRIVING
        }, function (response, status) {
            console.log("response", response);
            if (status === _this._window.google.maps.DirectionsStatus.OK) {
                var directions = new _this._window.google.maps.DirectionsRenderer({ suppressMarkers: true });
                directions.setMap(_this.map);
                directions.setDirections(response);
                _this.directionsDisplayArray.push(directions);
            }
            else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    };
    MapsService.prototype.cleanMarkers = function () {
        // Clear out the old markers.
        this.markers.forEach(function (marker) {
            marker.setMap(null);
        });
        this.markersRoute.forEach(function (marker) {
            marker.setMap(null);
        });
    };
    MapsService.prototype.cleanMap = function () {
        this.counter = 1;
        this.directionsDisplayArray.forEach(function (directions) { return directions.setMap(null); });
        this.cleanMarkers();
    };
    MapsService.prototype.calcPath = function (firstPlace, allPlaces) {
        var _this = this;
        var places = [];
        // add first place
        places.push(firstPlace);
        // filter places
        var filterPlaces = allPlaces.filter(function (p) { return p.id !== firstPlace.id; });
        console.log('filter places', filterPlaces);
        var observables = [];
        filterPlaces.forEach(function (place) {
            observables.push(_this.getDistance(firstPlace, place));
        });
        if (filterPlaces.length === 0) {
            // show last route
            setTimeout(function () { _this.showRoute(firstPlace.formatted_address, _this.places[0].formatted_address); }, 2000);
            return;
        }
        __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].zip.apply(__WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"], observables)
            .delay(2000)
            .do(console.log)
            .map(function (distances) { return distances[minDistance(distances.map(function (x) { return x.distance; }))]; })
            .subscribe(function (placeDistance) {
            console.log('min', placeDistance);
            // save origin as a visited
            // draw
            var directions = new _this._window.google.maps.DirectionsRenderer({ suppressMarkers: true });
            directions.setMap(_this.map);
            directions.setDirections(placeDistance.responseMaps);
            _this.directionsDisplayArray.push(directions);
            var leg = placeDistance.responseMaps.routes[0].legs[0];
            _this.makeMarker(leg.start_location, _this.counter + '');
            _this.makeMarker(leg.end_location, (_this.counter + 1) + '');
            _this.counter++;
            // calculate next
            if (filterPlaces.length > 0) {
                _this.calcPath(placeDistance.destination, filterPlaces);
            }
        }, function (error) {
            //this.dialog.open(DialogComponent);
            alert('Google maps error ocurred');
        });
        return places;
    };
    MapsService.prototype.makeMarker = function (position, label) {
        this.markersRoute.push(new this._window.google.maps.Marker({
            position: position,
            map: this.map,
            label: label
        }));
    };
    MapsService.prototype.getDistance = function (origin, destination) {
        var _this = this;
        return new __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"](function (observer) {
            _this.directionsService.route({
                origin: origin.formatted_address,
                destination: destination.formatted_address,
                travelMode: _this._window.google.maps.TravelMode.DRIVING
            }, function (response, status) {
                console.log("response", response);
                console.log("status", status);
                if (!response || status === 'OVER_QUERY_LIMIT') {
                    observer.error();
                }
                console.log("origin, dest", [origin, destination]);
                if (status === _this._window.google.maps.DirectionsStatus.OK && response.routes[0].legs[0].distance) {
                    // console.log(response);
                    observer.next({
                        origin: origin,
                        destination: destination,
                        distance: response.routes[0].legs[0].distance.value,
                        responseMaps: response
                    });
                    observer.complete();
                }
                else {
                    observer.error();
                }
            });
        });
    };
    MapsService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["d" /* Injectable */])(),
        __param(0, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["e" /* Inject */])('Window')), 
        __metadata('design:paramtypes', [Object, (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["b" /* MdDialog */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_material__["b" /* MdDialog */]) === 'function' && _a) || Object])
    ], MapsService);
    return MapsService;
    var _a;
}());
// Utils
var minDistance = function (distances) { return distances.indexOf(Math.min.apply(Math, distances)); };
//# sourceMappingURL=maps.service.js.map

/***/ }),

/***/ 432:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DialogComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var DialogComponent = (function () {
    function DialogComponent() {
    }
    DialogComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* Component */])({
            selector: 'dialog-component',
            template: __webpack_require__(700),
            styles: [__webpack_require__(695)]
        }), 
        __metadata('design:paramtypes', [])
    ], DialogComponent);
    return DialogComponent;
}());
//# sourceMappingURL=dialog.component.js.map

/***/ }),

/***/ 433:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* unused harmony export FavButtonState */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchBarComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FavButtonState;
(function (FavButtonState) {
    FavButtonState[FavButtonState["Disabled"] = 0] = "Disabled";
    FavButtonState[FavButtonState["Highlighted"] = 1] = "Highlighted";
    FavButtonState[FavButtonState["Default"] = 2] = "Default";
})(FavButtonState || (FavButtonState = {}));
var SearchBarComponent = (function () {
    function SearchBarComponent() {
        /**
         * Represents the fav button actual state
         */
        this.favState = FavButtonState.Default;
        /**
         * Output event emitter for input search changes
         */
        this.inputChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */]();
        /**
         * Output event emitter for input search changes
         */
        this.favourite = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */]();
        // We do this in order to use it on the template
        this.favButtonsState = FavButtonState;
    }
    SearchBarComponent.prototype.ngOnInit = function () { };
    /**
     * Propagues changes from input to parent component
     * @param  {string} value
     */
    SearchBarComponent.prototype.onInputChange = function (value) {
        // keep current input value on currentValue variable
        this.currentValue = value;
        // just propagates the input change to parent
        this.inputChange.next(value);
    };
    /**
     * Propagues current input value when favourite button is clicked
     */
    SearchBarComponent.prototype.favouriteClicked = function () {
        this.favourite.next(this.currentValue);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* Input */])(), 
        __metadata('design:type', Number)
    ], SearchBarComponent.prototype, "favState", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */]) === 'function' && _a) || Object)
    ], SearchBarComponent.prototype, "inputChange", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* Output */])(), 
        __metadata('design:type', (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */]) === 'function' && _b) || Object)
    ], SearchBarComponent.prototype, "favourite", void 0);
    SearchBarComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* Component */])({
            selector: 'search-bar',
            styles: [__webpack_require__(696)],
            template: __webpack_require__(701),
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* ChangeDetectionStrategy */].OnPush
        }), 
        __metadata('design:paramtypes', [])
    ], SearchBarComponent);
    return SearchBarComponent;
    var _a, _b;
}());
//# sourceMappingURL=search-bar.component.js.map

/***/ }),

/***/ 434:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SoupListComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SoupListComponent = (function () {
    function SoupListComponent() {
        /**
         * Title of favourites component default set to 'Favourites'
         */
        this.title = '';
        /**
         * Input recieving the list of favourites to represent as an Immutable data because we work
         * with change detection strategy OnPush
         */
        this.listItems = ['AAA', 'BBBB', 'CCCC'];
        this.itemRemoved = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */]();
    }
    SoupListComponent.prototype.ngOnInit = function () {
    };
    SoupListComponent.prototype.remove = function (index) {
        console.log('remove');
        //this.listItems.splice(index, 1);
        this.itemRemoved.next(index);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* Input */])(), 
        __metadata('design:type', String)
    ], SoupListComponent.prototype, "title", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["i" /* Input */])(), 
        __metadata('design:type', Array)
    ], SoupListComponent.prototype, "listItems", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["j" /* Output */])(), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["f" /* EventEmitter */]) === 'function' && _a) || Object)
    ], SoupListComponent.prototype, "itemRemoved", void 0);
    SoupListComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* Component */])({
            selector: 'soup-list',
            styles: [__webpack_require__(697)],
            template: __webpack_require__(702),
            changeDetection: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* ChangeDetectionStrategy */].OnPush
        }), 
        __metadata('design:paramtypes', [])
    ], SoupListComponent);
    return SoupListComponent;
    var _a;
}());
//# sourceMappingURL=soup-list.component.js.map

/***/ }),

/***/ 487:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 487;


/***/ }),

/***/ 488:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(617);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(638);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(640);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 637:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__maps_service__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_material__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_dialog_dialog_component__ = __webpack_require__(432);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__agm_core__ = __webpack_require__(289);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AppComponent = (function () {
    function AppComponent(mapsService, lazyMapsAPILoader, ngZone, dialog) {
        var _this = this;
        this.mapsService = mapsService;
        this.lazyMapsAPILoader = lazyMapsAPILoader;
        this.ngZone = ngZone;
        this.dialog = dialog;
        this.title = 'Fastest Route';
        this.lat = 41.3994083;
        this.lng = 2.160641;
        this.latA = 41.4021253;
        this.lngA = 2.1759248;
        this.latB = 41.3913891;
        this.lngB = 2.1695639;
        this.placesNames = [];
        this.mapsService.onPlacesChange().subscribe(function (places) {
            console.log('on places change', places);
            _this.ngZone.run(function () {
                _this.placesNames = places.map(function (x) { return x.name; });
            });
        });
    }
    AppComponent.prototype.ngAfterViewInit = function () {
        console.log('map', this.mapRef);
    };
    AppComponent.prototype.doSearch = function () {
    };
    AppComponent.prototype.onMapReady = function (map) {
        console.log('map ready!!', map);
        this.mapsService.setupMapService(map);
        this.mapsService.loadSearchBox();
    };
    AppComponent.prototype.addFavourite = function () {
    };
    AppComponent.prototype.loadMap = function () {
        this.mapsService.loadMap();
    };
    AppComponent.prototype.loadSearch = function () {
        /*this.mapsService.showRoute('chicago, il', 'joplin, mo');
    
        this.mapsService.showRoute('joplin, mo', 'oklahoma city, ok');*/
    };
    AppComponent.prototype.calcRoute = function () {
        var places = this.mapsService.getPlaces();
        if (this.placesNames.length > 7) {
            this.dialog.open(__WEBPACK_IMPORTED_MODULE_3__components_dialog_dialog_component__["a" /* DialogComponent */]);
            return;
        }
        this.placesNames = places.map(function (x) { return x.name; });
        console.log('calcRoute', places);
        /* for(let i = 0; i < places.length-1; i++) {
           this.mapsService.showRoute(places[i].formatted_address, places[i+1].formatted_address);
         }*/
        this.mapsService.cleanMap();
        this.mapsService.calcPath(places[0], places);
    };
    AppComponent.prototype.loadSearchBox = function () {
        this.mapsService.loadSearchBox();
    };
    AppComponent.prototype.removePlace = function (index) {
        this.placesNames.splice(index, 1);
        this.mapsService.getPlaces().splice(index, 1);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["K" /* ViewChild */])('map'), 
        __metadata('design:type', Object)
    ], AppComponent.prototype, "mapRef", void 0);
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(699),
            styles: [__webpack_require__(694)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__maps_service__["a" /* MapsService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__maps_service__["a" /* MapsService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__agm_core__["b" /* LazyMapsAPILoader */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__agm_core__["b" /* LazyMapsAPILoader */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["h" /* NgZone */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["h" /* NgZone */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_2__angular_material__["b" /* MdDialog */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_material__["b" /* MdDialog */]) === 'function' && _d) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b, _c, _d;
}());
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 638:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(55);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(637);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__maps_service__ = __webpack_require__(431);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components__ = __webpack_require__(639);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_dialog_dialog_component__ = __webpack_require__(432);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__agm_core__ = __webpack_require__(289);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_material__ = __webpack_require__(240);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var MapsConfig = {
    apiKey: 'AIzaSyBGwsw_9Idnz8UnqKLoFqEb2XRUh9apzTQ',
    apiVersion: undefined,
    channel: '',
    libraries: ['places']
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_7__components_dialog_dialog_component__["a" /* DialogComponent */]
            ].concat(__WEBPACK_IMPORTED_MODULE_6__components__["a" /* APP_COMPONENTS */]),
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_7__components_dialog_dialog_component__["a" /* DialogComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_9__angular_material__["a" /* MaterialModule */],
                __WEBPACK_IMPORTED_MODULE_8__agm_core__["a" /* AgmCoreModule */].forRoot({
                    apiKey: 'AIzaSyBGwsw_9Idnz8UnqKLoFqEb2XRUh9apzTQ',
                    libraries: ['places']
                })
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_5__maps_service__["a" /* MapsService */],
                __WEBPACK_IMPORTED_MODULE_8__agm_core__["b" /* LazyMapsAPILoader */],
                //{provide: LAZY_MAPS_API_CONFIG, useValue: MapsConfig},
                { provide: 'Window', useValue: window }
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 639:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__search_bar_search_bar_component__ = __webpack_require__(433);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__soup_list_soup_list_component__ = __webpack_require__(434);
/* unused harmony reexport SearchBarComponent */
/* unused harmony reexport SoupListComponent */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APP_COMPONENTS; });




var APP_COMPONENTS = [
    __WEBPACK_IMPORTED_MODULE_0__search_bar_search_bar_component__["a" /* SearchBarComponent */],
    __WEBPACK_IMPORTED_MODULE_1__soup_list_soup_list_component__["a" /* SoupListComponent */]
];
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 640:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 694:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(79)();
// imports


// module
exports.push([module.i, ".sebm-google-map-container {\r\n  height: 500px;\r\n  width: 100%;\r\n}\r\n\r\ndiv.app-container {\r\n  margin: 30px;\r\n  display: block;\r\n}\r\n\r\n#map {\r\n  height: 500px;\r\n}\r\n\r\n.top-container {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-pack: start;\r\n      -ms-flex-pack: start;\r\n          justify-content: flex-start;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n  margin-top: 10px;\r\n}\r\n.calc-button {\r\n /* width: 90%; */\r\n margin-left: 20px;\r\n}\r\n\r\n.places-container {\r\n  display: block;\r\n  margin: 20px;\r\n  width: 100%;\r\n  height: 100%;\r\n}\r\n\r\n.controls {\r\n  margin-top: 10px;\r\n  border: 1px solid transparent;\r\n  border-radius: 2px 0 0 2px;\r\n  box-sizing: border-box;\r\n  -moz-box-sizing: border-box;\r\n  height: 32px;\r\n  outline: none;\r\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\n#pac-input {\r\n  background-color: #fff;\r\n  font-family: Roboto;\r\n  font-size: 15px;\r\n  font-weight: 300;\r\n  margin: 15px;\r\n  padding: 0 11px 0 13px;\r\n  text-overflow: ellipsis;\r\n  width: 300px;\r\n  margin-left: 0;\r\n}\r\n\r\n#pac-input:focus {\r\n  border-color: #4d90fe;\r\n}\r\n\r\n.pac-container {\r\n  font-family: Roboto;\r\n}\r\n\r\n#type-selector {\r\n  color: #fff;\r\n  background-color: #4d90fe;\r\n  padding: 5px 11px 0px 11px;\r\n}\r\n\r\n#type-selector label {\r\n  font-family: Roboto;\r\n  font-size: 13px;\r\n  font-weight: 300;\r\n}\r\n\r\nh1, h2, h3, h4, h5, h6 {\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n}\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 695:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(79)();
// imports


// module
exports.push([module.i, "div.dialog-title {\r\n  font-family: Roboto,\"Helvetica Neue\",sans-serif;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 696:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(79)();
// imports


// module
exports.push([module.i, "md-input-container {\r\n  margin: 20px;\r\n}\r\n\r\nmd-input-container input {\r\n  display: inline;\r\n  width: auto;\r\n}\r\n\r\nmd-input-container md-icon {\r\n  display: inline;\r\n}\r\n\r\nmd-icon.fav-selected {\r\n  color: gold;\r\n}\r\nmd-icon:hover {\r\n  cursor: pointer;\r\n}\r\nmd-icon.fav-disabled:hover {\r\n  cursor: auto;\r\n}\r\n\r\n\r\n\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 697:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(79)();
// imports


// module
exports.push([module.i, "button {\r\n  margin: 5px;\r\n}\r\n\r\np {\r\n  margin: 0;\r\n  margin-left: 5px;\r\n  margin-bottom: 5px;\r\n}\r\n\r\nmd-chip {\r\n  background-color: #ededed;\r\n  margin: 4px;\r\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);\r\n}\r\n\r\nmd-icon:hover {\r\n  cursor: pointer;\r\n}\r\n\r\n.chip-inner {\r\n  display: -webkit-box;\r\n  display: -ms-flexbox;\r\n  display: flex;\r\n  -webkit-box-pack: center;\r\n      -ms-flex-pack: center;\r\n          justify-content: center;\r\n  -webkit-box-align: center;\r\n      -ms-flex-align: center;\r\n          align-items: center;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 699:
/***/ (function(module, exports) {

module.exports = "<div class=\"app-container\">\n  <h1>\n    {{title}}\n  </h1>\n\n  <div class=\"top-container\">\n    <input id=\"pac-input\" class=\"controls\" type=\"text\" placeholder=\"Search Box\">\n    <button md-button class=\"calc-button\" (click)=\"calcRoute()\">Calculate</button>\n  </div>\n  <md-grid-list cols=\"2\" rowHeight=\"500\">\n    <md-grid-tile>\n      <agm-map #map [latitude]=\"lat\" [longitude]=\"lng\" [zoom]=\"14\" (mapReady)=\"onMapReady($event)\"></agm-map>\n    </md-grid-tile>\n    <md-grid-tile >\n      <div class=\"places-container\">\n        <h3>Places:</h3>\n        <soup-list [listItems]=\"placesNames\" (itemRemoved)=\"removePlace($event)\"></soup-list>\n\n      </div>\n    </md-grid-tile>\n  </md-grid-list>\n  <h6>\n    Created by: Albert Cullell & Llorenç Pujol\n  </h6>\n\n\n</div>\n"

/***/ }),

/***/ 700:
/***/ (function(module, exports) {

module.exports = "<div class=\"dialog-title\" md-dialog-title> You can only put maximum 7 places </div>\r\n<button md-button md-dialog-close>OK</button>\r\n"

/***/ }),

/***/ 701:
/***/ (function(module, exports) {

module.exports = "<md-input-container dividerColor=\"primary\">\r\n  <div>\r\n    <input mdInput placeholder=\"Search points\" value=\"\" (input)=\"onInputChange($event.target.value)\">\r\n   </div>\r\n</md-input-container>\r\n\r\n"

/***/ }),

/***/ 702:
/***/ (function(module, exports) {

module.exports = "<md-chip-list>\r\n  <md-chip *ngFor=\"let item of listItems; let i = index;\">\r\n    <div class=\"chip-inner\">\r\n      {{i+1}}-{{item}}\r\n      <md-icon (click)=\"remove(i)\">close</md-icon>\r\n    </div>\r\n  </md-chip>\r\n</md-chip-list>\r\n"

/***/ }),

/***/ 964:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(488);


/***/ })

},[964]);
//# sourceMappingURL=main.bundle.js.map