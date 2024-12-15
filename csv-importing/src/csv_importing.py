import pandas as pd
import json
from datetime import datetime
import time
import requests
import logging
from math import isnan

# Función para convertir fecha y hora de datetime UTC a timestamp Unix
def utc_HM_to_unix(utc_string):
    # print("starting utc_to_unix")
    #Correct errors if time not 60.
    if ':60' in utc_string:
        utc_string = utc_string.replace(':60', ':59')
    dt = datetime.strptime(utc_string, '%Y-%m-%d %H:%M')
    # print("finished utc_to_unix")
    return int(dt.timestamp())

# Función para convertir fecha y hora de datetime UTC a timestamp Unix
def utc_HMS_to_unix(utc_string):
    # print("starting utc_to_unix")
    #Correct errors if time not 60.
    if ':60' in utc_string:
        utc_string = utc_string.replace(':60', ':59')
    dt = datetime.strptime(utc_string, '%Y-%m-%d %H:%M:%S')
    # print("finished utc_to_unix")
    return int(dt.timestamp())

# Función para convertir fecha y hora a timestamp Unix, ignorando la incertidumbre
def utc_to_unix_remove_uncertainty(utc_string):
    utc_string = utc_string.split('±')[0].strip()  # Ignorar la parte ±
    dt = datetime.strptime(utc_string, '%Y-%b-%d %H:%M')
    #print(dt)
    new_time = 0
    if dt >= datetime(1970, 1, 1):
        new_time=int(dt.timestamp())
    #print("returning time "+str(new_time))
    return new_time

# Función para convertir un year a un timestamp Unix
def year_to_unix_timestamp(year):
    try:
        year = int(year)
        # Comprobar que el año es válido (mayo/igual a 1970)
        if year <= 1970:
            return 0  # Timestamp UNIX más antiguo
        elif year > 1970:
            return datetime(year, 1, 1).timestamp()  # Timestamp UNIX para 1 Enero 2024 00:00:00
    except Exception as e:
        print(f"Error procesando el año {year}: {e}")
        return None

# Función para convertir el diámetro al formato de vector usado por la base de datos (ejemplo: "22 - 50*" se convierte en [22.0, 50.0])
def process_diameter_ESA(diameter_str):
    # Eliminar el asterisco y dividir por el rango
    diameter_str = diameter_str.replace('*', '')
    diameters = [float(x) for x in diameter_str.split(' - ')]
    return diameters

# Función corregida para procesar el diámetro (ejemplo: "22 m - 49 m" o "730 m - 1.6 km")
def process_diameter_NASA(diameter_str):
    # Check if the string contains the '±' symbol for uncertainty
    if '±' in diameter_str:
        # print("Handling uncertainty case")
        base_value, uncertainty = diameter_str.strip().split('±') # Remove spaces around the uncertainty
        if 'km' in base_value:
            base_value = float(base_value.replace('km',''))*1000  # Convert to meters
        else:
            base_value = float(base_value.replace('m',''))
        if 'km' in uncertainty:
            uncertainty = float(uncertainty.replace('km',''))*1000  # Convert to meters
        else:
            uncertainty = float(uncertainty.replace('m', ''))

        # Calculate the lower and upper bounds (in meters)
        lower_bound = base_value - uncertainty
        upper_bound = base_value + uncertainty
        return [lower_bound, upper_bound]

    else:
        # Regular function for a range of meters or kilometers
        # print("processing normal diameter")
        ranges = diameter_str.split(' - ')
        # print("diameter split")
        diameters = []
        for d in ranges:
            d = d.strip()
            if 'km' in d:  # Si es en km, convertir a metros
                d = d.replace('km', '').strip()  # Eliminar "km" y convertir
                diameters.append(float(d) * 1000)
            elif 'm' in d:  # Si es en metros, dejarlo tal cual
                d = d.replace('m', '').strip()  # Eliminar "m"
                diameters.append(float(d))
        # print("diameter completed")
        return diameters

# Función para convertir la latitud y longitud de formato "30.0N" a valor numérico
def convert_coordinate_to_numbers(coordinate):
    #print("converting coordinates")
    if not issubclass(type(coordinate), str):
        return None
    # Convertir latitude o longitude quitando letra del final y transformando valores sur o oeste a negativos.
    value = float(coordinate[:-1])
    direction = coordinate[-1].upper()
    if direction == 'S' or direction == 'W':
        value = -value
    return value

# Función para convertir las coordenadas de texto "(coord1, coord2)" a una lista de flotantes [float1, float2]
def parse_geolocation_meteorite(geo_str):
    if geo_str:
        # Limpiar los paréntesis y separar las coordenadas
        geo_str = geo_str.strip("()")
        lat, lon = geo_str.split(", ")
        return [float(lat), float(lon)]
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

