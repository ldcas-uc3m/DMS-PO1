conn = new Mongo();
db = conn.getDB("jose");

db.createCollection("sightings");
db.createCollection("astronomical-events");