'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/**
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
   * KLASSES
   ****************************************************************************//* Ensures the klass namespace is created */window.PxMap=window.PxMap||{};/**
   *
   * @class PxMap.StaticIcon
   */var StaticIcon=function(){function StaticIcon(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,StaticIcon);this.icon=this.createIcon(settings);return this.icon}_createClass(StaticIcon,[{key:'createIcon',value:function createIcon(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};// Extract `type` from settings with defaults
var _settings$type=settings.type,type=_settings$type===undefined?'info':_settings$type,styleScope=settings.styleScope,color=settings.color;var className=this._generateStaticIconClasses(type,styleScope);var customStyleBackground='';var customStyleBorder='';if(color){customStyleBackground='background-color: '+color+';';customStyleBorder='border-color: '+color+' transparent transparent;'}// Static options
var html='\n        <div class="map-icon-static__wrapper">\n          <i class="map-icon-static__body" style="'+customStyleBackground+'"></i>\n          <i class="map-icon-static__descender" style="'+customStyleBorder+'"></i>\n          <i class="map-icon-static__badge"></i>\n        </div>\n      ';var iconSize=L.point(23,31);var iconAnchor=L.point(7.6,31);var popupAnchor=L.point(1,-31);// Define the `divIcon` options
var options={className:className,html:html,iconSize:iconSize,iconAnchor:iconAnchor,popupAnchor:popupAnchor};return L.divIcon(options)}},{key:'_generateStaticIconClasses',value:function _generateStaticIconClasses(type,styleScope){var classes=['map-icon','map-icon-static','map-icon-static--with-badge'];if(type&&type.length){classes.push('map-icon-static--'+type)}if(styleScope){classes.push(styleScope)}return classes.join(' ')}}]);return StaticIcon}();;/* Bind StaticIcon klass */PxMap.StaticIcon=StaticIcon;/**
   *
   * @class PxMap.SymbolIcon
   */var SymbolIcon=function(){function SymbolIcon(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,SymbolIcon);this.icon=this.createIcon(settings);return this.icon}_createClass(SymbolIcon,[{key:'createIcon',value:function createIcon(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var _settings$type2=settings.type,type=_settings$type2===undefined?'info':_settings$type2,_settings$icon=settings.icon,icon=_settings$icon===undefined?'px-nav:favorite':_settings$icon,styleScope=settings.styleScope,_settings$stroke=settings.stroke,stroke=_settings$stroke===undefined?'currentColor':_settings$stroke,_settings$fill=settings.fill,fill=_settings$fill===undefined?'none':_settings$fill,_settings$strokeWidth=settings.strokeWidth,strokeWidth=_settings$strokeWidth===undefined?'2px':_settings$strokeWidth,color=settings.color;var className=this._generateSymbolIconClasses(type,styleScope);var customStyleBackground='';var customStyleBorder='';if(color){customStyleBackground='background-color: '+color+';';customStyleBorder='border-color: '+color+' transparent transparent;'}// Icon/Symbol options
var html='\n      <div class="map-icon-symbol__wrapper">\n        <i class="map-icon-symbol__body" style="'+customStyleBackground+'">\n          <div class="map-icon-symbol__symbol--container flex flex--middle flex--center">\n            <px-icon icon="'+icon+'" style="stroke:'+stroke+'; fill:'+fill+'; width:100%; height:100%; stroke-width:'+strokeWidth+'"></px-icon>\n          </div>\n        </i>\n        <i class="map-icon-symbol__descender" style="'+customStyleBorder+'"></i>\n        <i class="map-icon-symbol__badge"></i>\n      </div>\n      ';var iconSize=L.point(40,56);var iconAnchor=L.point(19.6,57);var popupAnchor=L.point(1,-58);// Define the `divIcon` options
var options={className:className,html:html,iconSize:iconSize,iconAnchor:iconAnchor,popupAnchor:popupAnchor};return L.divIcon(options)}},{key:'_generateSymbolIconClasses',value:function _generateSymbolIconClasses(type,styleScope){var classes=['map-icon','map-icon-symbol','map-icon-symbol--with-badge'];if(type&&type.length){classes.push('map-icon-symbol--'+type)}if(styleScope){classes.push(styleScope)}return classes.join(' ')}}]);return SymbolIcon}();;/* Bind SymbolIcon klass */PxMap.SymbolIcon=SymbolIcon;/**
   *
   * @class PxMap.ClusterIcon
   */var ClusterIcon=function(){function ClusterIcon(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,ClusterIcon);this.icon=this.createIcon(settings);return this.icon}_createClass(ClusterIcon,[{key:'createIcon',value:function createIcon(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};// Extract `count`, `countByType`, `colorsByType`
var count=settings.count,countByType=settings.countByType,colorsByType=settings.colorsByType,_settings$containerSi=settings.containerSize,containerSize=_settings$containerSi===undefined?50:_settings$containerSi,_settings$pathSize=settings.pathSize,pathSize=_settings$pathSize===undefined?10:_settings$pathSize,_settings$borderSize=settings.borderSize,borderSize=_settings$borderSize===undefined?0:_settings$borderSize,_settings$className=settings.className,className=_settings$className===undefined?'':_settings$className,styleScope=settings.styleScope;// The chart size is the container size with the border size subtracted out,
// so we can draw and transform our SVG in the right dimensions
var chartSize=containerSize-(borderSize>0?borderSize*2-0.5:0);// The icon size is a point representing the size of the icon's outer container
var iconSize=L.point(containerSize,containerSize);// Get the SVG for this icon
var svg=this._generateClusterIconSVG(countByType,colorsByType,chartSize,pathSize);// Generate the classes and wrapper HTML
var classes='map-icon-cluster '+(className||'')+' '+(styleScope||'');var html='\n        <div class="map-icon-cluster__container" style="width: '+containerSize+'px; height: '+containerSize+'px">\n          <i class="map-icon-cluster__svg">'+svg+'</i>\n          <div class="map-icon-cluster__body">'+count+'</div>\n        </div>\n      ';// Define the `divIcon` options
var options={iconSize:iconSize,className:classes,html:html};return L.divIcon(options)}},{key:'_generateClusterIconSVG',value:function _generateClusterIconSVG(countByType,colorsByType,chartSize,pathSize){// Combine the `countByType` and `colorsByType` into one array of objects,
// each describing a type with its associated count and color
var typeKeys=Object.keys(countByType);var typeObjs=typeKeys.map(function(type){return{type:type,count:countByType[type],color:colorsByType[type]}});// Sort the types from highest->lowest
typeObjs.sort(function(a,b){return a.count-b.count});// Create two parallel arrays of [types] and [colors]
var types=[];var colors=[];var i=void 0,len=void 0,type=void 0,total=void 0;for(i=0,len=typeKeys.length;i<len;i++){type=typeKeys[i];total=countByType[type];types.push(countByType[type]);colors.push(colorsByType[type])}// Return the pie chart
return this.createPieChart(types,colors,chartSize,pathSize)}},{key:'createPieChart',value:function createPieChart(groupsArray,colorsArray,chartSize,pathSize){// Create a pie generator and pass it the `groupsArray` to create a set
// of arcs we can draw as a donut pie cart
var pieGeneratorFn=Px.d3.pie();var arcData=pieGeneratorFn(groupsArray);// Calculate the `radius` and `innerRadius` of the chart
var radius=chartSize/2;var innerRadius=radius-pathSize;// Create a path generator. Individual entries of `arcData` can be passed
// in to the path geneator to yield a stringified path that can be
// appended to a `<path>` tag's `d` attribute.
var arcPathGeneratorFn=Px.d3.arc().outerRadius(radius).innerRadius(innerRadius);// Iterate over a list of `arcData` entries and return a block of paths
var pathListTmpl=function pathListTmpl(paths){return paths.map(pathTmpl).join('')};// For each path, generate a `<path>` tag with the correct attributes
var pathTmpl=function pathTmpl(pathData,pathIndex){return'<path d="'+arcPathGeneratorFn(pathData)+'" fill="'+colorsArray[pathIndex]+'" opacity="1"></path>'};return'\n        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none" viewBox="0 0 '+chartSize+' '+chartSize+'">\n            <g transform="translate('+radius+', '+radius+')">\n                '+pathListTmpl(arcData)+'\n            </g>\n        </svg>\n      '}}]);return ClusterIcon}();;/* Bind ClusterIcon klass */PxMap.ClusterIcon=ClusterIcon})();
//# sourceMappingURL=px-map-behavior-icon.js.map
