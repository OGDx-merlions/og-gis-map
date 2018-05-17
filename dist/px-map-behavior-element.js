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
   * @polymerBehavior PxMapBehavior.Element
   */PxMapBehavior.ElementImpl={beforeRegister:function beforeRegister(){/**
       * A reference to this element's instance. The instance can be configured and
       * attached to the map or to another instance. Events emitted by this instance
       * will be intercepted and retargeted so they appear to come from directly from
       * this custom element.
       *
       * @property elementInst
       * @type {Object|null}
       */this.elementInst=null},attached:function attached(){this.__elAttached=true},detached:function detached(){this.__elAttached=false},/**
     * If this element's instance is ready to create and add to its parent,
     * fires an event the parent will catch.
     *
     * @param {Boolean} isReady - If `true` instance parent will be notified
     * @return {Boolean} - If `true` the parent was notified
     */notifyInstReady:function notifyInstReady(){var isReady=arguments.length>0&&arguments[0]!==undefined?arguments[0]:true;if(!isReady)return false;this.fire('px-map-element-ready-to-add');return true},shouldAddInst:function shouldAddInst(){// Create the instance, if it doesn't already exist
if(!this.elementInst){var options=this.__initialOptions=this.getInstOptions();this.elementInst=this.createInst(options);this.fire('px-map-element-instance-created')}this.__instEvents=this.__instEvents||[];this.__instEventsElementsMap=this.__instEventsElementsMap||new WeakMap},shouldRemoveInst:function shouldRemoveInst(){this.unbindAllEvents(this.__instEvents,this.__instEventsElementsMap);this.__instEvents=null;this.__instEventsElementsMap=null},// Simple observer trigger for dynamic properties that should be synced
// to the instance
shouldUpdateInst:function shouldUpdateInst(){if(!this.elementInst&&this.__elAttached&&this.canAddInst()){this.notifyInstReady(this.canAddInst())}if(!this.elementInst)return;var lastOptions=this.__lastOptions||this.__initialOptions;var nextOptions=this.getInstOptions();this.updateInst(lastOptions,nextOptions);// Set `lastOptions` to `nextOptions` so the next time this method is called
// it will have access to the last options
this.__lastOptions=nextOptions},// Should be implemented by behaviors/components that extend...
createInst:function createInst(){throw new Error('The `createInst` method must be implemented.')},updateInst:function updateInst(){throw new Error('The `updateInst` method must be implemented.')},getInstOptions:function getInstOptions(){throw new Error('The `getInstOptions` method must be implemented.')},addInst:function addInst(){throw new Error('The `bindInst` method must be implemented.')},removeInst:function removeInst(){throw new Error('The `unbindInst` method must be implemented.')},// Helper methods
extendObj:function extendObj(obj){if(!obj||!(obj instanceof Object))throw new Error('The first parameter of `extendObj` must be an object to be mutated.');for(var _len=arguments.length,properties=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){properties[_key-1]=arguments[_key]}if(properties.length){Object.assign.apply(Object,[obj].concat(properties))}return obj},addProperties:function addProperties(){this.properties=this.properties||{};for(var _len2=arguments.length,properties=Array(_len2),_key2=0;_key2<_len2;_key2++){properties[_key2]=arguments[_key2]}if(properties.length){this.extend.apply(this,[this.properties].concat(properties))}return this.properties},bindEvents:function bindEvents(evts,target){if((typeof evts==='undefined'?'undefined':_typeof(evts))!=='object'||!Object.keys(evts).length)return;var el=target||this.elementInst;if(!el||!el.on)return;var boundEvts=this.__instEvents;var boundEvtEls=this.__instEventsElementsMap;var evtNames=Object.keys(evts);evtNames.forEach(function(evtName){var evtReference={name:evtName,fn:evts[evtName]};el.on(evtReference.name,evtReference.fn);boundEvts.push(evtReference);boundEvtEls.set(evtReference,el)})},unbindAllEvents:function unbindAllEvents(boundEvts,boundEvtEls){if(!boundEvts||!boundEvts.length||!boundEvtEls)return;boundEvts.forEach(function(evt){var el=boundEvtEls.get(evt);if(!el||!el.off)return;var name=evt.name,fn=evt.fn;el.off(name,fn);boundEvtEls.delete(evt)})},/**
     * If this component is being drawn in Shady DOM, returns true. Used to
     * ensure the shady DOM scope classes are applied when we make DOM
     * transactions that can't be reviewed by the scopeSubtree observer
     * in the root `px-map` component that is the parent of all elements.
     *
     * @return {Boolean}
     */isShadyScoped:function isShadyScoped(){return!Polymer.Settings.useNativeShadow},/**
     * Returns the stringified shady DOM scope classes. Useful for ensuring they're
     * applied during DOM transactions that can't be reviewed by the scopeSubtree
     * observer in the root `px-map` component that is the parent of all elements.
     *
     * @return {String} A list of CSS classes separated by spaces
     */getShadyScope:function getShadyScope(){return'style-scope px-map'}};/* Bind Element behavior */PxMapBehavior.Element=[PxMapBehavior.ElementImpl]})();
//# sourceMappingURL=px-map-behavior-element.js.map
