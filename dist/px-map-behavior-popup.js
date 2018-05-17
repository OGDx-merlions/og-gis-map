'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _typeof=typeof Symbol==='function'&&typeof Symbol.iterator==='symbol'?function(obj){return typeof obj}:function(obj){return obj&&typeof Symbol==='function'&&obj.constructor===Symbol&&obj!==Symbol.prototype?'symbol':typeof obj};function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}/**
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
   * @polymerBehavior PxMapBehavior.Popup
   */PxMapBehavior.PopupImpl={properties:{/**
       * If set to `true`, the popup will be automatically closed when the user
       * interacts with any control buttons (e.g. zoom buttons or locate button).
       * By default, the popup only closes when the user clicks the map.
       */closeOnControlInteract:{type:Boolean,value:false}},addInst:function addInst(parent){if(parent&&parent.getPopup&&parent.getPopup()!==this.elementInst){parent.bindPopup(this.elementInst);// Bind custom events for this cluster. Events will be unbound automatically.
var controlClickFn=this._handleControlClick.bind(this,parent);this.bindEvents({'controlclick':controlClickFn},parent._mapToAdd)}},removeInst:function removeInst(parent){if(parent&&parent.getPopup&&parent.getPopup()===this.elementInst){parent.unbindPopup(this.elementInst)}},_handleControlClick:function _handleControlClick(parent){if(this.closeOnControlInteract&&parent&&parent.closePopup){parent.closePopup()}}};/* Bind Popup behavior *//** @polymerBehavior */PxMapBehavior.Popup=[PxMapBehavior.Layer,PxMapBehavior.PopupImpl];/**
   *
   * @polymerBehavior PxMapBehavior.InfoPopup
   */PxMapBehavior.InfoPopupImpl={properties:{/**
       * Title text to display in bold at the top of the popup. Should be kept
       * relatively short (25 characters or less) to keep the popup from
       * growing too large.
       *
       * @type {String}
       */title:{type:String,observer:'shouldUpdateInst'},/**
       * Description text to place in the body of the popup. Try to keep the
       * description to a reasonable size to keep the popup from growing
       * too large.
       *
       * To display more information, bind to the popup's parent layer (e.g. a marker)
       * tapped event and display more information in the UI of your application.
       *
       * @type {String}
       */description:{type:String,observer:'shouldUpdateInst'},/**
       * The URL for an image to be placed inside the popup. Use a small, square
       * thumbnail-style image (e.g. 75px by 75px). You may use any image type
       * that you would put in an html
       * <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img"
       * target="_blank">`<img>`</a> tag.
       *
       * @type {String}
       */imgSrc:{type:String,observer:'shouldUpdateInst'}},createInst:function createInst(options){return new PxMap.InfoPopup(options)},updateInst:function updateInst(lastOptions,nextOptions){var updates={};if(lastOptions.title!==nextOptions.title){updates.title=nextOptions.title}if(lastOptions.description!==nextOptions.description){updates.description=nextOptions.description}if(lastOptions.imgSrc!==nextOptions.imgSrc){updates.imgSrc=nextOptions.imgSrc}if(Object.keys(updates).length){this.elementInst.updateSettings(updates)}},getInstOptions:function getInstOptions(){return{title:this.title,description:this.description,imgSrc:this.imgSrc,styleScope:this.isShadyScoped()?this.getShadyScope():undefined}}};/* Bind InfoPopup behavior *//** @polymerBehavior */PxMapBehavior.InfoPopup=[PxMapBehavior.Popup,PxMapBehavior.InfoPopupImpl];/**
   *
   * @polymerBehavior PxMapBehavior.DataPopup
   */PxMapBehavior.DataPopupImpl={properties:{/**
       * Title text to display in bold at the top of the popup. Should be kept
       * relatively short (25 characters or less) to keep the popup from
       * growing too large.
       */title:{type:String,observer:'shouldUpdateInst'},/**
       * A list of key/value pairs to display in a data table. Must be in the
       * format of an object with human-readable keys and associated values.
       *
       * For example, to show the name and location of a place, set this
       * attribute to:
       * '{ "Name" : "Tokyo", "Location" : "Japan" }'
       *
       * @type {Object}
       */data:{type:Object,value:function value(){return{}},observer:'shouldUpdateInst'}},canAddInst:function canAddInst(){return this.data&&_typeof(this.data)==='object'&&Object.keys(this.data).length},createInst:function createInst(options){return new PxMap.DataPopup(options)},updateInst:function updateInst(lastOptions,nextOptions){var updates={};if(lastOptions.title!==nextOptions.title){updates.title=nextOptions.title}if(lastOptions.dataHash!==nextOptions.dataHash){updates.data=nextOptions.data}if(Object.keys(updates).length){this.elementInst.updateSettings(updates)}},getInstOptions:function getInstOptions(){var data=this._getValidData();return{title:this.title,data:data,dataHash:JSON.stringify(data),styleScope:this.isShadyScoped()?this.getShadyScope():undefined}},_getValidData:function _getValidData(){if(_typeof(this.data)!=='object'){console.log('PX-MAP CONFIGURATION ERROR:\n          You entered an invalid `data` attribute for '+this.is+'. You must pass a valid object.\n          An attribute of type `'+_typeof(this.data)+'` was passed.');return{}}return this.data}};/* Bind DataPopup behavior *//** @polymerBehavior */PxMapBehavior.DataPopup=[PxMapBehavior.Popup,PxMapBehavior.DataPopupImpl];/****************************************************************************
   * KLASSES
   ****************************************************************************//* Ensures the klass namespace is created */window.PxMap=window.PxMap||{};/**
   *
   * @class PxMap.InfoPopup
   */var InfoPopup=function(_L$Popup){_inherits(InfoPopup,_L$Popup);function InfoPopup(){var _ret;var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,InfoPopup);var _this=_possibleConstructorReturn(this,(InfoPopup.__proto__||Object.getPrototypeOf(InfoPopup)).call(this));_this._createPopup(settings);return _ret=_this,_possibleConstructorReturn(_this,_ret)}_createClass(InfoPopup,[{key:'onAdd',value:function onAdd(map){if(map.__addShadyScope&&!Polymer.Element){// We need to monkey patch the node returned by `getPane().appendChild`
// so we can ensure that we apply the right CSS scope if we are in
// shady DOM. By doing this, we effectively wrap the node (which is
// fetched in the L.DivOverlay.onAdd method) in a function that scopes
// the child nodes before they are added to the map. If we don't do this,
// Leaflet will measure the popup before its CSS classes are applied and
// pan the map far too much to fit it. This is lame. :(
// @TODO: Remove when shady DOM support is deprecated
var srcPane=this.getPane();var srcFn=srcPane.appendChild;srcPane.appendChild=function(el){map.__addShadyScope(el,false);var d=Polymer.dom(srcPane);d.appendChild(el)}}L.Popup.prototype.onAdd.call(this,map);if(map.__addShadyScope&&!Polymer.Element){// Restore monkey patched function
srcPane.appendChild=srcFn}}},{key:'_updateContent',value:function _updateContent(){if(this._map&&this._map.__addShadyScope&&this._content.length){// We need to monkey patch the srcNode's `innerHTML` setter to ensure
// that our popup is scoped before it is drawn if we are in shady DOM.
// If we don't do this, Leaflet will measure the popup before its CSS
// classes are applied and pan the map far too much to fit it.
// This is also lame. :(
// @TODO: Remove when shady DOM support is deprecated
var srcNode=this._contentNode;var fakeNode={innerHTML:null};this._contentNode=fakeNode}L.DivOverlay.prototype._updateContent.call(this);if(this._map&&this._map.__addShadyScope&&this._content.length){if(typeof fakeNode.innerHTML==='string'){Polymer.dom(srcNode).innerHTML=fakeNode.innerHTML}// Restore monkey patched function
this._contentNode=srcNode}}// Note `createPopup` is an internet explorer native method, but deprecated
// so hopefully it won't cause grief
},{key:'_createPopup',value:function _createPopup(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};// Assign settings and create content
this.settings=settings;var title=settings.title,description=settings.description,imgSrc=settings.imgSrc,styleScope=settings.styleScope;var content=this._generatePopupContent(title,description,imgSrc);var className='map-popup-info '+(styleScope||'');var maxWidth=400;var minWidth=300;this.initialize({className:className,maxWidth:maxWidth,minWidth:minWidth});this.setContent(content)}},{key:'_generatePopupContent',value:function _generatePopupContent(title,description,imgSrc){var _this2=this;var tmplFnIf=function tmplFnIf(fn){for(var _len=arguments.length,vals=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){vals[_key-1]=arguments[_key]}return vals.length&&vals[0]!==undefined?fn.call.apply(fn,[_this2].concat(vals)):''};var imgTmpl=function imgTmpl(imgSrc){return'\n        <div class="map-box-info__image">\n          <img src="'+imgSrc+'" />\n        </div>\n      '};var titleTmpl=function titleTmpl(title){return'\n        <p class="map-box-info__title">'+title+'</p>\n      '};var descriptionTmpl=function descriptionTmpl(description){return'\n        <p class="map-box-info__description">'+description+'</p>\n      '};return'\n        <section class="map-box-info">\n          '+tmplFnIf(imgTmpl,imgSrc)+'\n          <div class="map-box-info__content">\n            '+tmplFnIf(titleTmpl,title)+'\n            '+tmplFnIf(descriptionTmpl,description)+'\n          </div>\n        </section>\n      '}},{key:'updateSettings',value:function updateSettings(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};Object.assign(this.settings,settings);var _settings=this.settings,title=_settings.title,description=_settings.description,imgSrc=_settings.imgSrc,styleScope=_settings.styleScope;var content=this._generatePopupContent(title,description,imgSrc);this.setContent(content);this.update()}}]);return InfoPopup}(L.Popup);;/* Bind InfoPopup klass */PxMap.InfoPopup=InfoPopup;/**
   *
   * @class PxMap.DataPopup
   */var DataPopup=function(_L$Popup2){_inherits(DataPopup,_L$Popup2);function DataPopup(){var _ret2;var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};_classCallCheck(this,DataPopup);var _this3=_possibleConstructorReturn(this,(DataPopup.__proto__||Object.getPrototypeOf(DataPopup)).call(this));_this3._createPopup(settings);return _ret2=_this3,_possibleConstructorReturn(_this3,_ret2)}_createClass(DataPopup,[{key:'onAdd',value:function onAdd(map){// Don't open empty data popups
if(_typeof(this.settings.data)!=='object'||Object.keys(this.settings.data).length===0){return}if(map.__addShadyScope&&!Polymer.Element){// We need to monkey patch the node returned by `getPane().appendChild`
// so we can ensure that we apply the right CSS scope if we are in
// shady DOM. By doing this, we effectively wrap the node (which is
// fetched in the L.DivOverlay.onAdd method) in a function that scopes
// the child nodes before they are added to the map. If we don't do this,
// Leaflet will measure the popup before its CSS classes are applied and
// pan the map far too much to fit it. This is lame. :(
// @TODO: Remove when shady DOM support is deprecated
var srcPane=this.getPane();var srcFn=srcPane.appendChild;srcPane.appendChild=function(el){map.__addShadyScope(el,false);Polymer.dom(srcPane).appendChild(el)}}L.Popup.prototype.onAdd.call(this,map);if(map.__addShadyScope&&!Polymer.Element){// Restore monkey patched function
srcPane.appendChild=srcFn}}},{key:'_updateContent',value:function _updateContent(){if(this._map&&this._map.__addShadyScope&&this._content.length){// We need to monkey patch the srcNode's `innerHTML` setter to ensure
// that our popup is scoped before it is drawn if we are in shady DOM.
// If we don't do this, Leaflet will measure the popup before its CSS
// classes are applied and pan the map far too much to fit it.
// This is also lame. :(
// @TODO: Remove when shady DOM support is deprecated
var srcNode=this._contentNode;var fakeNode={innerHTML:null};this._contentNode=fakeNode}L.DivOverlay.prototype._updateContent.call(this);if(this._map&&this._map.__addShadyScope&&this._content.length){if(typeof fakeNode.innerHTML==='string'){Polymer.dom(srcNode).innerHTML=fakeNode.innerHTML}// Restore monkey patched function
this._contentNode=srcNode}}// Note `createPopup` is an internet explorer native method, but deprecated
// so hopefully it won't cause grief
},{key:'_createPopup',value:function _createPopup(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};var config=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{};this.settings=settings;var title=settings.title,data=settings.data,styleScope=settings.styleScope;var content=this._generatePopupContent(title,data);var className='map-popup-data '+(styleScope||'');var maxWidth=400;var minWidth=300;this.initialize({className:className,maxWidth:maxWidth,minWidth:minWidth});this.setContent(content)}},{key:'_generatePopupContent',value:function _generatePopupContent(title,data){var _this4=this;var tmplFnIf=function tmplFnIf(fn){for(var _len2=arguments.length,vals=Array(_len2>1?_len2-1:0),_key2=1;_key2<_len2;_key2++){vals[_key2-1]=arguments[_key2]}return vals.length&&vals[0]!==undefined?fn.call.apply(fn,[_this4].concat(vals)):''};var titleTmpl=function titleTmpl(title){return'\n        <div class="map-data-box__header">\n          <h3 class="map-data-box__header__text">'+title+'</h3>\n        </div>\n      '};var dataTmpl=function dataTmpl(data){var dataList=Object.keys(data).reduce(function(accum,key){return accum.concat([dataItemTmpl(key,data[key])])},[]).join('');return'\n          <div class="map-data-box__table">\n            '+dataList+'\n          </div>\n        '};var dataItemTmpl=function dataItemTmpl(label,value){return'\n        <div class="map-data-box__table__cell"><p>'+label+'</p></div>\n        <div class="map-data-box__table__cell"><p>'+value+'</p></div>\n      '};return'\n        <section class="map-box-data">\n          '+tmplFnIf(titleTmpl,title)+'\n          '+tmplFnIf(dataTmpl,data)+'\n        </section>\n      '}},{key:'updateSettings',value:function updateSettings(){var settings=arguments.length>0&&arguments[0]!==undefined?arguments[0]:{};Object.assign(this.settings,settings);var _settings2=this.settings,title=_settings2.title,data=_settings2.data;var content=this._generatePopupContent(title,data);if(this.isOpen()&&Object.keys(data).length===0){this._close()}this.setContent(content);this.update()}}]);return DataPopup}(L.Popup);;/* Bind DataPopup klass */PxMap.DataPopup=DataPopup})();
//# sourceMappingURL=px-map-behavior-popup.js.map
