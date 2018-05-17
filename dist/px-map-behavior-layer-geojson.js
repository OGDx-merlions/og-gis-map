'use strict';var _typeof=typeof Symbol==='function'&&typeof Symbol.iterator==='symbol'?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==='function'&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj};/**
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
   * @polymerBehavior PxMapBehavior.GeoJSONLayer
   */PxMapBehavior.GeoJSONLayerImpl={properties:{/**
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
       */data:{type:Object,observer:'shouldUpdateInst'},/**
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
       */featureStyle:{type:Object,observer:'shouldUpdateInst'},/**
       * If set, a popup containing a feature's properties will be opened when
       * the user taps that feature. The following properties will be filtered
       * out: the property key `style` and its value; any properties with the
       * value "unset" as a string.
       *
       * Note: A data-style popup will be used. This popup currently cannot be
       * configured and will use its default configuration.
       *
       * @type {Boolean}
       */showFeatureProperties:{type:Boolean,value:false,observer:'shouldUpdateInst'}},/**
     * Forces the GeoJSON layer to deeply check the `data` attribute for differences
     * in the data from the last draw, and make any necessary updates. Call this
     * method if you are passing an object by reference to `data` and making deep
     * updates that don't trigger property observers.
     *
     * @return {undef}
     */update:function update(){if(!this.elementInst)return;this.shouldUpdateInst()},canAddInst:function canAddInst(){return this.data&&_typeof(this.data)==='object'&&Object.keys(this.data).length},// extends the layer `addInst` method to harvest and fire events
addInst:function addInst(parent){var _this=this;// Bind custom events. Events will be unbound automatically.
var addedFn=this._handleFeatureAdded.bind(this);var removedFn=this._handleFeatureRemoved.bind(this);this.bindEvents({'layeradd':addedFn,'layerremove':removedFn});// If any layers already added before events bound, manually fire layer
// added events to attach listeners/notify the world the layer is added
if(this.elementInst.getLayers().length!==0){this.elementInst.eachLayer(function(layer){_this.elementInst.fire('layeradd',{layer:layer})})}// Now call layer's add
PxMapBehavior.LayerImpl.addInst.call(this,parent)},createInst:function createInst(options){var _this2=this;var styleAttributeProperties=this.getInstOptions().featureStyle;var geojsonLayer=L.geoJson(options.data,{pointToLayer:function pointToLayer(feature,latlng){var featureProperties=feature.properties.style||{};var attributeProperties=options.featureStyle;var style=_this2._getStyle(feature,featureProperties,attributeProperties);return new L.CircleMarker(latlng,style)},onEachFeature:function onEachFeature(feature,layer){if(!_this2.showFeatureProperties)return;_this2._bindPopup(feature,layer)},style:function style(feature){var featureProperties=feature.properties.style||{};return _this2._getStyle(featureProperties,styleAttributeProperties)}});return geojsonLayer},_getStyle:function _getStyle(featureProperties,attributeProperties){return{radius:featureProperties.radius||attributeProperties.radius||5,color:featureProperties.color||attributeProperties.color||'#3E87E8',//primary-blue,
fillColor:featureProperties.fillColor||attributeProperties.fillColor||'#88BDE6',//$dv-light-blue
weight:featureProperties.weight||attributeProperties.weight||2,opacity:featureProperties.opacity||attributeProperties.opacity||1,fillOpacity:featureProperties.fillOpacity||attributeProperties.fillOpacity||0.4}},_bindFeaturePopups:function _bindFeaturePopups(){var _this3=this;if(!this.elementInst)return;this.elementInst.eachLayer(function(layer){return _this3._bindPopup(layer.feature,layer)})},_bindPopup:function _bindPopup(feature,layer){// Filter keys to remove info that should not be displayed in a popup.
// If no keys remain, do not bind a popup.
var popupDataKeys=Object.keys(feature.properties).filter(function(key){return feature.properties.hasOwnProperty(key)&&feature.properties[key]!=='unset'&&key!=='style'});if(!popupDataKeys.length)return;var popupData=popupDataKeys.reduce(function(accum,key){accum[key]=feature.properties[key];return accum},{});var popup=new PxMap.DataPopup({title:'Feature Properties',data:popupData,autoPanPadding:[1,1]});layer.bindPopup(popup)},_unbindFeaturePopups:function _unbindFeaturePopups(){var _this4=this;if(!this.elementInst)return;this.elementInst.eachLayer(function(layer){return _this4._unbindPopup(layer)})},_unbindPopup:function _unbindPopup(layer){if(typeof layer.getPopup()!=='undefined'){layer.unbindPopup()}},/*
     * Update the instance if the new data is not the same as the old OR if the
     * new style is not the same as the old. (Stringifying is needed here to be
     * able to do a deep equality check).
     */updateInst:function updateInst(lastOptions,nextOptions){var _this5=this;if(!Object.keys(nextOptions.data).length){this.elementInst.clearLayers()}else if(Object.keys(nextOptions.data).length&&(lastOptions.dataHash!==nextOptions.dataHash||lastOptions.featureStyleHash!==nextOptions.featureStyleHash)){var styleAttributeProperties=this.getInstOptions().featureStyle;this.elementInst.clearLayers();this.elementInst.options.style=function(feature){var featureProperties=feature.properties.style||{};return _this5._getStyle(featureProperties,styleAttributeProperties)};this.elementInst.addData(nextOptions.data);if(nextOptions.showFeatureProperties){this._bindFeaturePopups()}}else if(lastOptions.showFeatureProperties!==nextOptions.showFeatureProperties){if(nextOptions.showFeatureProperties)this._bindFeaturePopups();if(!nextOptions.showFeatureProperties)this._unbindFeaturePopups()}},getInstOptions:function getInstOptions(){return{data:this.data||{},dataHash:JSON.stringify(this.data||{}),featureStyle:this.featureStyle||{},featureStyleHash:JSON.stringify(this.featureStyle||{}),showFeatureProperties:this.showFeatureProperties}},_handleFeatureAdded:function _handleFeatureAdded(evt){if(!evt||!evt.layer)return;// Bind layer click events
evt.layer.on('click',this._handleFeatureTapped.bind(this));evt.layer.on('popupopen',this._handleFeaturePopupOpened.bind(this));evt.layer.on('popupclose',this._handleFeaturePopupClosed.bind(this));var detail={};if(evt.layer&&evt.layer.feature){detail.feature=evt.layer.feature}this.fire('px-map-layer-geojson-feature-added',detail)},/**
     * Fired when a feature is attached the map. Note that every feature is
     * added/removed when any part of the `data` attribute is updated.
     *
     *   * {Object} detail - Contains the event details
     *   * {Object|undefined} detail.feature - Object containing the feature's GeoJSON source
     *
     * @event px-map-layer-geojson-feature-added
     */_handleFeatureRemoved:function _handleFeatureRemoved(evt){if(!evt||!evt.layer)return;// Unbind layer click events
evt.layer.off();var detail={};if(evt.layer&&evt.layer.feature){detail.feature=evt.layer.feature}this.fire('px-map-layer-geojson-feature-removed',detail)},/**
     * Fired when a feature is removed from the map. Note that every feature is
     * added/removed when any part of the `data` attribute is updated.
     *
     *   * {Object} detail - Contains the event details
     *   * {Object|undefined} detail.feature - Object containing the feature's GeoJSON source
     *
     * @event px-map-layer-geojson-feature-added
     */_handleFeatureTapped:function _handleFeatureTapped(evt){var detail={};if(evt.target&&evt.target.feature){detail.feature=evt.target.feature}this.fire('px-map-layer-geojson-feature-tapped',detail)},/**
     * Fired when a feature is tapped by the user.
     *
     *   * {Object} detail - Contains the event details
     *   * {Object|undefined} detail.feature - Object containing the feature's GeoJSON source
     *
     * @event px-map-layer-geojson-feature-tapped
     */_handleFeaturePopupOpened:function _handleFeaturePopupOpened(evt){var detail={};if(evt.target&&evt.target.feature){detail.feature=evt.target.feature}this.fire('px-map-layer-geojson-feature-popup-opened',detail)},/**
     * Fired when a feature's popup is opened by the user.
     *
     *   * {Object} detail - Contains the event details
     *   * {Object|undefined} detail.feature - Object containing the feature's GeoJSON source
     *
     * @event px-map-layer-geojson-feature-popup-opened
     */_handleFeaturePopupClosed:function _handleFeaturePopupClosed(evt){var detail={};if(evt.target&&evt.target.feature){detail.feature=evt.target.feature}this.fire('px-map-layer-geojson-feature-popup-closed',detail)}/**
     * Fired when a feature's popup is closed by the user.
     *
     *   * {Object} detail - Contains the event details
     *   * {Object|undefined} detail.feature - Object containing the feature's GeoJSON source
     *
     * @event px-map-layer-geojson-feature-popup-closed
     */};/* Bind GeoJSONLayer behavior *//** @polymerBehavior */PxMapBehavior.GeoJSONLayer=[PxMapBehavior.Layer,PxMapBehavior.GeoJSONLayerImpl]})();
//# sourceMappingURL=px-map-behavior-layer-geojson.js.map