def json_post(data, URL_DATABASE):
    print("Posteando a base de datos desde el JSON")
    for event in data:
        response = requests.post(URL_DATABASE, json=event)
        # print(response.json())


# PROCESADO DE ARCHIVOS PARA CONVERTIRLOS A JSON ACEPTADO POR DATABASE
def process_csv_ESA_CA(file_path):
    # Read the CSV and convert it into a dataframe
    df = pd.read_csv("src/" + file_path)

    # From the dataframe, read each row (an event), and convert it into the format required by the database. 
    events = []
    print("reading ESA CA")
    for index, row in df.iterrows():
        #print(row)
        event = {
            # For each attribute of the database object, we convert it to the appropiate format
            "object_name": row["Object designation"],
            "data_source": "ESA CA",
            "time": utc_HM_to_unix(row["Close approach date in UTC"]),
            "location_aprox": None,  # No está en el CSV
            "location_precise": None,  # No está en el CSV
            "altitude": None,  # No está en el CSV
            "distance_nominal": float(row["Miss distance in au"]),
            "distance_minimum": None,  # No está en el CSV
            "velocity_relative": float(row["Relative velocity in km/s"]),
            "velocity_infinity": None,  # No está en el CSV
            "magnitude": float(row["H in mag"]),
            "diameter": process_diameter_ESA(row["Diameter in m"]),
            "rarity": int(row["CAI Index"]) if not pd.isna(row["CAI Index"]) else None
        }
        # print(event)
        events.append(event)
    print(events)

    # Guardar como archivo JSON
    json_save(events, json_file='events.json')

    return events

def clean_event(event):
    return {k: v for k, v in event.items() if not (isinstance(v, float) and isnan(v))}

def process_csv_NASA_CA(file_path):
    # Read the CSV and convert it into a dataframe 
    df = pd.read_csv("src/" + file_path)

    # From the dataframe, read each row (an event), and convert it into the format required by the database. 
    events = []
    print("reading NASA CA")
    for index, row in df.iterrows():
        #print(row)
        event = {
            # For each attribute of the database object, we convert it to the appropiate format
            "object_name": row["Object"],
            "data_source": "NASA CA",
            "time": utc_to_unix_remove_uncertainty(row["Close-Approach (CA) Date"]),
            "location_aprox": None,  # No está en el CSV
            "location_precise": None,  # No está en el CSV
            "altitude": None,  # No está en el CSV
            "distance_nominal": float(row.get("CA DistanceNominal (au)", 0) or 0),
            "distance_minimum": float(row.get("CA DistanceMinimum (au)", 0) or 0),
            "velocity_relative": float(row.get("V relative(km/s)", 0) or 0),
            "velocity_infinity": float(row.get("V infinity(km/s)", 0) or 0),
            "magnitude": float(row.get("H(mag)", 0) or 0),
            "diameter": process_diameter_NASA(row["Diameter"]),
            "rarity": int(row["Rarity"]) if not pd.isna(row["Rarity"]) else None
        }
        #print(event)
        events.append(event)
    print(events)

    events = [clean_event(event) for event in events]

    # Guardar como archivo JSON
    json_save(events, json_file='events.json')

    return events

def process_csv_NASA_CA_Fireball(file_path):
    # Read the CSV and convert it into a dataframe
    df = pd.read_csv("src/" + file_path)
    # From the dataframe, read each row (an event), and convert it into the format required by the database.
    events = []
    print("reading NASA CA fireball")
    for index, row in df.iterrows():
        latitude = convert_coordinate_to_numbers(row["Latitude (deg.)"])
        longitude = convert_coordinate_to_numbers(row["Longitude (deg.)"])
        altitude_km = float(row["Altitude (km)"])
        distance_AU = float(altitude_km/149597871)  # Convertir de kilómetros (original) a AU (base de datos). 1 AU = 149597870700 metros
        velocity = float(row["Velocity (km/s)"])
        # print("pre-conversions for event completed")

        # For each attribute of the database object, we convert it to the appropiate format
        if latitude and longitude != None:
            #print(row)
            event = {
                "object_name": None,  # No está en el CSV
                "data_source": "NASA CA Fireball",
                "time": utc_HMS_to_unix(row["Peak Brightness Date/Time (UT)"]),
                "location_aprox": None,  # No está en el CSV
                "location_precise": [longitude, latitude],  # Convertir dos columnas en un vector para base de datos
                "altitude": altitude_km*1000,  # Convertir de kilómetros (original) a metros (base de datos)
                "distance_nominal": distance_AU,
                "distance_minimum": distance_AU,
                "velocity_relative": velocity,
                "velocity_infinity": velocity,
                "magnitude": None,  # No está en el CSV
                "diameter": None,  # No está en el CSV
                "rarity": None,  # No está en el CSV
            }
            #print(event)
            events.append(event)
    print(events)

    events = [clean_event(event) for event in events]

    # Guardar como archivo JSON
    json_save(events, json_file='events.json')

    return events

