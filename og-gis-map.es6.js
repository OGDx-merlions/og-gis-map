(function() {
  Polymer({

    is: 'og-gis-map', 

    properties: {
      /**
       * Component width
       */
      width: {
        type: String,
        value: '75vw'
      },
      /**
      * Component Height
      */
      height: {
        type: String,
        value: '500px'
      },
      /**
       * The coordinate reference system to use when projecting geographic points
       * into pixel coordinates. Can only be set once before the map is first
       * initialized. If you don't know what this is, do not set it and the map
       * will default to the most common web mapping projection (EPSG3857).
       *
       * @type {L.CRS}
       */
      crs: {
        type: Object
      },
      /**
       * The latitude of the active map center. Can be used to set or update
       * the center of the map, or read from after the user moves the map to
       * get updated coordinates.
       * 
       * When `regions` is specified, latitude and longitude may be picked from there.
       * So avoid providing both
       *
       * @type {Number}
       */
      lat: {
        type: Number,
        notify: true
      },
      /**
       * The longitude of the active map center. Can be used to set or update
       * the center of the map, or read from after the user moves the map to
       * get updated coordinates.
       * 
       * When `regions` is specified, latitude and longitude may be picked from there.
       * So avoid providing both
       * 
       * @type {Number}
       */
      lng: {
        type: Number,
        notify: true
      },

      /**
       * The zoom level of the active map. Can be used to set or update
       * the zoom level of the map, or read from after the user changes the
       * map zoom level to an updated value.
       *
       * @type {Number}
       */
      zoom: {
        type: Number,
        value: 10
      },

      /**
       * The maximum zoom level for the active map (the furthest the user can
       * zoom in). Setting it at the map level will take precedence over the
       * max zoom of all other layers, including tile layers. If you need to
       * set different zoom bounds based on the visible tile layer, set the
       * max zoom directly on your tile layer.
       *
       * @type {Number}
       */
      maxZoom: {
        type: Number
      },

      /**
      * The minimum zoom level for the active map (the furthest the user can
      * zoom out). Setting it at the map level will take precedence over the
      * min zoom of all other layers, including tile layers. If you need to
      * set different zoom bounds based on the visible tile layer, set the
      * min zoom directly on your tile layer.
       *
       * @type {Number}
       */
      minZoom: {
        type: Number
      },

      /**
       * Restricts the user from moving the map outside of a specific geographic
       * boundary. The user will be bounced back if they attempt to pan outside the view.
       * Disabled by default, letting the user pan to any point on the map.
       *
       * Pass an array of [lat,lng] values like the following:
       *
       *        [[40.712, -74.227], [40.774, -74.125]]
       *
       * The first pair should represent the southwest extend of the boundary,
       * and the second  pair should represent the northeast extend of the
       * boundary.
       *
       * @type {Array}
       */
      maxBounds: {
        type: Array
      },
      /**
       * A template string that will be converted into a URL used to call the tile
       * service. Should be in the following format:
       *
       *    `http://{s}.somedomain.com/blabla/{z}/{x}/{y}.png`
       *
       * The following values will be substituted for letters in `{}` brackets:
       *
       * - `{s}`: a subdomain to call to allow the browser to make many parallel requests
       * - `{z}`: the map zoom level
       * - `{x}` and `{y}`: the coordinates for the tile
       *
       * @type {String}
       */
      tileUrl: {
        type: String,
        value: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      },
      /**
       * An object formatted as a GeoJSON FeatureCollection with one or more Features.
       * Each feature can be formatted as any valid GeoJSON geometry type: Point,
       * LineString, Polygon, MultiPoint, MultiLineString, MultiPolygon,
       * or GeometryCollection. See the [GeoJSON spec](http://geojson.org/geojson-spec.html)
       * for guidance on generating valid GeoJSON.
       *
       * Each feature should contain a `properties` object that can hold metadata
       * about the feature. Optionally, the feature's `properties.style` can be
       * set to an object that will be used to style the feature when it is drawn.
       * Styles set in a feature's `properties.style` will override the styles
       * set in the `featureStyle` attribute. See the `featureStyle` attribute
       * documentation for a list of available style options.
       *
       * @type {Object}
       */
      features: {
        type: Object,
        value() {
          return {};
        }
      },
      /**
       * An object with settings that will be used to style each feature when
       * it is added to the map. The following options are available:
       *
       * - {Boolean} `stroke`: [default=true] Set to false to disable borders on polygons/circles
       * - {String} `color`: [default=$primary-blue] Color for polygon/circle borders
       * - {Number} `weight`: [default=2] Weight for polygon/circle borders in pixels
       * - {Number} `opacity`: [default=1.0] Opacity for polygon/circle borders
       * - {Boolean} `fill`: [default=true] Set to false to disable filling polygons/circles
       * - {String} `fillColor`: [default=$dv-light-blue] Color for polygon/circle fill
       * - {Number} `fillOpacity`: [default=0.4] Opacity for polygon/circle fill
       * - {String} `fillRule`: [default='evenodd'] Defines how the [inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined
       * - {String} `lineCap`: [default='round'] Defines the [shape to be used](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) at the end of the stroke
       * - {String} `lineJoin`: [default='round'] Defines the [shape to be used](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) at the corner of a stroke
       * - {String} `dashArray`: [default=null] Defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray)
       * - {String} `dashOffset`: [default=null] Defines the [distance into the dash to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset)
       *
       * Note that styles can also be added to each feature individually (see
       * the `data` attribute documentation). Styles defined on each feature will
       * override the `featureStyle`.
       *
       * @type {Object}
       */
      featureStyle: {
        type: Object,
        value() {
          return {};
        }
      },
      /**
       * An object formatted as a GeoJSON FeatureCollection with one or many Features.
       * Each feature should be a point that will be represented as a marker.
       * See the `px-map-marker-group` API documentation page for an in-depth
       * guide that explains how to configure your features.
       *
       * The root feature collection object must have the following keys/values:
       *
       * - {String} `type`: Must be 'FeatureCollection'
       * - {Array}  `features`: An array of feature objects
       *
       * Each feature object in the collection must have the following key/values:
       *
       * - {String} `type`: Must be 'Feature'
       * - {Number} `id`: A unique numeric ID. If the feature is changed, it should keep its ID. No other features in the collection should have the same ID.
       * - {Object} `geometry`
       * - {String} `geometry.type`: Must be 'Point'
       * - {Array}  `geometry.coordinates`: a pair of coordinates in `[lng,lat]` order
       * - {Object} `properties`
       * - {Object} `properties.marker-icon`: Settings to configure a marker icon
       * - {Object} `properties.marker-popup`: [OPTIONAL] Settings to configure a marker icon
       *
       * @type {Object}
       */
      markerGroup: {
        type: Object,
        value() {
          return {};
        }
      },
      /**
       * An object mapping categories of icons to their respective colors. Each
       * key should be a string representing the name of an `icon-type` to
       * a valid CSS color value (e.g. hex color, `rgb()` color). Set the
       * `icon-type` as a sub-property of `properties.marker-icon` for each marker
       * feature in the FeatureCollection you pass into the `data` attribute.
       *
       * By default, the available types are:
       * - "unknown" : "--px-map-icon-unknown-color" (default: gray)
       * - "info" : "--px-map-icon-info-color" (default: blue)
       * - "warning" : "--px-map-icon-warning-color" (default: orange)
       * - "important" : "--px-map-icon-important-color" (default: red)
       * - "custom-n" : "--px-map-color-custom-n" (default: n/a)
       *
       * Example #1 - `colorsByType` object
       *
       * ```
       * {
       *   "info" : "blue",
       *   "warning" : "orange",
       *   "important" : "red",
       *   "unknown" : "gray"
       * }
       * ```
       *
       * Example #2 - `colorsByType` object with custom types
       *
       * ```
       * {
       *   "info" : "blue",
       *   "custom-0" : "salmon",
       *   "custom-1" : "lime",
       *   "custom-2" : "crimson"
       * }
       * ```
       *
       * @type {Object}
       */
      colorsByType: {
        type: Object,
        value(){
          return {};
        }
      },
      /**
       * List of Regions in the map. Will be rendered in the button overlay.
       * Clicking on the region will move the focus to the specific 
       * latitude and longitude in the map.
       * 
       * Format: [{label: "Region 1", lat: 100, lng: 0, default: true}, {label: "Region 2", lat: -100, lng: 0}]
       * @type {Array}
       */
      regions: {
        type: Array,
        value() {
          return []
        },
        observer: '_selectDefaultRegion'
      },
      hasRegions: {
        type: Boolean,
        computed: '_hasRegions(regions)',
        value() {
          return []
        }
      }
    },
    _hasRegions(regions){
      return regions && regions.length;
    },
    _focusRegion(evt) {
      let eventDetail = evt.detail;
      if(eventDetail.selected) {
        let item = this.regions[eventDetail.key];
        this.lat = item.lat;
        this.lng = item.lng;
        this.$.map.zoom = this.zoom;
      }
    },
    _selectDefaultRegion() {
      this.regionsDropdownData = [];
      if(this.regions) {
        this.regions.forEach((_region, idx) => {
          let obj = {
            "key": idx,
            "val": _region.label
          };
          if(_region.default) {
            this.lat = _region.lat;
            this.lng = _region.lng;
            obj.selected = true;
          }
          this.regionsDropdownData.push(obj);
        });
      }
    }
  });
})();
