/**
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
 */

(function() {
  'use strict';

  /****************************************************************************
   * KLASSES
   ****************************************************************************/

  /* Ensures the klass namespace is created */
  window.PxMap = (window.PxMap || {});

  /**
   *
   * @class PxMap.StaticIcon
   */
  class StaticIcon {
    constructor(settings={}) {
      this.icon = this.createIcon(settings);
      return this.icon;
    }

    createIcon(settings={}) {
      // Extract `type` from settings with defaults
      let { type='info', styleScope, color } = settings;

      const className = this._generateStaticIconClasses(type, styleScope);

      let customStyleBackground = '';
      let customStyleBorder = '';

      if (color) {
        customStyleBackground = `background-color: ${color};`;
        customStyleBorder = `border-color: ${color} transparent transparent;`;
      }

      // Static options
      let html;
      if(settings.featureProperties.title) {
        window.__px_map_markergroup_tap = function(elt) {
          elt.click();
        };
        html  = `
          <div class="map-icon-static__wrapper" 
            onmouseover="window.__px_map_markergroup_tap(this)">
            <i class="map-icon-static__body" style="${customStyleBackground}"></i>
            <i class="map-icon-static__descender" style="${customStyleBorder}"></i>
            <i class="map-icon-static__badge"></i>
            <div style="padding-top: 1.5rem; margin-left: -1rem;">${settings.featureProperties.title}</div>
          </div>
        `;
      } else {
        html  = `
          <div class="map-icon-static__wrapper"
            onmouseover="window.__px_map_markergroup_tap(this)">
            <i class="map-icon-static__body" style="${customStyleBackground}"></i>
            <i class="map-icon-static__descender" style="${customStyleBorder}"></i>
            <i class="map-icon-static__badge"></i>
          </div>
        `;
      }
      const iconSize = L.point(23,31);
      const iconAnchor = L.point(7.6, 31);
      const popupAnchor = L.point(1,-31);

      // Define the `divIcon` options
      const options = {
        className,
        html,
        iconSize,
        iconAnchor,
        popupAnchor
      };

      return L.divIcon(options);
    }

    _generateStaticIconClasses(type, styleScope) {
      const classes = ['map-icon', 'map-icon-static', 'map-icon-static--with-badge'];
      if (type && type.length) {
        classes.push(`map-icon-static--${type}`);
      }
      if (styleScope) {
        classes.push(styleScope);
      }
      return classes.join(' ');
    }
  };
  /* Bind StaticIcon klass */
  PxMap.StaticIcon = StaticIcon;

  /**
   *
   * @class PxMap.SymbolIcon
   */
  class SymbolIcon {
    constructor(settings={}) {
      this.icon = this.createIcon(settings);
      return this.icon;
    }

    createIcon(settings={}) {
      let { type='info', icon='px-nav:favorite', styleScope, stroke='currentColor', fill='none', strokeWidth='2px', color } = settings;
      const className = this._generateSymbolIconClasses(type, styleScope);

      let customStyleBackground = '';
      let customStyleBorder = '';

      if (color) {
        customStyleBackground = `background-color: ${color};`;
        customStyleBorder = `border-color: ${color} transparent transparent;`;
      }

      // Icon/Symbol options
      let html;
      if(settings.featureProperties.title) {
        html  = `
          <div class="map-icon-symbol__wrapper"
            onmouseover="window.__px_map_markergroup_tap(this)">
            <i class="map-icon-symbol__body" style="${customStyleBackground}">
              <div class="map-icon-symbol__symbol--container flex flex--middle flex--center">
                <px-icon icon="${icon}" style="stroke:${stroke}; fill:${fill}; width:100%; height:100%; stroke-width:${strokeWidth}"></px-icon>
              </div>
            </i>
            <i class="map-icon-symbol__descender" style="${customStyleBorder}"></i>
            <i class="map-icon-symbol__badge"></i>
            <div style="padding-top: 3rem; margin-left: 0rem;">${settings.featureProperties.title}</div>
          </div>
        `;
      } else {
        html  = `
        <div class="map-icon-symbol__wrapper"
          onmouseover="window.__px_map_markergroup_tap(this)">
          <i class="map-icon-symbol__body" style="${customStyleBackground}">
            <div class="map-icon-symbol__symbol--container flex flex--middle flex--center">
              <px-icon icon="${icon}" style="stroke:${stroke}; fill:${fill}; width:100%; height:100%; stroke-width:${strokeWidth}"></px-icon>
            </div>
          </i>
          <i class="map-icon-symbol__descender" style="${customStyleBorder}"></i>
          <i class="map-icon-symbol__badge"></i>
        </div>
        `;
      }

      const iconSize = L.point(40,56);
      const iconAnchor = L.point(19.6, 57);
      const popupAnchor = L.point(1,-58);

      // Define the `divIcon` options
      const options = {
        className,
        html,
        iconSize,
        iconAnchor,
        popupAnchor
      };

      return L.divIcon(options);
    }

    _generateSymbolIconClasses(type, styleScope) {
      const classes = ['map-icon', 'map-icon-symbol', 'map-icon-symbol--with-badge'];
      if (type && type.length) {
        classes.push(`map-icon-symbol--${type}`);
      }
      if (styleScope) {
        classes.push(styleScope);
      }
      return classes.join(' ');
    }
  };
  /* Bind SymbolIcon klass */
  PxMap.SymbolIcon = SymbolIcon;

  /**
   *
   * @class PxMap.ClusterIcon
   */
  class ClusterIcon {
    constructor(settings={}) {
      this.icon = this.createIcon(settings);
      return this.icon;
    }

    createIcon(settings={}) {
      // Extract `count`, `countByType`, `colorsByType`
      const { count, countByType, colorsByType, containerSize=50, 
        pathSize=10, borderSize=0, className='', styleScope, markers } = settings;

      // The chart size is the container size with the border size subtracted out,
      // so we can draw and transform our SVG in the right dimensions
      const chartSize = (containerSize - (borderSize > 0 ? (borderSize*2)-0.5 : 0));

      // The icon size is a point representing the size of the icon's outer container
      const iconSize = L.point(containerSize, containerSize);

      // Get the SVG for this icon
      // const svg = this._generateClusterIconSVG(countByType, colorsByType, chartSize, pathSize, markers);

      const markerTypeArray = this._getOilGasRefCount(markers);
      const [oil, gas, ref] = markerTypeArray;
      const stroke = "currentColor", strokeWidth = "2px";

      let clIcons = markerTypeArray.map((_type, idx) => {
        return `
        <div class="type">
          <px-icon icon="${_type.icon}" style="stroke:${stroke}; 
            fill:${colorsByType[_type.type]}; left: 20%;
            width:60%; height:60%; stroke-width:${strokeWidth}"></px-icon>
        </div>
        `;
      }).join('');

      // Generate the classes and wrapper HTML
      const classes = `map-icon-cluster ${className||''} ${styleScope||''}`;
      // <i class="map-icon-cluster__svg"></i>
      // <div class="map-icon-cluster__body">${count}</div>
      window.__px_map_cluster_showCount = function(elt) {
        elt.childNodes[1].style.display = "";
        elt.childNodes[3].style.display = "none";
      }
      window.__px_map_cluster_hideCount = function(elt) {
        elt.childNodes[1].style.display = "none";
        elt.childNodes[3].style.display = "";
      }
      const id = new Date().getTime();
      const regionLabel = oil.label || gas.label || ref.label || '';
      const html = `
        <px-tooltip
          style="margin: 2rem;"
          for="cluster-${id}"
          tooltip-message="${oil.production+gas.production+ref.production} BOI/day"
          orientation="auto">
        </px-tooltip>   
        <div class="map-icon-cluster__container tooltip" id="cluster-${id}"
          onmouseover="window.__px_map_cluster_showCount(this)"
          onmouseout="window.__px_map_cluster_hideCount(this)"
          style="width: ${containerSize}px; height: ${containerSize}px">
          <div class="map-icon-cluster__groups" style="display:none">
            ${this._generateClusterIconSVGWithCount(
              colorsByType, chartSize, count, 
              regionLabel, oil, gas, ref)}
          </div>
          <div class="map-icon-cluster__groups">
            ${this._generateClusterIconSVG(
              colorsByType, chartSize, count, 
              regionLabel, oil, gas, ref)}
          </div>
        </div>
      `;

      // Define the `divIcon` options
      const options = {
        iconSize: iconSize,
        className: classes,
        html: html
      };

      return L.divIcon(options);
    }

    _getOilGasRefCount(markers) {
      let oil = {"count": 0, "type": "unknown", "production": 0,
                 "icon": "px-obj:line-og", "label": ""}, 
          gas = {"count": 0, "type": "unknown", "production": 0,
                 "icon": "px-obj:boiler", "label": ""}, 
          ref = {"count": 0, "type": "unknown", "production": 0,
                 "icon": "px-obj:hrsg", "label": ""};
      let cluster;
      const updateTypeIfHigher = (obj, marker) => {
        if(marker["marker-icon"] && marker["marker-icon"]["icon-type"]) {
          const iconType = marker["marker-icon"]["icon-type"];
          if("warning" == iconType && obj.type !== "important") {
            obj.type = "warning";
          } else if("important" == iconType) {
            obj.type = "important";
          } else if("info" == iconType 
              && obj.type == "unknown") {
            obj.type = "info";   
          }
        }
      }
      markers.forEach((_m) => {
        cluster = _m.featureProperties.cluster;
        if(cluster) {
          if('oil' === cluster.type) {
            ++oil.count;
            oil.production += cluster.production;
            oil.label = cluster.label;
            updateTypeIfHigher(oil, _m.featureProperties);
          } else if('gas' === cluster.type) {
            ++gas.count;
            gas.production += cluster.production;
            gas.label = cluster.label;
            updateTypeIfHigher(gas, _m.featureProperties);
          } else if('ref' === cluster.type) {
            ++ref.count;
            ref.production += cluster.production;
            ref.label = cluster.label;
            updateTypeIfHigher(ref, _m.featureProperties);
          }
        }
      });
      return [oil, gas, ref];
    }

    _generateClusterIconSVGWithCount(colorsByType, chartSize, total, label, oil, gas, ref) {
      let oilCount = oil.count;
      let gasCount = gas.count;
      let refCount = ref.count;
      let id = new Date().getTime();
      return `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
          preserveAspectRatio="none" viewBox="0 0 ${chartSize*3} ${chartSize*3}">
          <defs>
            <text id="oil-${id}"
              font-family="GEInspiraSans-Regular, GE Inspira Sans" font-size="20" font-weight="normal">
              <tspan x="${oilCount > 9 ? 11 : 18}" y="28">${oilCount}</tspan>
            </text> 
            <text id="gas-${id}" font-family="GEInspiraSans-Regular, GE Inspira Sans" font-size="20" font-weight="normal">
                <tspan x="${gasCount > 9 ? 11 : 18}" y="28">${gasCount}</tspan>
            </text> 
            <text id="ref-${id}" font-family="GEInspiraSans-Regular, GE Inspira Sans" font-size="20" font-weight="normal">
                <tspan x="${refCount > 9 ? 11 : 18}" y="28">${refCount}</tspan>
            </text>    
          </defs>
          <g id="MOP-${id}" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="1a.-Ministry-dashboard-Copy-3-${id}" transform="translate(-472.000000, -289.000000)">
                  <g id="Group-Copy-3-${id}" transform="translate(471.000000, 291.000000)">
                      <circle id="Oval-3-${id}" stroke="#9B9B9B" fill="${colorsByType[oil.type]}" cx="24.5" cy="66.5" r="22.5"></circle>
                      <circle id="Oval-3-Copy-2-${id}" stroke="#979797" fill="${colorsByType[gas.type]}" cx="116.5" cy="66.5" r="22.5"></circle>
                      <circle id="Oval-3-Copy-${id}" stroke="#979797" fill="${colorsByType[ref.type]}" cx="70.5" cy="66.5" r="22.5"></circle>
                      <g id="Icons/px-obj:plant-${id}" transform="translate(0.000000, 45.000000)">
                          <g id="px-obj:plant-${id}">
                              <rect id="Container-${id}" x="0" y="0" width="46" height="42"></rect>
                              <mask id="mask-2-${id}" fill="white">
                                  <use xlink:href="#path-1-${id}"></use>
                              </mask>
                              <use id="Mask-${id}" fill="white" fill-rule="nonzero" xlink:href="#oil-${id}"></use>
                              <g id="/$white-Icon-Color-${id}" mask="url(#mask-2-${id})" fill="transparent">
                                  <rect id="Rectangle-Copy-3-${id}" x="0" y="0" width="46" height="42"></rect>
                              </g>
                          </g>
                      </g>
                      <g id="Icons/px-obj:fleet-${id}" transform="translate(93.000000, 46.000000)">
                          <g id="px-obj:fleet-${id}">
                              <rect id="Container-${id}" x="0" y="0" width="46" height="42"></rect>
                              <mask id="mask-4-${id}" fill="white">
                                  <use xlink:href="#path-3-${id}"></use>
                              </mask>
                              <use id="Mask-${id}" fill="white" fill-rule="nonzero" xlink:href="#gas-${id}"></use>
                              <g id="/$white-Icon-Color-${id}" mask="url(#mask-4-${id})" fill="transparent">
                                  <rect id="Rectangle-Copy-3-${id}" x="0" y="0" width="46" height="42"></rect>
                              </g>
                          </g>
                      </g>
                      <g id="Icons/px-obj:line-${id}" transform="translate(47.000000, 46.000000)">
                          <g id="px-obj:line-${id}">
                              <rect id="Container-${id}" x="0" y="0" width="46" height="42"></rect>
                              <mask id="mask-6-${id}" fill="white">
                                  <use xlink:href="#path-5-${id}"></use>
                              </mask>
                              <use id="Mask-${id}" fill="white" fill-rule="nonzero" xlink:href="#ref-${id}"></use>
                              <g id="/$white-Icon-Color-${id}" mask="url(#mask-6-${id})" fill="transparent">
                                  <rect id="Rectangle-Copy-3-${id}" x="0" y="0" width="46" height="42"></rect>
                              </g>
                          </g>
                      </g>
                      <text id="Western-Desert-${id}" text-anchor="middle"
                        font-family="GEInspiraSans-Regular, GE Inspira Sans" font-size="20" font-weight="normal" fill="#4A4A4A">
                        <tspan x="70" y="110">${label}</tspan>
                      </text>
                      <text id="18-${id}" font-family="GEInspiraSans-Regular, GE Inspira Sans" font-size="36" font-weight="normal" fill="#59717F">
                          <tspan x="${total > 9 ? 48.848 : 60.848}" y="37">${total}</tspan>
                      </text>
                      <path d="M113,44 C113,19.699471 93.5243866,0 69.5,0 C45.4756134,0 26,19.699471 26,44" id="Oval-2-${id}" stroke="#9B9B9B" stroke-width="3"></path>
                  </g>
              </g>
            </g>
        </svg>
      `
    }

    _generateClusterIconSVG(colorsByType, chartSize, total, label, oil, gas, ref) {
      let id = new Date().getTime();
      return `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1"
          preserveAspectRatio="none" viewBox="0 0 ${chartSize*3} ${chartSize*3}">
          <defs>
              <path d="M37.71875,13.78125 C37.53125,13.6875 37.34375,13.6875 37.25,13.78125 L31.4375,18.75 L31.4375,13.6875 C31.4375,13.5 31.34375,13.3125 31.15625,13.21875 C30.96875,13.125 30.78125,13.125 30.6875,13.3125 L24.875,18.28125 L24.875,13.6875 C24.875,13.5 24.78125,13.3125 24.59375,13.21875 C24.40625,13.125 24.21875,13.125 24.125,13.3125 L17.9375,18.75 L18.59375,19.5 L24.03125,14.8125 L24.03125,19.3125 C24.03125,19.5 24.125,19.6875 24.3125,19.78125 C24.5,19.875 24.6875,19.875 24.78125,19.6875 L30.5,14.71875 L30.5,19.78125 C30.5,19.96875 30.59375,20.15625 30.78125,20.25 C30.96875,20.34375 31.15625,20.34375 31.25,20.15625 L37.0625,15.1875 L37.0625,31.5 L17.375,31.5 L15.3125,9.9375 L16.4375,9.9375 L16.4375,9 L8.9375,9 L8.9375,9.9375 L10.0625,9.9375 L8,31.875 C8,31.96875 8,32.15625 8.09375,32.25 C8.1875,32.34375 8.375,32.4375 8.46875,32.4375 L16.4375,32.4375 L37.53125,32.4375 C37.8125,32.4375 38,32.25 38,31.96875 L38,14.15625 C38,13.96875 37.90625,13.78125 37.71875,13.78125 Z M8.9375,31.5 L11,9.9375 L14.46875,9.9375 L16.4375,31.5 L8.9375,31.5 Z" id="path-1-${id}"></path>
              <path d="M37.7281796,10.2643392 L30.7456359,6.07481297 C30.5461347,5.97506234 30.3466334,5.97506234 30.2468828,6.07481297 L23.563591,10.0648379 L16.8802993,6.07481297 C16.680798,5.97506234 16.4812968,5.97506234 16.3815461,6.07481297 L9.39900249,10.2643392 C9.09975062,10.3640898 9,10.563591 9,10.6633416 L9,18.9426434 C9,19.1421446 9.09975062,19.2418953 9.19950125,19.3416459 L15.9825436,23.3316708 L15.9825436,31.3117207 C15.9825436,31.5112219 16.0822943,31.6109726 16.1820449,31.7107232 L23.1645885,35.9002494 C23.2643392,35.9002494 23.3640898,36 23.4638404,36 C23.563591,36 23.6633416,36 23.7630923,35.9002494 L30.7456359,31.7107232 C30.9451372,31.6109726 30.9451372,31.4114713 30.9451372,31.3117207 L30.9451372,23.3316708 L37.7281796,19.3416459 C37.9276808,19.2418953 37.9276808,19.042394 37.9276808,18.9426434 L37.9276808,10.6633416 C37.9276808,10.563591 37.8279302,10.3640898 37.7281796,10.2643392 Z M30.446384,7.0723192 L36.7306733,10.7630923 L30.446384,14.4538653 L24.1620948,10.7630923 L30.446384,7.0723192 Z M23.4638404,27.0224439 L17.1795511,23.3316708 L23.4638404,19.6408978 L29.7481297,23.3316708 L23.4638404,27.0224439 Z M29.9476309,22.234414 L23.9625935,18.6433915 L23.9625935,11.8603491 L29.9476309,15.4513716 L29.9476309,22.234414 Z M22.9650873,18.7431421 L16.9800499,22.3341646 L16.9800499,15.4513716 L22.9650873,11.8603491 L22.9650873,18.7431421 Z M16.4812968,7.0723192 L22.765586,10.7630923 L16.4812968,14.4538653 L10.1970075,10.8628429 L16.4812968,7.0723192 Z M9.99750623,11.8603491 L15.9825436,15.4513716 L15.9825436,22.3341646 L9.99750623,18.7431421 L9.99750623,11.8603491 Z M16.9800499,24.3291771 L22.9650873,27.9201995 L22.9650873,34.8029925 L16.9800499,31.2119701 L16.9800499,24.3291771 Z M23.9625935,34.8029925 L23.9625935,27.9201995 L29.9476309,24.3291771 L29.9476309,31.2119701 L23.9625935,34.8029925 Z M30.9451372,22.3341646 L30.9451372,15.4513716 L36.9301746,11.8603491 L36.9301746,18.7431421 L30.9451372,22.3341646 Z" id="path-3-${id}"></path>
              <path d="M37.2569659,20.4071207 L36.7925697,20.4071207 L36.7925697,13.4411765 C36.7925697,13.255418 36.6996904,13.0696594 36.5139319,13.0696594 C36.3281734,12.9767802 36.1424149,12.9767802 36.0495356,13.0696594 C31.9628483,15.9489164 30.3839009,17.1563467 29.7337461,17.7136223 L25.3684211,14.9272446 C25.1826625,14.8343653 24.996904,14.8343653 24.9040248,14.9272446 C24.7182663,15.0201238 24.625387,15.2058824 24.625387,15.2987616 L24.625387,19.4783282 L20.9102167,19.4783282 L20.9102167,14.5557276 C20.9102167,14.369969 20.8173375,14.2770898 20.7244582,14.1842105 C20.6315789,14.0913313 20.4458204,14.0913313 20.2600619,14.1842105 L14.9659443,16.6919505 L9.57894737,14.1842105 C9.39318885,14.0913313 9.3003096,14.0913313 9.11455108,14.1842105 C9.02167183,14.2770898 8.92879257,14.4628483 8.92879257,14.5557276 L8.92879257,20.4071207 L8.46439628,20.4071207 C8.18575851,20.4071207 8,20.5928793 8,20.871517 C8,21.1501548 8.18575851,21.3359133 8.46439628,21.3359133 L8.92879257,21.3359133 L8.92879257,27.1873065 C8.92879257,27.2801858 9.02167183,27.4659443 9.11455108,27.5588235 C9.20743034,27.6517028 9.3003096,27.744582 9.48606811,27.744582 C9.57894737,27.744582 13.6656347,26.0727554 15.0588235,25.1439628 C16.4520124,26.0727554 20.5386997,27.744582 20.6315789,27.744582 C20.7244582,27.744582 20.9102167,27.6517028 21.003096,27.5588235 C21.0959752,27.4659443 21.1888545,27.373065 21.1888545,27.1873065 L21.1888545,22.2647059 L24.9040248,22.2647059 L24.9040248,26.4442724 C24.9040248,26.630031 24.996904,26.7229102 25.1826625,26.8157895 C25.3684211,26.9086687 25.4613003,26.9086687 25.6470588,26.8157895 C28.3405573,25.2368421 29.5479876,24.4009288 30.1052632,24.0294118 L36.3281734,28.6733746 C36.4210526,28.7662539 36.5139319,28.7662539 36.6068111,28.7662539 C36.6996904,28.7662539 36.7925697,28.7662539 36.7925697,28.6733746 C36.9783282,28.5804954 37.0712074,28.3947368 37.0712074,28.3018576 L37.0712074,21.3359133 L37.5356037,21.3359133 C37.8142415,21.3359133 38,21.1501548 38,20.871517 C38,20.5928793 37.5356037,20.4071207 37.2569659,20.4071207 Z M9.85758514,15.2987616 L14.501548,17.4349845 L14.501548,24.2151703 C13.6656347,24.6795666 10.9721362,25.9798762 9.85758514,26.4442724 L9.85758514,15.2987616 Z M20.0743034,26.5371517 C18.9597523,26.0727554 16.2662539,24.7724458 15.4303406,24.3080495 L15.4303406,17.5278638 L20.0743034,15.3916409 L20.0743034,26.5371517 Z M21.003096,21.3359133 L21.003096,20.4071207 L24.7182663,20.4071207 L24.7182663,21.3359133 L21.003096,21.3359133 Z M25.6470588,16.1346749 L29.3622291,18.5495356 L29.3622291,23.1934985 C28.9907121,23.5650155 27.3188854,24.5866873 25.6470588,25.6083591 L25.6470588,16.1346749 Z M35.8637771,27.373065 L30.2910217,23.1934985 L30.2910217,18.4566563 C30.8482972,17.9922601 33.3560372,16.1346749 35.8637771,14.2770898 L35.8637771,27.373065 Z" id="path-5-${id}"></path>
          </defs>
          <g id="MOP-${id}" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="1a.-Ministry-dashboard-Copy-3-${id}" transform="translate(-472.000000, -289.000000)">
                  <g id="Group-Copy-3-${id}" transform="translate(471.000000, 291.000000)">
                      <circle id="Oval-3-${id}" stroke="#9B9B9B" fill="${colorsByType[oil.type]}" cx="24.5" cy="66.5" r="22.5"></circle>
                      <circle id="Oval-3-Copy-2-${id}" stroke="#979797" fill="${colorsByType[gas.type]}" cx="116.5" cy="66.5" r="22.5"></circle>
                      <circle id="Oval-3-Copy-${id}" stroke="#979797" fill="${colorsByType[ref.type]}" cx="70.5" cy="66.5" r="22.5"></circle>
                      <g id="Icons/px-obj:plant-${id}" transform="translate(0.000000, 45.000000)">
                          <g id="px-obj:plant-${id}">
                              <rect id="Container-${id}" x="0" y="0" width="46" height="42"></rect>
                              <mask id="mask-2-${id}" fill="white">
                                  <use xlink:href="#path-1-${id}"></use>
                              </mask>
                              <use id="Mask-${id}" fill="white" fill-rule="nonzero" xlink:href="#path-1-${id}"></use>
                              <g id="/$white-Icon-Color-${id}" mask="url(#mask-2-${id})" fill="transparent">
                                  <rect id="Rectangle-Copy-3-${id}" x="0" y="0" width="46" height="42"></rect>
                              </g>
                          </g>
                      </g>
                      <g id="oil-count-${id}" transform="translate(0.000000, 45.000000)">12</g>
                      <g id="Icons/px-obj:fleet-${id}" transform="translate(93.000000, 46.000000)">
                          <g id="px-obj:fleet-${id}">
                              <rect id="Container-${id}" x="0" y="0" width="46" height="42"></rect>
                              <mask id="mask-4-${id}" fill="white">
                                  <use xlink:href="#path-3-${id}"></use>
                              </mask>
                              <use id="Mask-${id}" fill="white" fill-rule="nonzero" xlink:href="#path-3-${id}"></use>
                              <g id="/$white-Icon-Color-${id}" mask="url(#mask-4-${id})" fill="transparent">
                                  <rect id="Rectangle-Copy-3-${id}" x="0" y="0" width="46" height="42"></rect>
                              </g>
                          </g>
                      </g>
                      <g id="gas-count-${id}" transform="translate(93.000000, 46.000000)">12</g>
                      <g id="Icons/px-obj:line-${id}" transform="translate(47.000000, 46.000000)">
                          <g id="px-obj:line-${id}">
                              <rect id="Container-${id}" x="0" y="0" width="46" height="42"></rect>
                              <mask id="mask-6-${id}" fill="white">
                                  <use xlink:href="#path-5-${id}"></use>
                              </mask>
                              <use id="Mask-${id}" fill="white" fill-rule="nonzero" xlink:href="#path-5-${id}"></use>
                              <g id="/$white-Icon-Color-${id}" mask="url(#mask-6-${id})" fill="transparent">
                                  <rect id="Rectangle-Copy-3-${id}" x="0" y="0" width="46" height="42"></rect>
                              </g>
                          </g>
                      </g>
                      <g id="ref-count-${id}" transform="translate(47.000000, 46.000000)">12</g>
                      <text id="Western-Desert-${id}" text-anchor="middle"
                        font-family="GEInspiraSans-Regular, GE Inspira Sans" font-size="20" font-weight="normal" fill="#4A4A4A">
                        <tspan x="70" y="110">${label}</tspan>
                      </text>
                      <text id="18-${id}" font-family="GEInspiraSans-Regular, GE Inspira Sans" font-size="36" font-weight="normal" fill="#59717F">
                          <tspan x="${total > 9 ? 48.848 : 60.848}" y="37">${total}</tspan>
                      </text>
                      <path d="M113,44 C113,19.699471 93.5243866,0 69.5,0 C45.4756134,0 26,19.699471 26,44" id="Oval-2-${id}" stroke="#9B9B9B" stroke-width="3"></path>
                  </g>
              </g>
            </g>
        </svg>
      `
    }

    createCustomCluster(groupsArray, colorsArray, chartSize, pathSize, markers) {
      // Create a pie generator and pass it the `groupsArray` to create a set
      // of arcs we can draw as a donut pie cart
      const pieGeneratorFn = Px.d3.pie();
      const arcData = pieGeneratorFn(groupsArray);

      // Calculate the `radius` and `innerRadius` of the chart
      const radius = (chartSize / 2);
      const innerRadius = (radius - pathSize);

      // Create a path generator. Individual entries of `arcData` can be passed
      // in to the path geneator to yield a stringified path that can be
      // appended to a `<path>` tag's `d` attribute.
      const arcPathGeneratorFn = Px.d3.arc().outerRadius(radius).innerRadius(innerRadius);

      // Iterate over a list of `arcData` entries and return a block of paths
      const pathListTmpl = (paths) => paths.map(pathTmpl).join('');

      // For each path, generate a `<path>` tag with the correct attributes
      const pathTmpl = (pathData, pathIndex) => `<path d="${arcPathGeneratorFn(pathData)}" fill="${colorsArray[pathIndex]}" opacity="1"></path>`;

      return `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none" viewBox="0 0 ${chartSize} ${chartSize}">
            <g transform="translate(${radius}, ${radius})">
                ${pathListTmpl(arcData)}
            </g>
        </svg>
      `;
    }

    createPieChart(groupsArray, colorsArray, chartSize, pathSize) {
      // Create a pie generator and pass it the `groupsArray` to create a set
      // of arcs we can draw as a donut pie cart
      const pieGeneratorFn = Px.d3.pie();
      const arcData = pieGeneratorFn(groupsArray);

      // Calculate the `radius` and `innerRadius` of the chart
      const radius = (chartSize / 2);
      const innerRadius = (radius - pathSize);

      // Create a path generator. Individual entries of `arcData` can be passed
      // in to the path geneator to yield a stringified path that can be
      // appended to a `<path>` tag's `d` attribute.
      const arcPathGeneratorFn = Px.d3.arc().outerRadius(radius).innerRadius(innerRadius);

      // Iterate over a list of `arcData` entries and return a block of paths
      const pathListTmpl = (paths) => paths.map(pathTmpl).join('');

      // For each path, generate a `<path>` tag with the correct attributes
      const pathTmpl = (pathData, pathIndex) => `<path d="${arcPathGeneratorFn(pathData)}" fill="${colorsArray[pathIndex]}" opacity="1"></path>`;

      return `
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none" viewBox="0 0 ${chartSize} ${chartSize}">
            <g transform="translate(${radius}, ${radius})">
                ${pathListTmpl(arcData)}
            </g>
        </svg>
      `;
    }
  };
  /* Bind ClusterIcon klass */
  PxMap.ClusterIcon = ClusterIcon;
})();
