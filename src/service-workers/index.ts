import "../reset.css";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.ts', {scope: '/service-workers/'}).then((reg: ServiceWorkerRegistration) => {
    if (reg.active) {
      renderMap();
    }
  });

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    renderMap();
  })
}

const renderMap = () => {
  new Map({
    layers: [new TileLayer({source: new OSM()})],
    target: "map",
    view: new View({
      center: [0, 0],
      zoom: 2
    })
  });
};
