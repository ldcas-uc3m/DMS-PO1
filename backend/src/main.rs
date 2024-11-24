mod db;
mod models;
mod routes;

use rocket::{launch, routes};
use rocket_db_pools::Database;

#[launch]
fn rocket() -> _ {
    rocket::build().attach(db::MainDatabase::init()).mount(
        "/",
        routes![
            routes::index,
            routes::get_sightings,
            routes::add_sighting,
            routes::get_sighting,
            routes::get_events,
            routes::add_event,
            routes::get_event,
        ],
    )
}