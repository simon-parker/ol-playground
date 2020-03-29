// noinspection JSUnusedGlobalSymbols
export default null;
declare var self: ServiceWorkerGlobalScope;

self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('fetch', (event: FetchEvent) => event.respondWith(mockResponse(event.request)));

const mockResponse = async (request: Request) => {
  if (request.url.includes('tile.openstreetmap.org')) {
    const [x, y, z] = request.url.match(/.*\.org\/(.*)\.png/)![1].split('/');

    // language=SVG
    const svg = `
      <svg viewBox="0 0 256 256" width="256" height="256" xmlns="http://www.w3.org/2000/svg">
        <rect width="256" height="256" fill="#044B94" fill-opacity="0.5" stroke="white" stroke-width="1"/>

        <text x="0%" dx="0.5em" y="100%" dy="-0.5em" font-size="12" stroke="white">x: ${x} y: ${y} z: ${z}</text>
      </svg>
    `;

    return new Response(svg, {headers: {'Content-Type': 'image/svg+xml'}});
  }

  return await fetch(request);
};
