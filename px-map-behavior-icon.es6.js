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
        html  = `
          <div class="map-icon-static__wrapper">
            <i class="map-icon-static__body" style="${customStyleBackground}"></i>
            <i class="map-icon-static__descender" style="${customStyleBorder}"></i>
            <i class="map-icon-static__badge"></i>
            <div style="padding-top: 1.5rem; margin-left: -1rem; 
              color: black; padding-left: 1rem; font-size: 0.8rem;
              line-height:0.7rem;">${settings.featureProperties.title}</div>
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
      if(settings.featureProperties.title) {
        stroke = 'black';
        html  = `
          <div class="map-icon-symbol__wrapper">
            <i class="map-icon-symbol__body" style="${customStyleBackground}">
              <div class="map-icon-symbol__symbol--container flex flex--middle flex--center">
                <px-icon icon="${icon}" style="stroke:${stroke}; fill:${fill}; width:100%; height:100%; stroke-width:${strokeWidth}"></px-icon>
              </div>
            </i>
            <i class="map-icon-symbol__descender" style="${customStyleBorder}"></i>
            <i class="map-icon-symbol__badge"></i>
            <div style="padding-top: 3.5rem; margin-left: -1rem; 
              color: black; padding-left: 1rem; font-size: 0.8rem;
              line-height:0.7rem;">${settings.featureProperties.title}</div>
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

      const markerTypeArray = this._getOilGasRefCount(markers);
      const [oil, gas, ref] = markerTypeArray;
      const id = new Date().getTime();
      const regionLabel = oil.label || gas.label || ref.label || '';
      // Generate the classes and wrapper HTML
      const classes = `map-icon-cluster ${className||''} ${styleScope||''}`;
      const tooltipMsgHtml = `
        <div style="width: 200%">
          <div>
            <span style="padding-right: 3rem;">${regionLabel}</span>
            <b>${oil.production+gas.production+ref.production} BOE/day</b>
          </div>
          <div style="display: inline-block; padding-top: 1rem;">
            <span style="padding-right: 1rem;">
              <px-icon icon="px-obj:line-og"></px-icon>
              <span style="font-weight: bold; font-size: 2rem;">${oil.count}</span>
            </span>
            <span style="padding-right: 1rem;">
              <px-icon icon="px-obj:boiler"></px-icon>
              <span style="font-weight: bold; font-size: 2rem;">${gas.count}</span>
            </span>
            <span style="padding-right: 1rem;">
              <px-icon icon="px-obj:hrsg"></px-icon>
              <span style="font-weight: bold; font-size: 2rem;">${ref.count}</span>
            </span>
          </div>
        </div>
      `;

      // Get the SVG for this icon
      const svg = this._generateClusterIconSVG(countByType, colorsByType, chartSize, pathSize, oil, gas, ref, regionLabel);
      const html = `
        <px-tooltip
          style="margin: 2rem;"
          for="cluster-${id}"
          orientation="auto">
          ${tooltipMsgHtml}
        </px-tooltip>  
        <i class="map-icon-cluster__svg">${svg}</i>
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

    _generateClusterIconSVG(countByType, colorsByType, chartSize, pathSize, oil, gas, ref, regionLabel) {
      // Combine the `countByType` and `colorsByType` into one array of objects,
      // each describing a type with its associated count and color
      const typeKeys = Object.keys(countByType);
      const typeObjs = typeKeys.map(type => ({ type: type, count: countByType[type], color: colorsByType[type] }));

      // Sort the types from highest->lowest
      typeObjs.sort((a,b) => a.count - b.count);

      // Create two parallel arrays of [types] and [colors]
      const types = [];
      const colors = [];
      let i, len, type, total;
      for (i=0, len=typeKeys.length; i<len; i++) {
        type = typeKeys[i];
        total = countByType[type];
        types.push(countByType[type]);
        colors.push(colorsByType[type])
      }

      // Return the pie chart
      return this.createPieChart(types, colors, chartSize, pathSize, oil, gas, ref, regionLabel);
    }

    createPieChart(groupsArray, colorsArray, chartSize, pathSize, oil, gas, ref, regionLabel) {
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

      // return `
      //   <svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none" viewBox="0 0 ${chartSize} ${chartSize}">
      //       <g transform="translate(${radius}, ${radius})">
      //           ${pathListTmpl(arcData)}
      //       </g>
      //   </svg>
      // `;
      const id = new Date().getTime();
      const col = regionLabel == "Reggane" ? "#be4748" : "#679f00";
      return `
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" preserveAspectRatio="none" width="131px" height="109px" viewBox="0 0 140 120">
      <g id="MOP-${id}" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="1a.-Ministry-dashboard-Copy-3-${id}" transform="translate(-1113.000000, -429.000000)">
            <g id="Group-2-${id}" transform="translate(1114.000000, 430.000000)">
                <circle id="Oval-4-${id}" stroke="#9B9B9B" stroke-width="2" cx="64.5" cy="39.5" r="39.5"></circle>
                <text id="Eastern-Desert-${id}" font-family="GEInspiraSans-Regular, GE Inspira Sans" font-size="15" font-weight="normal" fill="#4A4A4A">
                    <tspan x="70" y="88">${regionLabel}</tspan>
                </text>
                <circle id="Oval-3-${id}" stroke="#9B9B9B" fill="${col}" cx="22.5" cy="63.5" r="22.5"></circle>
                <path d="M13.2965521,61.7696442 L20.4648222,58.726894 C20.6596173,57.1509388 21.9800861,55.9319854 23.5800476,55.9319854 C24.2994919,55.9319854 24.9624234,56.1784544 25.491907,56.5930231 L31.6262816,53.9891356 L32.8760374,56.9333756 L31.4300079,57.5471786 L31.4300079,73.5237666 L32,73.5237666 C32.5522847,73.5237666 33,73.9714819 33,74.5237666 L33,75 L14.1600953,75 L14.1600953,74.5237666 C14.1600953,73.9714819 14.6078105,73.5237666 15.1600953,73.5237666 L20.4400635,73.5237666 L21.4355766,61.7895631 L14.5463078,64.7138842 L15.4976591,66.9551275 C15.6055566,67.2093179 15.4869627,67.5028481 15.2327723,67.6107455 L11.8177212,69.0603487 C11.5635308,69.1682461 11.2700006,69.0496522 11.1621032,68.7954618 L8.04338728,61.4482275 C7.93548985,61.1940371 8.05408374,60.9005069 8.30827414,60.7926095 L11.7233252,59.3430063 C11.9775156,59.2351089 12.2710458,59.3537028 12.3789432,59.6078932 L13.2965521,61.7696442 Z M26.6921933,59.5582616 C26.5922588,60.3199034 26.2291879,60.9967349 25.6991699,61.490774 L26.7200318,73.5237666 L29.8600159,73.5237666 L29.8600159,58.2136007 L26.6921933,59.5582616 Z M23.5800476,60.7297439 C24.4471303,60.7297439 25.1500397,60.013734 25.1500397,59.1304911 C25.1500397,58.2472481 24.4471303,57.5312382 23.5800476,57.5312382 C22.712965,57.5312382 22.0100556,58.2472481 22.0100556,59.1304911 C22.0100556,60.013734 22.712965,60.7297439 23.5800476,60.7297439 Z" id="Combined-Shape-Copy-5" fill="#FFFFFF"></path>
                <text id="12-${id}" font-family="GEInspiraSans-Regular, GE Inspira Sans" font-size="36" font-weight="normal" fill="#59717F">
                    <tspan x="48.848" y="50">${oil.count}</tspan>
                </text>
            </g>
        </g>
      </g>
      </svg>`;
    }
  };
  /* Bind ClusterIcon klass */
  PxMap.ClusterIcon = ClusterIcon;
})();
