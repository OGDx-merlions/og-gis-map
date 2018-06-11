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
      // window.__px_map_markergroup_tap = function(elt) {
      //   elt.click();
      // };
      if(settings.featureProperties.title) {
        html  = `
          <div class="map-icon-static__wrapper">
            <i class="map-icon-static__body" style="${customStyleBackground}"></i>
            <i class="map-icon-static__descender" style="${customStyleBorder}"></i>
            <i class="map-icon-static__badge"></i>
            <div style="padding-top: 1.5rem; margin-left: -1rem;">${settings.featureProperties.title}</div>
          </div>
        `;
      } else {
        html  = `
          <div class="map-icon-static__wrapper">
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
      // window.__px_map_markergroup_tap = function(elt) {
      //   elt.click();
      // };
      if(settings.featureProperties.title) {
        html  = `
          <div class="map-icon-symbol__wrapper">
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
        <div class="map-icon-symbol__wrapper">
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

  /**
   *
   * @class PxMap.CustomIcon
   */
  class CustomIcon {
    constructor(settings={}) {
      this.icon = this.createIcon(settings);
      return this.icon;
    }

    createIcon(settings={}) {
      let { type='info', icon='upstream', icons = [], 
        styleScope, stroke='transparent', 
        fill='#2CAC48', strokeWidth='2px', color, featureProperties={} } = settings;
      const className = this._generateCustomIconClasses(type, styleScope);

      let customStyleBackground = '';
      let customStyleBorder = '';
      let id = new Date().getTime();
      if (color) {
        customStyleBackground = `background-color: ${color};`;
        customStyleBorder = `border-color: ${color} transparent transparent;`;
      }

      if(type == 'warning') {
        fill = '#FEC600';
      } else if(type == 'important') {
        fill = '#F34336';
      }

      // Icon/Custom options
      let html = `
        <div class="map-icon-custom__wrapper">
          <div class="map-icon-custom__custom--container">
            <svg width="40" height="56" viewBox="0 0 40 60">
              <g fill="none" fill-rule="evenodd">
                <g transform="translate(6 7)" stroke-width="${strokeWidth}" stroke="${stroke}">
                  <path fill="${fill}" fill-rule="nonzero" d="M16.4935067,0 C7.39893801,0 0,7.63584766 0,17.0215273 C0,28.6694492 14.7600728,45.7692793 15.388496,46.4915371 C15.9787601,47.1700078 17.0093208,47.1688145 17.5985175,46.4915371 C18.2269407,45.7692793 32.9870135,28.6694492 32.9870135,17.0215273 C32.9868356,7.63584766 25.5879865,0 16.4935067,0 Z"/>
                  <ellipse cx="16.808" cy="17.253" fill="#FFF" rx="12.578" ry="12.98"/>
                  [[iconWithoutText]]
                </g>
                [[iconWithText]]
              </g>
            </svg>
          </div>
          <div class="map-icon-custom__title" style="color: ${fill}">${featureProperties.title || ''}</div>
        </div>
        `;

      let _getIconWithTextIfAny = (iconType, iconSvg) => {
        let iconWithText = '', iconWithoutText = '';
        if(featureProperties.kpi) {
          iconSvg = iconSvg.replace(
            '[[fillTransform]]', ' fill="#FFF" ');
          iconWithText = `
            <ellipse cx="9.5" cy="10" fill="${fill}" rx="9.5" ry="10"/>
            ${iconSvg}
            <text fill="${fill}" font-family="GEInspiraSans-Bold, GE Inspira Sans" font-size="10" font-weight="bold">
              <tspan x="13.445" y="28">${featureProperties.kpi}</tspan>
            </text>
          `;
        } else {
          let transform = "translate(6 7)";
          if("midstream" === iconType) {
            transform = "translate(2 2)";
          } else if("downstream" === iconType) {
            transform = "translate(-2 -2)";
          }
          iconWithoutText = iconSvg.replace(
            '[[fillTransform]]', 
            ` fill="${fill}" transform="${transform}" `);
        }
        return html.replace('[[iconWithText]]', iconWithText)
                .replace('[[iconWithoutText]]', iconWithoutText);
      };

      let iconHtmls = icons.map((iconType, idx)=> {
        if("midstream" === iconType) {
          return _getIconWithTextIfAny(iconType, 
            '<path [[fillTransform]] d="M8.00113777,19.9944059 L18,20 L18,12 L12.4997562,14.9292839 L12.4997562,12 L7,14.9292839 L7.0016977,18.9938463 C7.00182172,19.5458248 7.44915975,19.9933127 8.00113821,19.9936215 Z M19,9 L19,20 L22,20 L22,9 C22,8.44771525 21.5522847,8 21,8 L20,8 C19.4477153,8 19,8.44771525 19,9 Z"/>'
          );
        } else if("downstream" === iconType) {
          return _getIconWithTextIfAny(iconType, 
            '<path [[fillTransform]] d="M22.5054048,20.2575318 C23.7949322,22.5491739 25.3213116,25.187227 24.1896855,27.8252801 C23.2422776,30.0103342 19.4263292,30.4899802 17.3209784,28.9711011 C16.8209576,28.6246901 16.4525212,28.1983381 16.2156692,27.6920451 C15.0577263,25.027345 16.5841056,22.4159389 17.873633,20.1242968 C19.1631604,17.8326547 20.1895189,14.0487805 20.1895189,14.0487805 L20.847441,16.2871286 C21.2685112,17.5395376 21.8474827,19.0850637 22.5054048,20.2575318 Z M16.3173772,13.7915481 C17.0990201,15.3069857 18.027221,17.070404 17.2944308,18.8338222 C16.732625,20.294153 14.4609755,20.6247939 13.1908058,19.6053177 C12.8976897,19.3848904 12.6534264,19.0818029 12.5312947,18.751162 C11.8473572,16.9877437 12.7755581,15.2243255 13.5327746,13.7088879 C14.3144174,12.1934503 14.9250759,9.65853659 14.9250759,9.65853659 L15.3158973,11.1464207 C15.5845871,11.9730231 15.9265558,13.0200526 16.3173772,13.7915481 Z M18.4704261,8.56921112 C18.969388,9.47134344 19.5996557,10.4765766 19.1794772,11.507585 C18.7855599,12.3581669 17.2624131,12.5385933 16.4220562,11.9457635 C16.211967,11.8168875 16.0544001,11.6622362 15.9756167,11.4560345 C15.5029159,10.4250262 16.1069224,9.39401782 16.6321455,8.51766071 C17.1311073,7.61552838 17.5512858,6.14634146 17.5512858,6.14634146 L17.8138973,7.02269857 C17.9714642,7.51242755 18.2078146,8.10525736 18.4704261,8.56921112 Z"/>'
          );
        } else {
          return _getIconWithTextIfAny(iconType, 
            '<path [[fillTransform]] d="M5.76131239,7.90149518 L9.00890768,6.52297276 C9.09754886,5.8079352 9.69490916,5.25503235 10.4186283,5.25503235 C10.7450213,5.25503235 11.0457134,5.36749036 11.2856308,5.55656114 L14.0591836,4.37925782 L14.6266469,5.71611764 L13.9712865,5.99430163 L13.9712865,13.2427458 L14.6818182,13.2427458 L14.6818182,13.9130435 L6.15543838,13.9130435 L6.15543838,13.2427458 L8.99756498,13.2427458 L9.44814332,7.91426201 L6.32877572,9.238355 L6.6564441,10.0102933 C6.76434153,10.2644837 6.64574764,10.5580139 6.39155724,10.6659113 L5.3499186,11.1080607 C5.0957282,11.2159581 4.80219803,11.0973642 4.69430061,10.8431739 L3.49153433,8.00963407 C3.38363691,7.75544367 3.5022308,7.4619135 3.75642119,7.35401608 L4.79805984,6.91186671 C5.05225023,6.80396929 5.34578041,6.92256317 5.45367783,7.17675357 L5.76131239,7.90149518 Z M11.8266904,6.90462866 C11.7808978,7.24921541 11.6168445,7.55538944 11.3776799,7.77905253 L11.8396916,13.2427458 L13.2607549,13.2427458 L13.2607549,6.29590442 L11.8266904,6.90462866 Z M10.4186283,7.43349967 C10.8110441,7.43349967 11.1291599,7.10838866 11.1291599,6.7073439 C11.1291599,6.30629914 10.8110441,5.98118813 10.4186283,5.98118813 C10.0262125,5.98118813 9.70809663,6.30629914 9.70809663,6.7073439 C9.70809663,7.10838866 10.0262125,7.43349967 10.4186283,7.43349967 Z"/>'
          );
        }
      });

      const iconSize = L.point(40,56);
      const iconAnchor = L.point(19.6, 57);
      const popupAnchor = L.point(1,-58);

      // Define the `divIcon` options
      const options = {
        className,
        html:iconHtmls.join(),
        iconSize,
        iconAnchor,
        popupAnchor
      };

      return L.divIcon(options);
    }

    _generateCustomIconClasses(type, styleScope) {
      const classes = ['map-icon', 'map-icon-custom', 'map-icon-custom--with-badge'];
      if (type && type.length) {
        classes.push(`map-icon-custom--${type}`);
      }
      if (styleScope) {
        classes.push(styleScope);
      }
      return classes.join(' ');
    }
  };
  /* Bind CustomIcon klass */
  PxMap.CustomIcon = CustomIcon;
})();
