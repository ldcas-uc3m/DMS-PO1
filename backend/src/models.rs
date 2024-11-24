use mongodb::bson::oid::ObjectId;
use rocket::serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct Sighting {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub source: String,
    pub time_event: u32,  // unix timestamp (s)
    pub time_post: Option<u32>,  // unix timestamp (s)
    pub location_aprox: String,
    pub location_precise: Option<Vec<f64>>,  // [<longitude>, <latitude>]
    pub distance: Option<f64>,  // m
    pub altitude: Option<f64>,  // m
    pub duration: Option<f64>,  // s
    pub shape: Option<String>,
    pub size: Option<String>,
    pub features: Option<String>,
    pub summary: String,
    pub description: String,
    pub explanation: Option<String>,
    pub num_observers: i32,
    pub media: Option<Vec<String>>,
}


#[derive(Debug, Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct AstronomicalEvent {
    #[serde(rename = "_id")]
    pub id: ObjectId,
    pub source: String,
    pub time: u32,  // unix timestamp (s)
    pub distance_nominal: f64,  // au
    pub distance_minimum: Option<f64>,  // au
    pub velocity_relative: f64,
    pub velocity_infinity: f64,
    pub magnitude: f64,
    pub diameter: Vec<f64>,  // [<min>, <max>]
    pub rarity: i32,
}
