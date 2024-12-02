# Map services

## [Mapbox](https://docs.mapbox.com/mapbox-gl-js/guides/)

Also offers a [Geocoding API](https://docs.mapbox.com/api/search/geocoding/)

[Information on pricing](https://www.mapbox.com/pricing)
map tiles: 50 000 free page loads (no additional cost for reloading parts of the map when changing viewport)
Geocoding: 100 000 free requests

## [Google](https://developers.google.com/maps/documentation/tile/overview?hl=es-419)

Also offers a [Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview?hl=es-419)

[Pricing completely based on money, with free budget to start with (300\$) and each month (200\$)](https://mapsplatform.google.com/pricing/)

With those 500$ in the first month you could get up to:
map tiles: 833 333 tile requests
OR
Geocoding: 100 000 requests

## [OpenStreetMap](https://www.openstreetmap.org/#map=7/40.007/-2.488)

Via https://tile.openstreetmap.org/{z}/{x}/{y}.png
[Should be fine for us to use for free](https://operations.osmfoundation.org/policies/tiles/)

## [Thunderforest](https://www.thunderforest.com/maps/neighbourhood/)

Allows [150 000](https://www.thunderforest.com/pricing/) tiles requests per month for free

## [Stamen](https://maps.stamen.com/terrain/#11/37.7938/-122.2847)

Couldn’t really locate, how they are provided now, but this [FAQ](https://maps.stamen.com/stadia-partnership/) mentions 200 000 tile requests per month for free.

# JS-Kits for implementation

## Mapbox GL JS

Mapbox uses its own JS library

https://docs.mapbox.com/mapbox-gl-js/guides/

https://docs.mapbox.com/help/tutorials/use-mapbox-gl-js-with-react/

## Leaflet

All other providers should be compatible with Leaflet

https://leafletjs.com/examples/quick-start/

https://strapi.io/blog/how-to-build-an-interactive-map-with-react-leaflet-and-strapi