def process_csv_NASA_CA_Meteorite(file_path):
    # Read the CSV and convert it into a dataframe 
    df = pd.read_csv("src/" + file_path)

    # From the dataframe, read each row (an event), and convert it into the format required by the database. 
    events = []
    print("reading NASA CA meteorite")
    for index, row in df.iterrows():
        # For each attribute of the database object, we convert it to the appropiate format    
        location_name = row["name"]
        event_year = row["year"]
        latitude = float(row["reclat"])
        longitude = float(row["reclong"])

        if latitude and longitude != None:
            #print(row)
            event = {
                "object_name": str(row["name"])+str(row["year"])+str(row["recclass"]),  # Crear nombre a partir del nombre del lugar + año del meteorito + tipo de meteorito
                "data_source": "NASA CA Meteorites",
                "time": year_to_unix_timestamp(row["year"]),  # row["year"] is a float.
                "location_aprox": row["name"],
                "location_precise": [longitude, latitude],  # Convertir dos columnas en un vector para base de datos
                "altitude": float(0),  # No está en el CSV
                "distance_nominal": float(0),  # No está en el CSV
                "distance_minimum": float(0),  # No está en el CSV
                "velocity_relative": None,  # No está en el CSV
                "velocity_infinity": None,  # No está en el CSV
                "magnitude": None,  # No está en el CSV
                "diameter": None,  # No está en el CSV
                "rarity": None,  # No está en el CSV
            }
            #print(event)
            events.append(event)
    print(events)

    events = [clean_event(event) for event in events]

    # Guardar como archivo JSON
    json_save(events, json_file='events.json')

    return events


# FORMATO DE DATABASE y CSV
# Astronomic events database format
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
# ESA CA
'''
"Object designation",
"Close approach date in UTC",


"Miss distance in km","Miss distance in au","Miss distance in LD",
"Diameter in m",
"H in mag","Maximum brightness in mag",
"Relative velocity in km/s",
"CAI Index"
'''
# NASA CA
'''
"Object",
"Close-Approach (CA) Date",


"CA DistanceNominal (au)",
"CA DistanceMinimum (au)",
"V relative(km/s)",
"V infinity(km/s)",
"H(mag)",
"Diameter",
"Rarity"
'''
# NASA CA Fireball
'''

"Peak Brightness Date/Time (UT)",


"Latitude (deg.)","Longitude (deg.)","Altitude (km)",
"Velocity (km/s)","vx","vy","vz",
"Total Radiated Energy (J)","Calculated Total Impact Energy (kt)"
'''
# NASA CA Meteorites
'''
name,  // name of the location
id,  // id of the meteorite within some database
nametype,  // boolean, name valid or invalid (all valid)
recclass,  // type of meteorite (composition, usually)
mass (g),
fall,  // did it fall into the earth? (usually "Fell")
year,  // year of the event 
reclat,reclong,  // latitude and longitude 
GeoLocation  // latitude and longitude as geolocation "(latitude, longitude)"
'''


# MAIN CODE EXECUTION

if __name__ == '__main__':
    
    URL_DATABASE= "http://backend:8000/events"
    events_dir = 'events.json'

    #Empty old data, avoid overloading JSON
    json_empty()

    try:
        while True:
            print("START CSV IMPORTER")
            events_ESA_CA_recent = process_csv_ESA_CA("ESA_recent_CA.csv")
            data = json_read()
            json_post(data, URL_DATABASE)
            print("1st db done")
            time.sleep(2)

            events_ESA_CA_upcoming = process_csv_ESA_CA("ESA_upcoming_CA.csv")
            data = json_read()
            json_post(data, URL_DATABASE)
            print("2nd db done")
            time.sleep(2)

            events_NASA_CA = process_csv_NASA_CA("NASA_CA.csv")
            data = json_read()
            json_post(data, URL_DATABASE)
            print("3rd db done")
            time.sleep(2)

            events_NASA_CA_Fireball = process_csv_NASA_CA_Fireball("NASA_CA_fireball.csv")
            data = json_read()
            json_post(data, URL_DATABASE)
            print("4th db done")
            time.sleep(2)

            events_NASA_CA_Meteorite_mini = process_csv_NASA_CA_Meteorite("NASA_CA_Meteorite_mini.csv")
            data = json_read()
            json_post(data, URL_DATABASE)
            print("5th db done")
            time.sleep(2)
            print("END CSV IMPORTER")

            #print("Emptying JSON")
            #json_empty()

            time.sleep(21600)  # 6h sleep time

    except Exception as e:
        logging.error("Error: {}".format(e))
