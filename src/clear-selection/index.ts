import "../reset.css";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Select from "ol/interaction/Select";
import { defaults as defaultInterations } from "ol/interaction";
import countriesJson from '../countries.geojson';

const selectInteraction = new Select();

new Map({
  layers: [
    new TileLayer({source: new OSM(),}),
    new VectorLayer({source: new VectorSource({format: new GeoJSON(), url: countriesJson})}),
  ],
  interactions: defaultInterations().extend([selectInteraction]),
  target: "map",
  view: new View({
    center: [0, 0],
    zoom: 2
  })
});

window.addEventListener('load', () => {
  const clearButton = document.querySelector('.clear-selection button');
  clearButton!.addEventListener('click', e => {
    e.preventDefault();

    selectInteraction.getFeatures().clear();
  })
});
