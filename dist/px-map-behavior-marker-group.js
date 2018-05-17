'use strict';var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err}finally{try{if(!_n&&_i['return'])_i['return']()}finally{if(_d)throw _e}}return _arr}return function(arr,i){if(Array.isArray(arr)){return arr}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i)}else{throw new TypeError('Invalid attempt to destructure non-iterable instance')}}}();var _typeof=typeof Symbol==='function'&&typeof Symbol.iterator==='symbol'?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==='function'&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj};/**
 * @license
 * Copyright (c) 2018, General Electric
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(function(){'use strict';/****************************************************************************
   * BEHAVIORS
   ****************************************************************************//* Ensures the behavior namespace is created */window.PxMapBehavior=window.PxMapBehavior||{};/**
   *
   * @polymerBehavior PxMapBehavior.MarkerGroup
   */PxMapBehavior.MarkerGroupImpl={properties:{/**
       * A human-readable name for this layer group. If the map has a layer
       * control panel, the user will click this name to show, hide, or
       * manipulate this layer.
       *
       * @type {String}
       */name:{type:String,notify:true},/**
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
       */data:{type:Object,observer:'shouldUpdateInst'},/**
       * Internal representation of the colorsByType object. See `_calculateColorsByType`.
       * @type {Object}
       */_colorsByType:{type:Object,value:function value(){return{}}},/**
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
       */colorsByType:{type:Object,value:function value(){return{}},observer:'_calculateColorsByType'},/**
       * Overrides the default icon creation function to allow drawing of custom
       * cluster and marker icons. Note that if you replace these functions you
       * should ensure your custom functions are very fast — these methods are
       * called continuously as the user zooms through the map and clusters and
       * markers are redrawn.
       *
       * Pass in an object with keys `cluster` or `marker` and values of functions.
       * You can pass in one or both keys/values depending on which icon(s)
       * you want to create.
       *
       * - The `cluster` function should accept one parameter, an `L.MarkerCluster` instance, and return a constructed `L.Icon` or `L.DivIcon` instance.
       * - The `marker` function should accept one parameter, an Object with marker settings, and return a constructed `L.Marker` instance with an attached icon.
       *
       * @type {Object}
       */iconFns:{type:Object,value:function value(){return{cluster:undefined,marker:undefined}}},/**
       * Allows advanced configurations of the cluster behaviors and styles. Note
       * that the cluster comes pre-configured with settings that will work
       * for most use cases; the `clusterConfig` allows those settings to be
       * overriden but may cause unexpected behaviors when conflicting settings
       * are used. Leave the default configuration (by not setting this attribute)
       * if you're unsure of how to use it.
       *
       * The following settings are available:
       *
       * - {Boolean} `showCoverageOnHover`: [default=true] Shows the bounds of a cluster as a polygon when its icon is hovered
       * - {Boolean} `zoomToBoundsOnClick`: [default=true] Zooms to bounds of a cluster when its icon is clicked
       * - {Boolean} `spiderfyOnMaxZoom`: [default=true] Spiderfies the markers in a cluster when it is clicked at the max zoom level
       * - {Boolean} `removeOutsideVisibleBounds`: [default=true] Removes cluster icons and markers when they are too far outside the visible map bounds
       * - {Boolean} `animate`: [default=true] Animates cluster splitting, joining, zooming, and spiderfying
       * - {Number} `disableClusteringAtZoom`: [default=undefined] If set, when the user zooms below this level markers will not be clustered (do not combine with `spiderfyOnMaxZoom`)
       * - {Number} `maxClusterRadius`: [default=150] The maximum radius in pixels a cluster will cover from the central marker. Lower numbers make smaller clusters. Setting below the default may cause cluster icons to overlap.
       * - {Object} `polygonOptions`: [default=150] Options passed to draw the cluster cover polygon
       *   - {Boolean} `polygonOptions.stroke`: [default=true] If true the polygon will have a stroke line around the outside
       *   - {String} `polygonOptions.color`: [default=--px-map-marker-group-cluster-polygon-stroke-color] Sets the stroke color, prefer setting with the style variable
       *   - {String} `polygonOptions.fillColor`: [default=--px-map-marker-group-cluster-polygon-fill-color] Sets the fill color color, prefer setting with the style variable.
       *   - {Number} `polygonOptions.fillOpacity`: [default=0.4] Sets the opacity of the polygon fill
       * - {Object} `spiderLegPolylineOptions`: [default=undefined] Sets the style for the marker spiderfy legs, see [PolylineOptions](http://leafletjs.com/reference.html#polyline-options)
       *
       * @type {Object}
       */clusterConfig:{type:Object}},// PUBLIC METHODS
/**
     * Forces the marker group to check the `data` attribute, look for differences
     * in the data from the last draw, and make any necessary updates. Call this
     * method if you are passing an object by reference to `data` and making
     * deep updates that don't trigger changes.
     */update:function update(){if(!this.elementInst)return;var _getInstOptions=this.getInstOptions(),data=_getInstOptions.data;var features=this._syncDataWithMarkers(data.features,this.elementInst);this._notifyNewFeatures(features)},/**
     * Skips the smart diffing system that only updates markers when their
     * feature properties have changed. Forces a redraw of all markers
     */redraw:function redraw(){if(!this.elementInst)return;this._clearAllMarkersAndData(this.elementInst);this.update()},// INSTANCE METHODS
addInst:function addInst(parent){// Bind custom events for this cluster. Events will be unbound automatically.
var spiderifyFn=this._handleClusterSpiderify.bind(this);var unspiderifyFn=this._handleClusterUnspiderify.bind(this);var markerTapFn=this._handleSingleMarkerTap.bind(this);var markerDoubleClickFn=this._handleSingleMarkerDoubleClick.bind(this);var clusterTapFn=this._handleClusterTap.bind(this);this.bindEvents({'spiderfied':spiderifyFn,'unspiderfied':unspiderifyFn,'click':markerTapFn,'dblclick':markerDoubleClickFn,'clusterclick':clusterTapFn});PxMapBehavior.LayerImpl.addInst.call(this,parent);this.async(function(){this.fire('px-map-marker-group-added')})},/**
     * Fired when the marker group is attached to a parent layer (e.g. the map).
     *
     * Note that it isn't guaranteed that all marker clusters and individual
     * markers added to the group have drawn, only that the marker group itself
     * has attached to a parent. Marker clusters and individual may be drawn
     * asynchronously, and data may be added or changed later to cause additional
     * redraws.
     *
     * Listen to the `px-map-marker-group-features-changed` event for notifications
     * on the features in the cluster.
     *
     * @event px-map-marker-group-added
     */removeInst:function removeInst(parent){PxMapBehavior.LayerImpl.removeInst.call(this,parent)},createInst:function createInst(){var options=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var cluster=L.markerClusterGroup(options);if(options.data){var features=this._syncDataWithMarkers(options.data.features,cluster);this._notifyNewFeatures(features)}return cluster},updateInst:function updateInst(lastOptions,nextOptions){if(nextOptions.data){var features=this._syncDataWithMarkers(nextOptions.data.features,this.elementInst);this._notifyNewFeatures(features)}},getInstOptions:function getInstOptions(){// Set the default cluster options
var defaultOptions={showCoverageOnHover:true,maxClusterRadius:150,spiderifyOnMaxZoom:true,removeOutsideVisibleBounds:true,animate:true,polygonOptions:{stroke:true,color:this.getComputedStyleValue('--internal-px-map-marker-group-cluster-polygon-stroke-color'),fillColor:this.getComputedStyleValue('--internal-px-map-marker-group-cluster-polygon-fill-color'),fillOpacity:0.4}};// Overwrite with any developer-provided cluster options in `clusterConfig`
var options=Object.assign(defaultOptions,this.clusterConfig||{});// Assign the `data` and `iconCreateFunction` options. These cannot be
// configured through the `clusterConfig` attribture
options.data=this._getValidData();options.iconCreateFunction=this._createClusterIcon.bind(this);// Return the options composed together
return options},/**
     * Takes a `Set` of feature objects. Fires an event with the bounds of the
     * feature set.
     *
     * @param {Set} featureSet
     */_notifyNewFeatures:function _notifyNewFeatures(featureSet){if(!featureSet||!(featureSet instanceof Set)||!featureSet.size)return;this.async(function _notifyNewFeaturesDebounce(){var bounds=L.latLngBounds();var feature=void 0;var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=featureSet[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){feature=_step.value;// Reminder: the coordinates array is backwards, switch from `lngLat` to `latLng`
bounds.extend([feature.geometry.coordinates[1],feature.geometry.coordinates[0]])}}catch(err){_didIteratorError=true;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}this.fire('px-map-marker-group-features-changed',{bounds:bounds})},1)},/**
     * Fired when the marker group's features are changed (i.e. when a GeoJSON
     * FeatureCollection is set or updated through the group's `data` attribute).
     * If any features are available, sends out the extend of their bounds.
     *
     *   * {Object} detail - Contains the event details
     *   * {L.LatLngBounds} detail.bounds - Custom Leaflet bounds instance representing the total area covered by the features
     *
     * @event px-map-marker-group-features-changed
     *//**
     * Determines if the data provided through the `data` attribute appears to
     * be valid GeoJSON. This is a high-level check for the existence of
     * necessary keys/values. It does not deeply validate each feature
     * for correctness.
     */_getValidData:function _getValidData(){if(!this.data){// It's possible we will be initialized without any data. Don't complain
// loudly if there's no data, just return `undefined`.
return undefined}var dataIsNotValid=_typeof(this.data)!=='object'||this.data.type!=='FeatureCollection'||!Array.isArray(this.data.features)||!this.data.features.length||_typeof(this.data.features[0])!=='object';if(dataIsNotValid){console.log('PX-MAP CONFIGURATION ERROR:\n          The `data` attribute for '+this.is+' is not valid GeoJSON. Valid GeoJSON\n          that follows the FeatureCollection standard is required to draw the\n          marker clusters. See the GeoJSON spec website (http://geojson.org/geojson-spec.html)\n          for more information on what is required.\n\n          The minimum requirements for '+this.is+' are:\n          - Must be a valid JavaScript object (or deserializable to an object)\n          - Must have key `type` with value \'FeatureCollection\'\n          - Must have key `features` with value of an array with length\n          - Each entry in `features` must be a valid object\n        ');return undefined}return this.data},created:function created(){var updateFn=this.updateStyles;this.updateStyles=this._handleStylesUpdated.bind(this);this._updateStylesFn=updateFn},/**
     * Proxies the default `updateStyles` function provided by Polymer. When the
     * `updateStyles` function is run we know the colors for markers may have
     * been changed (e.g. by setting new CSS custom properties). We allow
     * the update to happen then get the colors for the markers again. If
     * any colors are changed from the last draw, we redraw the markers.
     */_handleStylesUpdated:function _handleStylesUpdated(){this._updateStylesFn();this._calculateColorsByType(this.colorsByType)},_createClusterIcon:function _createClusterIcon(cluster){// If the developer supplies a `iconFns.cluster` function, pass the options
// to that function and return the result.
if(this.iconFns.cluster){return this.iconFns.cluster.call(this,cluster)}// Otherwise, build the marker ourselves
var markers=cluster.getAllChildMarkers();var count=markers.length;// Count markers and group by type
var types=this._indexClusterMarkersByType(markers);// Get the colors for each type
var colors=this._colorsByType;// Get the container size for this count
var containerSize=this._getClusterIconSize(count);// Get the path (chart stroke width) and border width for this chart
var pathSize=this._getStyleValueAsNum('--internal-px-map-marker-group-cluster-path-size')||10;var borderSize=this._getStyleValueAsNum('--internal-px-map-marker-group-cluster-border-size')||0;// Set up the options to send into ClusterIcon
var options={count:count,countByType:types,colorsByType:colors,containerSize:containerSize,pathSize:pathSize,borderSize:borderSize,styleScope:this.isShadyScoped()?this.getShadyScope():undefined};return new PxMap.ClusterIcon(options)},/**
     * Calculates the colors for the marker icons and clusters. The following
     * things are read and applied:
     *
     * 1. `colorsByType` property/attribute set by the developer
     * ...OVERRIDES...
     * 2. CSS custom properties decoded into an object (from `_getAllIconColors`),
     *    includes default colors
     *
     * If called again later when colors are updated, checks if the colors
     * have changed and redraws all markers to pick up the changes.
     *
     * @param  {Object} publicColorsByType
     */_calculateColorsByType:function _calculateColorsByType(publicColorsByType){var newColorsByType=Object.assign({},this._getAllIconColors(),publicColorsByType||{});var lastColorsByTypeStringified=JSON.stringify(this._colorsByType);if(JSON.stringify(newColorsByType)!==lastColorsByTypeStringified){this._colorsByType=newColorsByType;if(lastColorsByTypeStringified!=='{}'){// If the last colorsByType was not empty, this isn't the first time
// we set the colors. We should redraw to force all the clusters
// to pick up their new colors. We want to guard against doing
// this the first time colorsByType is set so we don't waste a bunch
// of time drawing the markers then throw it away and redraw them.
this.redraw()}}},/**
     * Creates and returns a `colors` object from CSS custom properties. If the
     * developer does not set any of the CSS properties, a default color will
     * be used for the four standard icon types.
     *
     * @return {Object}
     */_getAllIconColors:function _getAllIconColors(){var colors={};colors.info=this.getComputedStyleValue('--internal-px-map-icon-info-color');colors.warning=this.getComputedStyleValue('--internal-px-map-icon-warning-color');colors.important=this.getComputedStyleValue('--internal-px-map-icon-important-color');colors.unknown=this.getComputedStyleValue('--internal-px-map-icon-unknown-color');var customColor=void 0;for(var i=0;i<101;i++){customColor=this.getComputedStyleValue('--px-map-color-custom-'+i);if(!customColor||customColor===''){break}colors['custom-'+i]=customColor}return colors},_getStyleValueAsNum:function _getStyleValueAsNum(styleValName){// Try to get from the "cache"
this.__styleVals=this.__styleVals||{};if(this.__styleVals[styleValName])return this.__styleVals[styleValName];var computedVal=this.getComputedStyleValue(styleValName);if(computedVal&&computedVal.indexOf('px')!==-1){var valWithoutSuffix=computedVal.replace('px','');var valAsNum=Math.floor(valWithoutSuffix);this.__styleVals[styleValName]=valAsNum;return valAsNum}else{return undefined}},_getClusterIconSize:function _getClusterIconSize(count){// for count 1-9, size is small
if(count<10){return 60}// for count 10-39, size is medium
if(count>=10&&count<40){return 75}// for count 40+, size is large
if(count>40){return 90}},/**
     * Takes a group of marker instances and returns an object with keys of the
     * marker types in the group and values with the number of markers in
     * each group.
     *
     * @param {Array} markers - Array of marker instances
     * @return {Object}
     */_indexClusterMarkersByType:function _indexClusterMarkersByType(markers){return markers.reduce(function(types,marker){if(marker.featureProperties&&marker.featureProperties['marker-icon']&&marker.featureProperties['marker-icon']['icon-type']){types[marker.featureProperties['marker-icon']['icon-type']]=(types[marker.featureProperties['marker-icon']['icon-type']]||0)+1}return types},{})},/**
     * Clears all markers and clusters from the marker group. Clears out the
     * cached `_features` and `_markers` values so that `_syncDataWithMarkers`
     * will treat all data as new and redraw it the next time it is called.
     */_clearAllMarkersAndData:function _clearAllMarkersAndData(clusterInst){clusterInst.clearLayers();this._features=null;this._markers=null},/**
     * Takes an array of GeoJSON feature objects and an `L.MarkerClusterGroup`
     * instance. Diffs the feature array against any previous feature arrays
     * passed to this method and updates the cluster instance. Returns a
     * `Set` of features.
     *
     * @param {Array} newFeatures
     * @param {L.MarkerClusterGroup} clusterInst
     * @return {Set} features
     */_syncDataWithMarkers:function _syncDataWithMarkers(newFeatures,clusterInst){if(!newFeatures.length)return;var featuresSet=this._features=this._features||new Set;var markersMap=this._markers=this._markers||new WeakMap;var _diffNewFeatures=this._diffNewFeatures(newFeatures,featuresSet,markersMap),featuresToAdd=_diffNewFeatures.featuresToAdd,featuresToUpdate=_diffNewFeatures.featuresToUpdate,featuresToRemove=_diffNewFeatures.featuresToRemove,nextFeaturesSet=_diffNewFeatures.nextFeaturesSet,nextMarkersMap=_diffNewFeatures.nextMarkersMap;var feature=void 0,cachedMarker=void 0,markersToOperate=void 0;if(featuresToAdd.size){markersToOperate=[];var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=featuresToAdd[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){feature=_step2.value;cachedMarker=nextMarkersMap.get(feature);cachedMarker.marker=this._createMarker(feature);markersToOperate.push(cachedMarker.marker);nextMarkersMap.set(feature,cachedMarker)}}catch(err){_didIteratorError2=true;_iteratorError2=err}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return()}}finally{if(_didIteratorError2){throw _iteratorError2}}}clusterInst.addLayers(markersToOperate);markersToOperate=null}if(featuresToUpdate.size){markersToOperate=[];var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=featuresToUpdate[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){feature=_step3.value;cachedMarker=nextMarkersMap.get(feature);cachedMarker.marker=this._updateMarker(feature,cachedMarker.marker);markersToOperate.push(cachedMarker.marker);nextMarkersMap.set(feature,cachedMarker)}}catch(err){_didIteratorError3=true;_iteratorError3=err}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return()}}finally{if(_didIteratorError3){throw _iteratorError3}}}clusterInst.refreshClusters(markersToOperate);markersToOperate=null}if(featuresToRemove.size){markersToOperate=[];var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=featuresToRemove[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=true){feature=_step4.value;cachedMarker=nextMarkersMap.get(feature);markersToOperate.push(cachedMarker.marker);nextMarkersMap.delete(feature)}}catch(err){_didIteratorError4=true;_iteratorError4=err}finally{try{if(!_iteratorNormalCompletion4&&_iterator4.return){_iterator4.return()}}finally{if(_didIteratorError4){throw _iteratorError4}}}clusterInst.removeLayers(markersToOperate);markersToOperate=null}this._features=nextFeaturesSet;this._markers=nextMarkersMap;featuresSet.clear();featuresToAdd.clear();featuresToUpdate.clear();featuresToRemove.clear();return this._features},_diffNewFeatures:function _diffNewFeatures(newFeatures,lastFeatureSet,markerMap){// Keep track of our new feature set, which will replace `featureSet`
var nextFeaturesSet=new Set;// Keep track of markers to add
var featuresToAdd=new Set;var featuresToUpdate=new Set;// Placeholders for our loop
var i=void 0,len=void 0,valid=void 0,known=void 0,cachedMarker=void 0,featureHash=void 0;// Loop over features to add unknown features to the cluster or update known features if necessary
for(i=0,len=newFeatures.length;i<len;i++){// If these tests aren't met, the feature is invalid and can't be drawn as a marker
// Any invalid markers won't be visited and will be removed
valid=newFeatures[i].id&&newFeatures[i].geometry&&newFeatures[i].geometry.type==='Point'&&newFeatures[i].geometry.coordinates instanceof Array&&newFeatures[i].geometry.coordinates.length===2;if(!valid)continue;// Determine if this feature is already represented in the cluster
known=lastFeatureSet.has(newFeatures[i]);// This is a valid feature we don't know, create a marker for this feature and add it.
if(!known){// Mark this as a marker to add
featuresToAdd.add(newFeatures[i]);// Remove from last feature set and add to next feature set
lastFeatureSet.delete(newFeatures[i]);nextFeaturesSet.add(newFeatures[i]);// Build a new cached marker object with a hash of the feature
cachedMarker={marker:null,hash:JSON.stringify(newFeatures[i])};markerMap.set(newFeatures[i],cachedMarker);// Skip to next loop iteration
continue}// We know this feature and have a marker for it. Ensure the marker is up-to-date.
if(known){cachedMarker=markerMap.get(newFeatures[i]);featureHash=JSON.stringify(newFeatures[i]);// If there's a difference, mark this marker as one to update
if(cachedMarker.hash!==featureHash){featuresToUpdate.add(newFeatures[i]);// Update the cached marker object with the new hash of the feature
cachedMarker.hash=featureHash;markerMap.set(newFeatures[i],cachedMarker)}// Remove from last feature set and add to next feature set
lastFeatureSet.delete(newFeatures[i]);nextFeaturesSet.add(newFeatures[i])}}// Any markers remaining in the last feature set need to be remove
var featuresToRemove=lastFeatureSet.size?lastFeatureSet:new Set;// Clear all references in the last feature set to ensure values can
// be garbage collected
lastFeatureSet=null;return{featuresToAdd:featuresToAdd,featuresToUpdate:featuresToUpdate,featuresToRemove:featuresToRemove,nextFeaturesSet:nextFeaturesSet,nextMarkersMap:markerMap}},_createMarker:function _createMarker(feature){// Extract geometry (GeoJSON coordinate pairs are Lat/Lng, we need Lng/Lat,
// so we have to reverse)
var _feature$geometry$coo=_slicedToArray(feature.geometry.coordinates,2),lat=_feature$geometry$coo[0],lng=_feature$geometry$coo[1];// Create a marker
var marker=L.marker([lng,lat]);// If any icon settings were passed with the feature, fetch them to pass
// to the icon constructor
var iconSettings=feature.properties['marker-icon']?this._extractMarkerIconSettings(feature.properties['marker-icon']):{};iconSettings.base=iconSettings.base||'static-icon';iconSettings.type=iconSettings.type||'info';iconSettings.color=this._colorsByType[iconSettings.type]||'black';var icon=this._createMarkerIcon(iconSettings);marker.setIcon(icon);// Attach the properties to the marker instance to read later
marker.featureProperties=feature.properties;return marker},_updateMarker:function _updateMarker(feature,marker){var _marker$getLatLng=marker.getLatLng(),lat=_marker$getLatLng.lat,lng=_marker$getLatLng.lng;var _feature$geometry$coo2=_slicedToArray(feature.geometry.coordinates,2),nextLng=_feature$geometry$coo2[0],nextLat=_feature$geometry$coo2[1];if(lat!==Number(nextLat)||lng!==Number(nextLng)){marker.setLatLng([nextLat,nextLng])}var iconSettings=feature.properties['marker-icon']?this._extractMarkerIconSettings(feature.properties['marker-icon']):{};iconSettings.base=iconSettings.base||'static-icon';iconSettings.type=iconSettings.type||'info';var icon=this._createMarkerIcon(iconSettings);marker.setIcon(icon);// Attach the properties to the marker instance to read later
marker.featureProperties=feature.properties;return marker},_extractMarkerIconSettings:function _extractMarkerIconSettings(featSettings){var featSettingsKeys=Object.keys(featSettings);if(!featSettingsKeys.length)return undefined;var iconSettings={};var i=void 0,len=void 0,featKeyCamelized=void 0;for(i=0,len=featSettingsKeys.length;i<len;i++){if(featSettingsKeys[i].substring(0,5)!=='icon-')continue;featKeyCamelized=featSettingsKeys[i].substring(5).replace(/(\-[a-z])/g,function(match){return match.charAt(1).toUpperCase()});iconSettings[featKeyCamelized]=featSettings[featSettingsKeys[i]]}return iconSettings},_createMarkerIcon:function _createMarkerIcon(options){// If the developer supplies a `iconFns.marker` function, pass the options
// to that function and return the result.
if(this.iconFns.marker){return this.iconFns.marker.call(this,options)}// If we are in Shady DOM with a style scope, apply it
options.styleScope=this.isShadyScoped()?this.getShadyScope():undefined;// Otherwise, attempt to convert the feature's 'icon-base' to a klass name
// and call the constructor for that klass
var klassName=this._strToKlassName(options.base);return new PxMap[klassName](options)},_strToKlassName:function _strToKlassName(str){return str.charAt(0).toUpperCase()+str.substring(1).replace(/(\-[a-z])/g,function(match){return match.charAt(1).toUpperCase()})},/**
     * When the cluster is spiderified, set its visibility to hidden to ensure
     * it is not kept around as an opaque background to the markers.
     */_handleClusterSpiderify:function _handleClusterSpiderify(evt){if(!evt||!evt.cluster||!evt.cluster._icon)return;evt.cluster._icon.style.visibility='hidden'},/**
     * When the cluster is unspiderified, set its visibility to visible to ensure
     * it is shown again on the map.
     */_handleClusterUnspiderify:function _handleClusterUnspiderify(evt){if(!evt||!evt.cluster||!evt.cluster._icon)return;evt.cluster._icon.style.visibility='visible'},/**
     * When an individual marker (not a marker cluster) is clicked, if that
     * marker has a popup attribute, bind a show a popup.
     */_handleSingleMarkerTap:function _handleSingleMarkerTap(evt){if(evt.layer&&evt.layer.getLatLng()instanceof L.LatLng){var latLng=L.latLng(evt.layer.getLatLng());var lat=latLng.lat,lng=latLng.lng;var detail={latLng:latLng,lat:lat,lng:lng,feature:evt.layer.featureProperties?evt.layer.featureProperties:undefined};this.fire('px-map-marker-group-marker-tapped',detail)}if(evt.layer&&evt.layer.featureProperties&&evt.layer.featureProperties.hasOwnProperty('marker-popup')){this._bindAndOpenPopup(evt.layer)}},/**
     * Fired when an individual marker (not a cluster) is tapped by the user.
     *
     *   * {Object} detail - Contains the event details
     *   * {Number} detail.lat - Latitude of the marker
     *   * {Number} detail.lng - Longitude of the marker
     *   * {L.LatLng} detail.latLng - Custom Leaflet object containing the lat and lng
     *   * {Object|undefined} detail.feature - Object containing the marker's GeoJSON source
     *
     * @event px-map-marker-group-marker-tapped
     */_handleSingleMarkerDoubleClick:function _handleSingleMarkerDoubleClick(evt){var latLng=L.latLng(evt.layer.getLatLng());var lat=latLng.lat,lng=latLng.lng;var detail={latLng:latLng,lat:lat,lng:lng,feature:evt.layer.featureProperties?evt.layer.featureProperties:undefined};this.fire('px-map-marker-group-marker-double-clicked',detail)},/**
     * Fired when an individual marker (not a cluster) is double clicked by the user.
     * Note that this will only work on non-touch (e.g. desktop) devices. Touch (e.g. mobile) devices cannot respond to double click/tap events.
     *
     *   * {Object} detail - Contains the event details
     *   * {Number} detail.lat - Latitude of the marker
     *   * {Number} detail.lng - Longitude of the marker
     *   * {L.LatLng} detail.latLng - Custom Leaflet object containing the lat and lng
     *   * {Object|undefined} detail.feature - Object containing the marker's GeoJSON source
     *
     * @event px-map-marker-group-marker-double-clicked
     */_handleClusterTap:function _handleClusterTap(evt){var latLngBounds=evt.layer.getBounds();var markers=evt.layer.getAllChildMarkers();var features=[];for(var i=0;i<markers.length;i++){features.push(markers[i].featureProperties)}var detail={bounds:latLngBounds,features:features};this.fire('px-map-marker-group-cluster-tapped',detail)},/**
     * Fired when a cluster icon (not an individual marker) is tapped by the user.
     *
     *   * {Object} detail - Contains the event details
     *   * {L.LatLngBounds} detail.bounds - Custom Leaflet bounds instance representing the total area covered by the features in this cluster
     *   * {Array} detail.features - Array of features that are drawn as markers in this cluster
     *
     * @event px-map-marker-group-cluster-tapped
     */_bindAndOpenPopup:function _bindAndOpenPopup(marker){if(!marker||!marker.bindPopup||!marker.openPopup)return;var popupSettings=this._featSettingsToProps(marker.featureProperties['marker-popup'],'popup');if(!popupSettings||!Object.keys(popupSettings).length)return;var klassName=popupSettings._Base&&PxMap.hasOwnProperty(popupSettings._Base)?popupSettings._Base:'InfoPopup';var popup=new PxMap[klassName](popupSettings);marker.bindPopup(popup).openPopup();marker.__boundCloseFn=this._unbindAndClosePopup.bind(this,marker);marker.on('popupclose',marker.__boundCloseFn)},_unbindAndClosePopup:function _unbindAndClosePopup(marker){if(!marker||!marker.getPopup||!marker.getPopup())return;marker.off('popupclose',marker.__boundCloseFn);marker.__boundCloseFn=null;marker.closePopup().unbindPopup()},/**
     * Takes an object harvested from a GeoJSON feature `properties` block and
     * converts it into properties that can be passed to a constructor.
     *
     * For example, takes an object like this:
     *
     * ```
     * {
     *   "popup-base" : "data-popup",
     *   "popup-title" : "Some title",
     *   "popup-data" : { ... }
     * }
     * ```
     *
     * and returns an object like this:
     *
     * ```
     * {
     *   "_Base" : "DataPopup",
     *   "title" : "Some title",
     *   "data" : { ... }
     * }
     * ```
     *
     * Optionally, pass a prefix as a string to extract the correct properties.
     * E.g. to extract "popup-title" to "title", pass the prefix "popup".
     * If you pass no prefix param, everything that matches the dash case
     * search `/[a-z]+\-(.*)/` will be returned
     *
     * Keys that match the pattern `*-base` will be converted from dash case to
     * class case (e.g. 'data-popup' to 'PopupData') and returned with the `_Base`
     * key to help call a constructor by reference.
     *
     * @param {Object} settings
     * @param {String} [prefix]
     * @return {Object}
     */_featSettingsToProps:function _featSettingsToProps(settings,prefix){var keys=Object.keys(settings);if(!keys.length)return undefined;var settingsAsProps={};var i=0,len=keys.length,newKey=void 0;for(;i<len;i++){// Check if it has the prefix
if(prefix&&keys[i].substr(0,prefix.length)!==prefix){continue}// If it's the base, classify it and set it as the `_Base` key
if(/^[A-Za-z]+\-base$/.test(keys[i])){settingsAsProps['_Base']=this._strToKlassName(settings[keys[i]]);continue}newKey=keys[i].replace(/^[A-Za-z]+\-(.*)$/,'$1');settingsAsProps[newKey]=settings[keys[i]]}return settingsAsProps}};/* Bind MarkerGroup behavior *//** @polymerBehavior */PxMapBehavior.MarkerGroup=[PxMapBehavior.Layer,PxMapBehavior.MarkerGroupImpl]})();
//# sourceMappingURL=px-map-behavior-marker-group.js.map
