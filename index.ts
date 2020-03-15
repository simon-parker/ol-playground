import "./reset.css";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import { OSM, TileDebug } from "ol/source";

const OldImage = Image;

const imagesCurrentlyBeingLoaded = new Set();
let notifyDoneTimeout = -1;

const notifyDone = () => console.log('all images loaded successfully 👏');

const ImageLoadingSpy = (width?: number, height?: number) => {
  const image = new OldImage(width, height);

  whenSrcAttributeIsAdded(image, () => {
    clearTimeout(notifyDoneTimeout);
    imagesCurrentlyBeingLoaded.add(image.src);

    image.addEventListener("load", whenImageLoaded);
    image.addEventListener("error", whenImageLoaded);
  });

  const whenImageLoaded = () => {
    imagesCurrentlyBeingLoaded.delete(image.src);

    if (imagesCurrentlyBeingLoaded.size === 0) {
      notifyDoneTimeout = setTimeout(notifyDone, 500)
    }
  };

  return image;
};

function whenSrcAttributeIsAdded(image: HTMLImageElement, callback: () => void) {
  new MutationObserver((mutations: MutationRecord[]) => {
    for (let mutation of mutations) {
      if (mutation.attributeName === "src") {
        callback();
      }
    }
  }).observe(image, {attributes: true});
}

window.Image = ImageLoadingSpy as any;

new Map({
  layers: [
    new TileLayer({
      source: new OSM()
    }),
    new TileLayer({
      source: new TileDebug()
    })
  ],
  target: "map",
  view: new View({
    center: [0, 0],
    zoom: 1
  })
});
