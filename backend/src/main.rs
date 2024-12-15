mod db;
mod models;
mod routes;

use rocket::{launch, routes};
use rocket_db_pools::Database;
use rocket_cors::{AllowedOrigins, CorsOptions};
use rocket::http::Method;

#[launch]
fn rocket() -> _ {

    let cors = CorsOptions {
        allowed_origins: AllowedOrigins::all(),
        allowed_methods: vec![Method::Get, Method::Post, Method::Put, Method::Delete, Method::Patch, Method::Options]
            .into_iter()
            .map(From::from)
            .collect(),
        allowed_headers: rocket_cors::AllowedHeaders::All,
        ..Default::default()
    }
    .to_cors()
    .unwrap();

    rocket::build()
    .attach(db::MainDatabase::init())
    .attach(cors)
    .manage("pk.eyJ1IjoidGlrb2ViZWxlIiwiYSI6ImNtNDhyZzJ6NTAybXMya3NoYTJ1aTVyenYifQ.7CxZ4iDKD2kRgWYr6Fta0w".to_string())
    .mount(
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