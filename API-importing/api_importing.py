import requests
import json
from datetime import datetime


# Function to convert UTC time to Unix timestamp
def utc_month_HM_to_unix(utc_string):
    try:
        dt = datetime.strptime(utc_string, '%Y-%b-%d %H:%M')
        return int(dt.timestamp())
    except Exception as e:
        print(f"Error converting time {utc_string}: {e}")
        return None

# Vaciar JSON de eventos
def json_empty(json_file='events.json'):
    with open(json_file, 'w') as f:
        json.dump([], f, indent=4)

# Guardar eventos como archivo JSON
def json_save(events, json_file='events.json'):
    with open(json_file, 'w') as f:
        json.dump(events, f, indent=4)

# Leer eventos desde archivo JSON
def json_read(json_file = 'events.json'):
    print("Cargar los datos JSON desde el archivo")
    with open(json_file, 'r') as f:
        data = json.load(f)
    return data

# Postear eventos desde archivo JSON
def json_post(data, URL_DATABASE):
    print("Posteando a base de datos desde el JSON")
    for event in data:
        response = requests.post(URL_DATABASE, json=event)
        # print(response.json())


# Function to fetch CAD data from NASA API for the year 1975
def fetch_nasa_data_2025(nasa_api_file='nasa_CA_data_2025.json'):
    url = "https://ssd-api.jpl.nasa.gov/cad.api?date-min=2025-01-01&date-max=2026-01-01&dist-max=0.01"
    response = requests.get(url)
    if response.status_code == 200:
        json_save(response.json(), nasa_api_file)
        return response.json()
    else:
        print(f"Failed to fetch data: {response.status_code}")
        return None

# Function to process the data from the API
def process_nasa_data(data, events_file='events.json'):
    events = []

    for item in data['data']:
        # Extract the required data fields and handle optional/nullable fields
        object_name = item[0]  # 'des' -> object name
        time = utc_month_HM_to_unix(item[3])  # 'cd' -> time (UTC format to Unix timestamp)

        # Convert numerical fields
        distance_nominal = float(item[4]) if item[4] else None  # 'dist' -> distance nominal
        distance_minimum = float(item[5]) if item[5] else None  # 'dist_min' -> distance minimum
        distance_maximum = float(item[6]) if item[6] else None  # 'dist_max' -> distance maximum
        velocity_relative = float(item[7]) if item[7] else None  # 'v_rel' -> relative velocity
        velocity_infinity = float(item[8]) if item[8] else None  # 'v_inf' -> infinite velocity
        magnitude = float(item[10]) if item[10] else None  # 'h' -> magnitude

        # print(row)
        event = {
            "object_name": object_name,
            "data_source": "NASA CA API - 2025",  # Provided in the response
            "time": time,
            "location_aprox": None,  # Not provided in the response
            "location_precise": None,  # Not provided in the response
            "distance_nominal": distance_nominal,  # Can be converted into None, not vital info
            "distance_minimum": distance_minimum,  # Can be converted into None, not vital info
            "velocity_relative": velocity_relative,  # Can be converted into None, not vital info
            "velocity_infinity": velocity_infinity,  # Can be converted into None, not vital info
            "magnitude": magnitude,  # Can be converted into None, not vital info
            "diameter": None,  # No diameter data in the current response
            "rarity": None  # No rarity data in the current response
        }
        # print(event)
        events.append(event)
    print(events)

    # Guardar como archivo JSON
    json_save(events, json_file=events_file)

    return events

'''SOURCE DATA STRUCTURES'''
# output fields:
# 0         "des",  # primary designation of the asteroid or comet (e.g., 443, 2000 SG344)
# 1         "orbit_id",  # orbit ID used for the close-approach computation
# 2         "jd",  # jd - time of close-approach (JD Ephemeris Time, TDB)
# 3         "cd",  # cd - time of close-approach (formatted calendar date/time, TDB)
# 4         "dist",  # nominal approach distance (au)
# 5         "dist_min",  # minimum (3-sigma) approach distance (au)
# 6         "dist_max",  # maximum (3-sigma) approach distance (au)
# 7         "v_rel",  # velocity relative to the approach body at close approach (km/s)
# 8         "v_inf",  # velocity relative to a massless body (km/s)
# 9         "t_sigma_f",  # 3-sigma uncertainty in the time of close-approach (formatted in days, hours, and minutes; days are not included if zero; example “13:02” is 13 hours 2 minutes; example “2_09:08” is 2 days 9 hours 8 minutes)
# 10         "h"  # Magnitude
# output values example
# 0             "2012 PB20",
# 1             "20",
# 2             "2460716.401150847",
# 3             "2025-Feb-09 21:38",
# 4             "0.00892436699531785",
# 5             "0.00892337752404436",
# 6             "0.00892535648043024",
# 7             "4.26167089958735",
# 8             "4.1910278334524",
# 9             "< 00:01",
# 10             "24.90"

# DATABASE VALUES
'''pub id: Option<ObjectId>,
    pub object_name: Option<String>,
    pub data_source: String,
    pub time: u32,  // unix timestamp (s)
    pub location_aprox: Option<String>,
    pub location_precise: Option<Vec<f64>>,  // [<longitude>, <latitude>]
    pub distance_nominal: Option<f64>,  // au
    pub distance_minimum: Option<f64>,  // au
    pub velocity_relative: Option<f64>,  // kps
    pub velocity_infinity: Option<f64>,  // kps
    pub magnitude: Option<f64>,
    pub diameter: Option<Vec<f64>>,  // [<min>, <max>] (m)
    pub rarity: Option<i32>,
'''


# Run the main function
if __name__ == "__main__":
    # Fetch data from NASA API
    data = fetch_nasa_data_2025('nasa_CA_data_2025.json')
    if data:
        # Process the data into the required format
        processed_data = process_nasa_data(data, 'events.json')
        print("Data saved to events.json file")
    else:
        print("No data to process")