import "../reset.css";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Text from "ol/style/Text";
import Fill from "ol/style/Fill";

const source = new VectorSource()
const SQUARE_SIDE = 5e6;

const geometry = new Polygon([[[0, 0], [0, SQUARE_SIDE], [SQUARE_SIDE, SQUARE_SIDE], [SQUARE_SIDE, 0]]]);
const feature = new Feature(geometry);
feature.setStyle(new Style({
  stroke: new Stroke({color: 'red', width: 3}),
  text: new Text({text: 'test', font: '20px monospace', fill: new Fill({color: 'red'})})
}))
source.addFeature(feature)

const map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new VectorLayer({source: source}),
  ],
  view: new View({
    center: [SQUARE_SIDE / 2, SQUARE_SIDE / 2],
    zoom: 3
  })
});

const prototype: CanvasRenderingContext2D | any = CanvasRenderingContext2D.prototype;

const methodsToSpyOn = Object.keys(prototype)
  .filter((key) => {
    try {
      return typeof prototype[key] === 'function';
    } catch (e) {
      // ignore platform objects https://stackoverflow.com/a/51272743
      return false;
    }
  })

const methodsWeCareAbout = new Set(['beginPath', 'lineTo', 'closePath', 'translate', 'fillText'])

methodsToSpyOn.forEach((methodName) => {
  prototype[methodName] = new Proxy(prototype[methodName], {
    apply(target: any, thisArg: any, argArray?: any): any {
      if (methodsWeCareAbout.has(target.name)) {
        console.log(target.name, argArray)
      }
      return target.apply(thisArg, argArray);
    }
  })
})

map.setTarget(document.querySelector<HTMLDivElement>('.map')!)
