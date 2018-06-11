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
          iconWithoutText = iconSvg;
        }
        return html.replace('[[iconWithText]]', iconWithText)
                .replace('[[iconWithoutText]]', iconWithoutText);
      };

      let iconHtmls = icons.map((iconType, idx)=> {
        let iconSvg = '<path fill="#FFF" d="M5.76131239,7.90149518 L9.00890768,6.52297276 C9.09754886,5.8079352 9.69490916,5.25503235 10.4186283,5.25503235 C10.7450213,5.25503235 11.0457134,5.36749036 11.2856308,5.55656114 L14.0591836,4.37925782 L14.6266469,5.71611764 L13.9712865,5.99430163 L13.9712865,13.2427458 L14.6818182,13.2427458 L14.6818182,13.9130435 L6.15543838,13.9130435 L6.15543838,13.2427458 L8.99756498,13.2427458 L9.44814332,7.91426201 L6.32877572,9.238355 L6.6564441,10.0102933 C6.76434153,10.2644837 6.64574764,10.5580139 6.39155724,10.6659113 L5.3499186,11.1080607 C5.0957282,11.2159581 4.80219803,11.0973642 4.69430061,10.8431739 L3.49153433,8.00963407 C3.38363691,7.75544367 3.5022308,7.4619135 3.75642119,7.35401608 L4.79805984,6.91186671 C5.05225023,6.80396929 5.34578041,6.92256317 5.45367783,7.17675357 L5.76131239,7.90149518 Z M11.8266904,6.90462866 C11.7808978,7.24921541 11.6168445,7.55538944 11.3776799,7.77905253 L11.8396916,13.2427458 L13.2607549,13.2427458 L13.2607549,6.29590442 L11.8266904,6.90462866 Z M10.4186283,7.43349967 C10.8110441,7.43349967 11.1291599,7.10838866 11.1291599,6.7073439 C11.1291599,6.30629914 10.8110441,5.98118813 10.4186283,5.98118813 C10.0262125,5.98118813 9.70809663,6.30629914 9.70809663,6.7073439 C9.70809663,7.10838866 10.0262125,7.43349967 10.4186283,7.43349967 Z"/>';
        if(featureProperties.kpi) {
          if("midstream" === iconType) {
            iconSvg = '<path fill="#FFF" d="M4.0596208,12.721266 L10.7670588,12.7247059 L10.7670588,7.58588235 L6.91277031,9.46751649 L6.91277031,7.58588235 L3.05882353,9.46751649 L3.06013406,11.720753 C3.06026936,12.2727417 3.50763249,12.7202247 4.05962119,12.7205077 Z M11.6235294,5.58823529 L11.6235294,12.7247059 L13.7647059,12.7247059 L13.7647059,5.58823529 C13.7647059,5.03595054 13.3169906,4.58823529 12.7647059,4.58823529 L12.6235294,4.58823529 C12.0712447,4.58823529 11.6235294,5.03595054 11.6235294,5.58823529 Z"/>';
          } else if("downstream" === iconType) {
            iconSvg = '<path fill="#FFF" d="M11.835484,10.1946055 C12.5574568,11.4776362 13.4120368,12.9546134 12.7784689,14.4315906 C12.2480399,15.6549455 10.1115898,15.9234868 8.93285871,15.073106 C8.65291008,14.8791595 8.44663214,14.6404561 8.31402489,14.3569958 C7.66572279,12.8650997 8.52030283,11.4030414 9.24227562,10.1200107 C9.96424841,8.83697997 10.5388798,6.71848739 10.5388798,6.71848739 L10.9072333,7.97168019 C11.1429795,8.67287139 11.4671305,9.53817117 11.835484,10.1946055 Z M8.37096856,6.5744697 C8.80859004,7.42292372 9.32826554,8.41021567 8.91799541,9.39750762 C8.60345497,10.2151088 7.33161757,10.400226 6.62048267,9.82944784 C6.45637462,9.70603635 6.31961791,9.53634555 6.25123955,9.35122831 C5.86832076,8.36393636 6.38799626,7.37664441 6.81194207,6.52819039 C7.24956354,5.67973638 7.59145532,4.2605042 7.59145532,4.2605042 L7.81026605,5.09353178 C7.96069843,5.55632488 8.15215783,6.14252948 8.37096856,6.5744697 Z M9.57640453,3.65061925 C9.8557603,4.15569964 10.2086307,4.7185035 9.97338378,5.29573822 C9.75283975,5.77195687 8.90006953,5.87297295 8.42957561,5.54106298 C8.31195213,5.46890864 8.22373452,5.38232343 8.17962571,5.26687649 C7.91497288,4.68964176 8.25314039,4.11240703 8.54719909,3.62175752 C8.82655485,3.11667713 9.06180181,2.29411765 9.06180181,2.29411765 L9.20883116,2.78476716 C9.29704877,3.05895366 9.42937518,3.39086363 9.57640453,3.65061925 Z"/>';
          } else if("ship" === iconType) {
            iconSvg = '<path fill="#FFF" d="M14.422056,13.2874882 C14.1585859,13.1290651 13.8945244,13.0620425 13.5429325,13.0620425 C13.0246333,13.0620425 12.6965481,13.2076907 12.2801672,13.5770813 C12.2463641,13.6070697 12.2207596,13.6288555 12.2023345,13.6439628 C12.1839093,13.6288555 12.1583049,13.6070697 12.1245017,13.5770813 C11.7081208,13.2076907 11.3800356,13.0620425 10.8617364,13.0620425 C10.3434372,13.0620425 10.015352,13.2076907 9.59897113,13.5770813 C9.56516795,13.6070697 9.53956354,13.6288555 9.52113836,13.6439628 C9.50271318,13.6288555 9.47710876,13.6070697 9.44330558,13.5770813 C9.02692471,13.2076907 8.69883948,13.0620425 8.18054031,13.0620425 C7.66224114,13.0620425 7.33415591,13.2076907 6.91777504,13.5770813 C6.88397186,13.6070697 6.85836744,13.6288555 6.83994226,13.6439628 C6.82151708,13.6288555 6.79591266,13.6070697 6.76210948,13.5770813 C6.34572861,13.2076907 6.01764338,13.0620425 5.49934421,13.0620425 C5.38113882,13.0620425 5.27282721,13.069618 5.17110531,13.0856957 C5.03777278,12.9020154 4.9049604,12.7096324 4.78010632,12.5157957 C4.68878294,12.3740159 4.60481726,12.2361494 4.52974712,12.1035934 C4.46279615,11.9853739 4.40348172,11.8723594 4.35258474,11.765121 C4.27514543,11.6019583 4.20333563,11.4188044 4.1365777,11.2189232 C4.04604192,10.9478486 3.96893876,10.6592783 3.90474288,10.3709636 C3.88231367,10.2702303 3.8630714,10.1766079 3.84699779,10.0923871 C3.83725047,10.0413135 3.83065926,10.0043106 3.82721509,9.9836864 C3.79722323,9.80408793 3.9540913,9.64278709 4.15874616,9.64278709 L7.00751702,9.64278709 C7.08869794,9.64278709 7.16711957,9.66892744 7.22821448,9.71635266 L8.47404247,10.68343 L14.8835306,10.68343 C15.0277891,10.68343 15.1558628,10.7653227 15.2014814,10.8867336 C15.215442,10.9238895 15.2332892,10.9837029 15.2501786,11.0636139 C15.3144016,11.3674822 15.3144016,11.7183259 15.2086733,12.0935118 C15.1330358,12.3619181 14.9743732,12.6353885 14.7579683,12.9096497 C14.6547689,13.0404396 14.5447814,13.1631052 14.4346782,13.2747368 C14.4304138,13.2790604 14.4262058,13.2833112 14.422056,13.2874882 Z M6.33721799,12.0213995 L7.34266653,12.0213995 C7.43521555,12.0213995 7.51024128,11.9548407 7.51024128,11.8727362 L7.51024128,11.5754097 C7.51024128,11.4933052 7.43521555,11.4267464 7.34266653,11.4267464 L6.33721799,11.4267464 C6.24466897,11.4267464 6.16964323,11.4933052 6.16964323,11.5754097 L6.16964323,11.8727362 C6.16964323,11.9548407 6.24466897,12.0213995 6.33721799,12.0213995 Z M8.01296555,6.55413328 L8.01296555,5.91429278 L7.18631392,5.28569791 L4.34332004,7.67510389 C4.27613379,7.73157081 4.17007019,7.72902763 4.10642011,7.66942376 L3.8759227,7.45357866 C3.81227262,7.3939748 3.81513932,7.29988075 3.8823254,7.24341383 L6.94459454,4.66971728 C7.06920765,4.56498563 7.2628743,4.56071082 7.39320422,4.65981511 L8.56622752,5.55179477 C8.64051207,5.60828147 8.68326458,5.69074484 8.68326458,5.77754189 L8.68326458,6.55413328 C8.95126403,6.60807813 9.20587779,6.72761396 9.41455428,6.91274047 C9.95034104,7.38806157 9.99872859,8.13203801 9.55971691,8.65588429 C9.55321602,8.66364154 9.54574721,8.67215013 9.53731066,8.68140977 C9.53360089,8.68548166 9.52965115,8.68937679 9.52547804,8.69307895 C9.46003591,8.75113553 9.35393344,8.75113553 9.28849147,8.69307895 L9.0472646,8.47907549 C8.98844267,8.42689185 8.98167634,8.3443268 9.03137164,8.28514394 C9.05468447,8.25738033 9.0724789,8.2334732 9.08475459,8.21342268 C9.25732324,7.93155756 9.20926548,7.57158579 8.94058131,7.3332237 C8.61337116,7.04294066 8.08285897,7.04294066 7.75564882,7.3332237 C7.4818692,7.57610619 7.43716344,7.9452545 7.62153153,8.22937321 C7.6318771,8.24531601 7.64607638,8.26399719 7.66412971,8.28541644 C7.71401336,8.34460108 7.70731975,8.42730677 7.64841706,8.47956206 L7.40772575,8.6930904 C7.40354225,8.69680178 7.39914039,8.7003138 7.39453829,8.70361204 C7.32254616,8.75520741 7.21703791,8.74525887 7.15887908,8.68139134 C7.15072154,8.67243289 7.14348147,8.66418728 7.13715888,8.65665422 C6.69745428,8.13276721 6.74562649,7.38829452 7.28167585,6.91274047 C7.49035234,6.72761396 7.74496609,6.60807813 8.01296555,6.55413328 Z M12.2023345,7.11551138 L12.8726335,7.11551138 C13.0577314,7.11551138 13.207783,7.24862909 13.207783,7.41283794 L13.207783,8.45348087 L11.0293112,8.45348087 L11.0293112,7.41283794 C11.0293112,7.24862909 11.1793628,7.11551138 11.3644607,7.11551138 L11.5320354,7.11551138 L11.5320354,6.52085828 L11.1968859,6.52085828 C11.1043369,6.52085828 11.0293112,6.4542995 11.0293112,6.372195 L11.0293112,6.07486844 C11.0293112,5.99276395 11.1043369,5.92620517 11.1968859,5.92620517 L11.5320354,5.92620517 L11.5320354,5.62887861 C11.5320354,5.54677412 11.6070612,5.48021534 11.6996102,5.48021534 L12.0347597,5.48021534 C12.1273087,5.48021534 12.2023345,5.54677412 12.2023345,5.62887861 L12.2023345,5.92620517 L12.537484,5.92620517 C12.630033,5.92620517 12.7050587,5.99276395 12.7050587,6.07486844 L12.7050587,6.372195 C12.7050587,6.4542995 12.630033,6.52085828 12.537484,6.52085828 L12.2023345,6.52085828 L12.2023345,7.11551138 Z M11.0293112,10.2374402 L11.0293112,8.8994707 L13.878082,8.8994707 C14.0151262,8.8994707 14.1383637,8.97349045 14.1892605,9.086373 L14.5028584,10.2374402 L11.0293112,10.2374402 Z"/>';
          } else if("storage" === iconType) { 
            iconSvg = '<path fill="#FFF" d="M10.6,7.97022967 L10.6,8.2 L10.6,12.2785883 C10.4383263,12.2592534 10.2885039,12.2013442 10.16,12.1143277 C10.0002244,12.2225198 9.80749211,12.2857143 9.6,12.2857143 L5,12.2857143 C4.44771525,12.2857143 4,11.837999 4,11.2857143 L4,7.83809524 C4,7.28581049 4.44771525,6.83809524 5,6.83809524 L9.6,6.83809524 C10.1522847,6.83809524 10.6,7.28581049 10.6,7.83809524 L10.6,7.97022967 Z M11.48,8.0952381 L14,8.0952381 C14.5522847,8.0952381 15,8.54295335 15,9.0952381 L15,11.2857143 C15,11.837999 14.5522847,12.2857143 14,12.2857143 L11.48,12.2857143 L11.48,8.2 L11.48,8.0952381 Z M4.44,7.67619048 L4.44,11.447619 L5.32,11.447619 L5.32,7.67619048 L4.44,7.67619048 Z M11.92,8.93333333 L11.92,11.447619 L12.36,11.447619 L12.36,8.93333333 L11.92,8.93333333 Z M4.20952381,6 L10.3904762,6 C10.506193,6 10.6,6.093807 10.6,6.20952381 C10.6,6.32524061 10.506193,6.41904762 10.3904762,6.41904762 L4.20952381,6.41904762 C4.093807,6.41904762 4,6.32524061 4,6.20952381 C4,6.093807 4.093807,6 4.20952381,6 Z M11.48,7.25714286 L14.7904762,7.25714286 C14.906193,7.25714286 15,7.35094986 15,7.46666667 C15,7.58238347 14.906193,7.67619048 14.7904762,7.67619048 L11.48,7.67619048 L11.48,7.25714286 Z"/>';
          }
        } else {
          iconSvg = `<path fill="${fill}" transform="translate(6 7)" d="M5.76131239,7.90149518 L9.00890768,6.52297276 C9.09754886,5.8079352 9.69490916,5.25503235 10.4186283,5.25503235 C10.7450213,5.25503235 11.0457134,5.36749036 11.2856308,5.55656114 L14.0591836,4.37925782 L14.6266469,5.71611764 L13.9712865,5.99430163 L13.9712865,13.2427458 L14.6818182,13.2427458 L14.6818182,13.9130435 L6.15543838,13.9130435 L6.15543838,13.2427458 L8.99756498,13.2427458 L9.44814332,7.91426201 L6.32877572,9.238355 L6.6564441,10.0102933 C6.76434153,10.2644837 6.64574764,10.5580139 6.39155724,10.6659113 L5.3499186,11.1080607 C5.0957282,11.2159581 4.80219803,11.0973642 4.69430061,10.8431739 L3.49153433,8.00963407 C3.38363691,7.75544367 3.5022308,7.4619135 3.75642119,7.35401608 L4.79805984,6.91186671 C5.05225023,6.80396929 5.34578041,6.92256317 5.45367783,7.17675357 L5.76131239,7.90149518 Z M11.8266904,6.90462866 C11.7808978,7.24921541 11.6168445,7.55538944 11.3776799,7.77905253 L11.8396916,13.2427458 L13.2607549,13.2427458 L13.2607549,6.29590442 L11.8266904,6.90462866 Z M10.4186283,7.43349967 C10.8110441,7.43349967 11.1291599,7.10838866 11.1291599,6.7073439 C11.1291599,6.30629914 10.8110441,5.98118813 10.4186283,5.98118813 C10.0262125,5.98118813 9.70809663,6.30629914 9.70809663,6.7073439 C9.70809663,7.10838866 10.0262125,7.43349967 10.4186283,7.43349967 Z"/>`;
          if("midstream" === iconType) {
            iconSvg = `<path fill="${fill}" d="M10.0010955,22.1746818 L19.5912,22.1796 L19.5912,15.1188 L14.2953652,17.704186 L14.2953652,15.1188 L9,17.704186 L9.00160877,21.1741688 C9.00174407,21.7261575 9.44910719,22.1736404 10.0010959,22.1739235 Z M20.768,12 L20.768,22.1796 L23.71,22.1796 L23.71,12 C23.71,11.4477153 23.2622848,11 22.71,11 L21.768,11 C21.2157153,11 20.768,11.4477153 20.768,12 Z"/>`;
          } else if("downstream" === iconType) {
            iconSvg = `<path fill="${fill}" d="M20.3774759,18.1936552 C21.3090059,19.8490938 22.4116333,21.7547732 21.5941682,23.6604525 C20.9097787,25.238894 18.1532103,25.5853812 16.6323449,24.4881719 C16.2711394,24.2379311 16.004988,23.9299425 15.8338906,23.5642061 C14.9974147,21.6392775 16.100042,19.7528474 17.0315721,18.0974088 C17.9631021,16.4419702 18.704524,13.7085715 18.704524,13.7085715 L19.1797944,15.3255116 C19.4839675,16.230228 19.9022054,17.3466866 20.3774759,18.1936552 Z M15.9073626,13.5227518 C16.4720065,14.617475 17.1425211,15.8913348 16.6131675,17.1651946 C16.2073296,18.2201097 14.5663332,18.4589584 13.6487869,17.7225082 C13.4370454,17.5632757 13.2605942,17.3443311 13.1723686,17.1054824 C12.6783051,15.8316226 13.3488198,14.5577628 13.8958186,13.4630396 C14.4604625,12.3683163 14.9015906,10.5371429 14.9015906,10.5371429 L15.1839125,11.6119621 C15.3780089,12.2090839 15.6250406,12.9654381 15.9073626,13.5227518 Z M17.4626841,9.75023492 C17.8231246,10.4019181 18.278418,11.1280794 17.9748891,11.8728602 C17.6903307,12.4873044 16.5900385,12.6176411 15.9829807,12.1893921 C15.8312162,12.0962945 15.7173929,11.9845774 15.6604812,11.8356212 C15.3190112,11.0908404 15.755334,10.3460596 16.1347451,9.71299587 C16.4951857,9.06131266 16.7987146,8 16.7987146,8 L16.9884202,8.63306369 C17.1022435,8.98683458 17.2729785,9.41508355 17.4626841,9.75023492 Z"/>`;
          } else if("ship" === iconType) {
            iconSvg = `<path fill="${fill}" d="M23.2938797,22.7323927 C22.9385464,22.5187326 22.5824155,22.4283415 22.1082352,22.4283415 C21.4092224,22.4283415 20.9667447,22.6247724 20.4051857,23.1229572 C20.3595965,23.1634015 20.3250647,23.1927834 20.3002153,23.2131581 C20.2753658,23.1927834 20.240834,23.1634015 20.1952448,23.1229572 C19.6336858,22.6247724 19.1912082,22.4283415 18.4921953,22.4283415 C17.7931825,22.4283415 17.3507049,22.6247724 16.7891459,23.1229572 C16.7435566,23.1634015 16.7090248,23.1927834 16.6841754,23.2131581 C16.659326,23.1927834 16.6247941,23.1634015 16.5792049,23.1229572 C16.0176459,22.6247724 15.5751683,22.4283415 14.8761555,22.4283415 C14.1771426,22.4283415 13.734665,22.6247724 13.173106,23.1229572 C13.1275168,23.1634015 13.092985,23.1927834 13.0681355,23.2131581 C13.0432861,23.1927834 13.0087543,23.1634015 12.9631651,23.1229572 C12.401606,22.6247724 11.9591284,22.4283415 11.2601156,22.4283415 C11.1006959,22.4283415 10.9546197,22.4385584 10.8174307,22.4602418 C10.6376096,22.2125182 10.45849,21.9530578 10.2901034,21.6916367 C10.1669386,21.5004229 10.0536969,21.314487 9.9524523,21.1357131 C9.86215775,20.9762745 9.78216236,20.8238555 9.7135193,20.6792267 C9.60907948,20.4591746 9.51223199,20.212161 9.42219779,19.9425879 C9.3000952,19.5769987 9.19610874,19.1878135 9.1095299,18.798973 C9.07928037,18.6631173 9.05332896,18.536852 9.03165103,18.4232661 C9.01850514,18.3543849 9.00961578,18.3044804 9.00497075,18.2766652 C8.96452173,18.0344467 9.17608447,17.8169056 9.45209566,17.8169056 L13.294138,17.8169056 C13.403624,17.8169056 13.5093887,17.8521603 13.5917853,17.9161211 L15.271992,19.2203861 L23.9162551,19.2203861 C24.1108119,19.2203861 24.2835406,19.330832 24.3450648,19.4945749 C24.3638931,19.5446857 24.387963,19.6253542 24.4107411,19.7331274 C24.4973566,20.1429445 24.4973566,20.6161157 24.3547644,21.1221164 C24.2527545,21.4841071 24.0387715,21.8529275 23.7469135,22.2228144 C23.6077319,22.3992064 23.4593954,22.5646415 23.3109029,22.7151952 C23.3051516,22.7210263 23.2994765,22.7267593 23.2938797,22.7323927 Z M12.3901281,21.024861 L13.746143,21.024861 C13.8709608,21.024861 13.9721455,20.9350954 13.9721455,20.8243638 L13.9721455,20.4233694 C13.9721455,20.3126378 13.8709608,20.2228721 13.746143,20.2228721 L12.3901281,20.2228721 C12.2653103,20.2228721 12.1641256,20.3126378 12.1641256,20.4233694 L12.1641256,20.8243638 C12.1641256,20.9350954 12.2653103,21.024861 12.3901281,21.024861 Z M14.650153,13.6513411 L14.650153,12.7884096 L13.5352754,11.9406446 L9.7010243,15.1631569 C9.61041244,15.2393119 9.46736801,15.235882 9.38152526,15.1554963 L9.07066109,14.8643932 C8.98481834,14.7840074 8.98868456,14.6571059 9.07929619,14.5809509 L13.2092766,11.109892 C13.3773381,10.968644 13.6385299,10.9628787 13.8143015,11.0965373 L15.396319,12.2995206 C15.4965041,12.3757023 15.5541629,12.4869179 15.5541629,12.6039782 L15.5541629,13.6513411 C15.9156049,13.7240947 16.258994,13.8853087 16.540429,14.1349827 C17.2630268,14.7760324 17.3282854,15.7794087 16.736205,16.4859027 C16.7274375,16.4963647 16.7173645,16.5078399 16.7059864,16.5203281 C16.7009832,16.5258197 16.6956563,16.5310729 16.6900282,16.5360659 C16.6017686,16.6143649 16.4586717,16.6143649 16.3704123,16.5360659 L16.0450776,16.2474466 C15.9657465,16.1770682 15.9566209,16.0657155 16.0236433,15.9858976 C16.0550846,15.9484537 16.0790833,15.9162109 16.0956391,15.8891695 C16.3283767,15.5090274 16.2635628,15.0235454 15.9011974,14.7020744 C15.4599,14.3105794 14.7444159,14.3105794 14.3031185,14.7020744 C13.933881,15.029642 13.8735878,15.5275 14.1222389,15.9106814 C14.1361917,15.9321829 14.1553418,15.9573776 14.1796897,15.9862651 C14.2469661,16.0660854 14.2379387,16.1776278 14.1584986,16.2481028 L13.8338862,16.5360813 C13.8282441,16.5410868 13.8223074,16.5458233 13.8161007,16.5502715 C13.7190073,16.6198565 13.5767119,16.6064392 13.498275,16.5203032 C13.4872732,16.5082213 13.4775088,16.4971007 13.4689817,16.4869411 C12.8759667,15.7803921 12.940935,14.7763466 13.6638869,14.1349827 C13.9453219,13.8853087 14.288711,13.7240947 14.650153,13.6513411 Z M20.3002153,14.4084531 L21.2042252,14.4084531 C21.4538606,14.4084531 21.6562302,14.5879845 21.6562302,14.8094475 L21.6562302,16.212928 L18.7181978,16.212928 L18.7181978,14.8094475 C18.7181978,14.5879845 18.9205675,14.4084531 19.1702028,14.4084531 L19.3962053,14.4084531 L19.3962053,13.6064642 L18.9442003,13.6064642 C18.8193825,13.6064642 18.7181978,13.5166986 18.7181978,13.405967 L18.7181978,13.0049726 C18.7181978,12.894241 18.8193825,12.8044754 18.9442003,12.8044754 L19.3962053,12.8044754 L19.3962053,12.403481 C19.3962053,12.2927494 19.49739,12.2029838 19.6222078,12.2029838 L20.0742128,12.2029838 C20.1990306,12.2029838 20.3002153,12.2927494 20.3002153,12.403481 L20.3002153,12.8044754 L20.7522202,12.8044754 C20.877038,12.8044754 20.9782227,12.894241 20.9782227,13.0049726 L20.9782227,13.405967 C20.9782227,13.5166986 20.877038,13.6064642 20.7522202,13.6064642 L20.3002153,13.6064642 L20.3002153,14.4084531 Z M18.7181978,18.6188945 L18.7181978,16.8144196 L22.5602402,16.8144196 C22.745067,16.8144196 22.9112733,16.9142476 22.9799162,17.0664885 L23.4028552,18.6188945 L18.7181978,18.6188945 Z"/>`;
          } else if("storage" === iconType) { 
            iconSvg = `<path fill="${fill}" d="M18.6,16.047619 L18.6,16.2 L18.6,22.1428571 L18.32,22.1428571 C18.1930905,22.1428571 18.0717026,22.1192162 17.96,22.0760981 C17.8482974,22.1192162 17.7269095,22.1428571 17.6,22.1428571 L10,22.1428571 C9.44771525,22.1428571 9,21.6951419 9,21.1428571 L9,15.2190476 C9,14.6667629 9.44771525,14.2190476 10,14.2190476 L17.6,14.2190476 C18.1522847,14.2190476 18.6,14.6667629 18.6,15.2190476 L18.6,16.047619 Z M19.88,16.047619 L24,16.047619 C24.5522847,16.047619 25,16.4953343 25,17.047619 L25,21.1428571 C25,21.6951419 24.5522847,22.1428571 24,22.1428571 L19.88,22.1428571 L19.88,16.2 L19.88,16.047619 Z M9.64,15.4380952 L9.64,20.9238095 L10.92,20.9238095 L10.92,15.4380952 L9.64,15.4380952 Z M20.52,17.2666667 L20.52,20.9238095 L21.16,20.9238095 L21.16,17.2666667 L20.52,17.2666667 Z M9.3047619,13 L18.2952381,13 C18.4635534,13 18.6,13.1364466 18.6,13.3047619 C18.6,13.4730773 18.4635534,13.6095238 18.2952381,13.6095238 L9.3047619,13.6095238 C9.13644655,13.6095238 9,13.4730773 9,13.3047619 C9,13.1364466 9.13644655,13 9.3047619,13 Z M19.88,14.8285714 L24.6952381,14.8285714 C24.8635534,14.8285714 25,14.965018 25,15.1333333 C25,15.3016487 24.8635534,15.4380952 24.6952381,15.4380952 L19.88,15.4380952 L19.88,14.8285714 Z"/>`;
          }
        }
        return _getIconWithTextIfAny(iconType, iconSvg);
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
