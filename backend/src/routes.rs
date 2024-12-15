use crate::{db::MainDatabase, models::{AstronomicalEvent, Sighting}};
use mongodb::bson::doc;
use mongodb::bson::oid::ObjectId;
use rocket::{
    futures::TryStreamExt, get, http::Status, post, response::status,
    serde::json::Json,
};
use rocket_db_pools::Connection;
use serde_json::{json, Value};
use std::error::Error;
use reqwest::Client;


#[get("/")]
pub fn index() -> Json<Value> {
    Json(json!({"status": "Welcome to J.O.S.E."}))
}


// sightings

#[get("/sightings", format = "json")]
pub async fn get_sightings(db: Connection<MainDatabase>) -> Json<Vec<Sighting>> {
    let sightings = db
        .database("jose")
        .collection("sightings")
        .find(None, None)
        .await;

    if let Ok(r) = sightings {
        if let Ok(collected) = r.try_collect::<Vec<Sighting>>().await {
            return Json(collected);
        }
    }

    return Json(vec![]);
}

#[get("/sightings/<id>", format = "json")]
pub async fn get_sighting(db: Connection<MainDatabase>, id: &str) -> status::Custom<Json<Value>> {
    let b_id = ObjectId::parse_str(id);

    if b_id.is_err() {
        return status::Custom(
            Status::BadRequest,
            Json(json!({"status": "error", "message":"Sighting ID is invalid"})),
        );
    }

    if let Ok(Some(sighting)) = db
        .database("jose")
        .collection::<Sighting>("sightings")
        .find_one(doc! {"_id": b_id.unwrap()}, None)
        .await
    {
        return status::Custom(
            Status::Ok,
            Json(json!({"status": "success", "data": sighting})),
        );
    }

    return status::Custom(
        Status::NotFound,
        Json(json!({"status": "error", "message": "Sighting not found"})),
    );
}

async fn get_coordinates_from_mapbox(location: &Option<String>, api_key: &str) -> Result<Option<Vec<f64>>, Box<dyn Error>> {
    let location_str = location.as_ref().unwrap_or(&String::from("")).to_string();

    if location_str.is_empty() {
        return Ok(None);
    }

    let url = format!(
        "https://api.mapbox.com/geocoding/v5/mapbox.places/{}.json?access_token={}",
        location_str, api_key
    );

    let client = Client::new();
    let res = client.get(&url).send().await?;

    if res.status().is_success() {
        let body: Value = res.json().await?;
        if let Some(features) = body["features"].as_array() {
            if let Some(first_feature) = features.get(0) {
                if let Some(center) = first_feature["center"].as_array() {
                    let latitude = center.get(1).and_then(|v| v.as_f64()).unwrap_or_default();
                    let longitude = center.get(0).and_then(|v| v.as_f64()).unwrap_or_default();
                    return Ok(Some(vec![longitude, latitude]));
                }
            }
        }
    }

    Ok(None)
}

async fn precise_location(data: Sighting, api_key: &str) -> Result<Sighting, Box<dyn Error>> {
    if let Some(location) = get_coordinates_from_mapbox(&data.location_aprox, api_key).await? {
        let transformed_data = Sighting {
            location_precise: Some(location),
            ..data
        };
        Ok(transformed_data)
    } else {
        Ok(data)
    }
}

#[post("/sightings", data = "<data>", format = "json")]
pub async fn add_sighting(
    db: Connection<MainDatabase>,
    data: Json<Sighting>,
    api_key: &rocket::State<String>,
) -> status::Custom<Json<Value>> {

    let transformed_data = match precise_location(data.clone().into_inner(), api_key.inner()).await {
        Ok(transformed) => transformed,
        Err(_) => {
            data.into_inner()
        }
    };

    if let Ok(res) = db
        .database("jose")
        .collection::<Sighting>("sightings")
        .insert_one(transformed_data, None)
        .await
    {
        if let Some(id) = res.inserted_id.as_object_id() {
            return status::Custom(
                Status::Created,
                Json(
                    json!({"status": "success", "message": id.to_string()}),
                ),
            );
        }
    }

    status::Custom(
        Status::BadRequest,
        Json(json!({"status": "error", "message": "Sighting could not be created"})),
    )
}


// events

#[get("/events", format = "json")]
pub async fn get_events(db: Connection<MainDatabase>) -> Json<Vec<AstronomicalEvent>> {
    let events = db
        .database("jose")
        .collection("astronomical-events")
        .find(None, None)
        .await;

    if let Ok(r) = events {
        if let Ok(collected) = r.try_collect::<Vec<AstronomicalEvent>>().await {
            return Json(collected);
        }
    }

    return Json(vec![]);
}

#[get("/events/<id>", format = "json")]
pub async fn get_event(db: Connection<MainDatabase>, id: &str) -> status::Custom<Json<Value>> {
    let b_id = ObjectId::parse_str(id);

    if b_id.is_err() {
        return status::Custom(
            Status::BadRequest,
            Json(json!({"status": "error", "message": "Event ID is invalid"})),
        );
    }

    if let Ok(Some(event)) = db
        .database("jose")
        .collection::<AstronomicalEvent>("astronomical-events")
        .find_one(doc! {"_id": b_id.unwrap()}, None)
        .await
    {
        return status::Custom(
            Status::Ok,
            Json(json!({"status": "success", "data": event})),
        );
    }

    return status::Custom(
        Status::NotFound,
        Json(json!({"status": "error", "message": "Sighting not found"})),
    );
}


#[post("/events", data = "<data>", format = "json")]
pub async fn add_event(
    db: Connection<MainDatabase>,
    data: Json<AstronomicalEvent>,
) -> status::Custom<Json<Value>> {
    if let Ok(res) = db
        .database("jose")
        .collection::<AstronomicalEvent>("astronomical-events")
        .insert_one(data.into_inner(), None)
        .await
    {
        if let Some(id) = res.inserted_id.as_object_id() {
            return status::Custom(
                Status::Created,
                Json(
                    json!({"status": "success", "message": id.to_string()}),
                ),
            );
        }
    }

    status::Custom(
        Status::BadRequest,
        Json(json!({"status": "error", "message": "Event could not be created"})),
    )
}
