# J.O.S.E. backend
Backend en Rust, usando el _framework_ [Rocket](https://rocket.rs), y conectado a MongoDB.

Se levanta el servicio en `localhost:8000`.


## Rutas
Siguen el protocolo REST.

### `GET` `/sightings`
Devuelve:
- `200`: Lista de avistamientos ([`Sighting`](#sighting))


### `GET` `/sightings/<id>`
Devuelve:
- `200`: `{"status": "success", "data": <data>`
    - `<data>`: Datos del avistamiento ([`Sighting`](#sighting)) asociado al `<id>`

### `POST` `/sightings`
Body: [`Sighting`](#sighting)  
Devuelve:
- `201`: `{"status": "success", "message" <id>}`
    - `<id>`: ID del avistamiento creado
- `400`: `{"status": "error", "message": "Sighting could not be created"}`

### `GET` `/events`
Devuelve:
- `200`: Lista de evento ([`AstronomicalEvent`](#astronomicalevent))


### `GET` `/events/<id>`
Devuelve:
- `200`: `{"status": "success", "data": <data>`
    - `<data>`: Datos del evento ([`AstronomicalEvent`](#astronomicalevent)) asociado al `<id>`

### `POST` `/events`
Body: [`AstronomicalEvent`](#astronomicalevent)  
Devuelve:
- `201`: `{"status": "success", "message" <id>}`
    - `<id>`: ID del evento creado
- `400`: `{"status": "error", "message": "Event could not be created"}`




## Objetos
Al ser REST, todos los objetos vienen serializados en formato JSON.

### `Sighting`
Avistamiento.

Atributos:
- `source` (string): fuente de los datos del avistamiento
- `time_event` (number): fecha y hora del avistamiento (formato Unix Timestamp - s)
- `time_post` (number) [opcional]: fecha y hora del reporte del avistamiento (formato Unix Timestamp - s)
- `location_aprox` (string): localización aproximada del avistamiento (ciudad, etc.)
- `location_precise` (array[number]) [opcional]: longitud y latitud del avistamiento (`[<longitud>, <latitud>]`)
- `distance` (number) [opcional]: distancia desde el avistamiento al objeto (metros)
- `altitude` (number) [opcional]: altitud del objeto (metros)
- `shape` (string) [opcional]: forma del objeto
- `size` (string) [opcional]: tamaño del objeto
- `features` (string) [opcional]: características del objeto
- `summary` (string): resumen del avistamiento
- `description` (string): descripción del suceso
- `explanation` (string) [opcional]: explicación del suceso
- `num_observers` (number): número de observadores del suceso
- `media` (array[string]) [opcional]: links a recursos (grabaciones, audios, etc.)


### `AstronomicalEvent`
Evento astronómico.

Atributos:
- `source` (string): fuente de los datos del avistamiento
- `time` (number): fecha y hora del evento (formato Unix Timestamp - s)
- `distance_nominal` (number): distancia nominal entre el objeto y la tierra (AU)
- `distance_minimum` (number) [opcional]: distancia mínima entre el objeto y la tierra (AU)
- `velocity_relative` (number): velocidad a su paso por la tierra (kps)
- `velocity_infinity` (number) [opcional]: velocidad a su paso por la tierra (kps)
- `magnitude` (number): magnitud del objeto
- `diameter` (array[number]): diámetros mínimo y máximo del objeto `[<min>, <max>]` (m)
- `rarity` (number) [opcional]: rareza del objeto (`0`-`3`)


## More information
- [Writing an API With MongoDB in Rust](https://www.mongodb.com/developer/languages/rust/rest-api-rust-rocket/)
- [How to Containerize a Rust Web Server with MongoDB](https://www.bretcameron.com/blog/containerize-rust-web-server-with-mongodb)
- [Deploying - Rocket Web Framework](https://rocket.rs/guide/v0.5/deploying/)
