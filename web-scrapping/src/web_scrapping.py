import requests
import time
import json
import re
from datetime import datetime
import logging
from playwright.sync_api import sync_playwright

def get_urls(Num,url):
    enlaces = []
    with open("src/log.json", "r") as archive:
        try:
            # Cargamos los datos, si existen
            datos_existentes = json.load(archive)
        except json.JSONDecodeError:
            datos_existentes = {}  # Inicializamos con una lista vacía si hay un error

        with sync_playwright() as p:
            # Iniciamos el navegador
            browser = p.chromium.launch(headless=True)  # headless=True si no necesitas ver el navegador
            page = browser.new_page()
            
            # Navegamos a la página
            page.goto(url)

            i = 0
            # Recorre la tabla obteniendo enlaces hasta llegar a N
            while i < Num:
                try:
                    # Esperamos el diálogo de consentimiento de cookies y hacemos click en el botón de aceptar
                    consent_button = page.locator(".fc-button.fc-cta-consent.fc-primary-button")
                    consent_button.wait_for(state="visible", timeout=5000)
                    consent_button.click()
                    # Esperamos a que el cuadro de consentimiento desaparezca
                    page.wait_for_selector(".fc-dialog", state="detached", timeout=5000)
                except Exception as e:
                    print(f"El diálogo de consentimiento no apareció o ya fue aceptado.")

                # Esperamos a que la tabla esté completamente cargada
                page.wait_for_selector('table')
                
                # Obtenemos todas las filas de la tabla
                filas = page.locator('table tbody tr').all()

                for fila in filas:
                    # Si ya tenemos el numero requerido antes de terminar las filas, salimos
                    if i >= Num:
                        break

                    # Esperamos a que la fila sea clickeable
                    fila.scroll_into_view_if_needed()
                    try:
                        # Intentatamos hacer clic en la fila
                        fila.click()
                        # Esperamos a que la nueva página se cargue
                        page.wait_for_load_state('load')
                        # Obtén la URL de la página a la que se redirige
                        url_destino = {'url': page.url} 
                        
                        urls_existentes = {item["url"] for item in datos_existentes}
                        if url_destino['url'] not in urls_existentes:
                            #Comprobamos si ya tenemos ese dato
                            datos_existentes.append(url_destino)
                            enlaces.append(page.url)
                            i = i + 1
                        
                        else:
                            i = i
                    
                        # Vuelve a la página principal
                        page.go_back()
                        time.sleep(2)
                        page.wait_for_load_state('load')

                    except Exception as e:
                        logging.error(f"Error al hacer clic en la fila: {e}")

                    # Espera para evitar clics rápidos
                    page.wait_for_timeout(500)  # Espera 500ms
                
                # Verifica si hay un botón de "Next" y haz clic para avanzar a la siguiente página    
                try:
                    next_button = page.locator('.pagination-next a')
                    next_button.wait_for(state="visible", timeout=5000)
                    if next_button.is_enabled():
                        next_button.click()
                        # Espera que la página cargue completamente
                        page.wait_for_load_state('networkidle')  # Espera que la página se cargue
                    else:
                        logging.error("No hay más páginas.")
                        break  # Si no hay más páginas, detén el ciclo
                except:
                    logging.error("Error al encontrar o hacer clic en el botón 'Next'.")
                    break  # Detener si no se puede avanzar

            # Cierra el navegador después de obtener todos los enlaces
            browser.close()

    with open("src/log.json", "w") as archive:
        #Guardamos los datos
        json.dump(datos_existentes, archive, indent=4)
        
    return enlaces

def get_data(urls):
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)  # headless=False si quieres ver el navegador
        page = browser.new_page()
        for elem in urls:
            # Navegar a la página
            page.goto(elem)
            # Esperaramos a que el elemento de Detailed Description esté cargado
            page.wait_for_selector('.card-header:has-text("Detailed Description") + .card-body p')
            # Extraer la descripción detallada
            detailed_description_element = page.query_selector('.card-header:has-text("Detailed Description") + .card-body p')
            
            if detailed_description_element:
                detailed_description = detailed_description_element.text_content().strip()
            else:
                logging.error("Detailed Description no encontrado.")

            # Extraer otros datos
            summary = page.text_content('.list-group-item span:has(i.fa-list) + span').strip()
            submitted = page.text_content('.list-group-item:has(span:has-text("Submitted"))').strip()
            occurred = page.text_content('.list-group-item span:has(i.fa-calendar-alt) + span').strip()
            location = page.text_content('.list-group-item:has(span:has-text("Location")) span:last-of-type').strip()
            distance = page.text_content('.list-group-item span:has(i.fa-binoculars) + span').strip()
            altitude = page.text_content('.list-group-item span:has(i.fa-plane-departure) + span').strip()
            shape = page.text_content('.list-group-item span:has(i.fa-shapes) + span').strip()
            features = page.text_content('.list-group-item span:has(i.fa-grip-lines) + span').strip()

            features = features.replace(" ", "")
            features = features.replace(",", ", ")
            distance = re.sub(r'\D','',distance)
            altitude = re.sub(r'\D','',altitude)
            submitted = submitted.replace("Submitted", "")
            submitted = submitted.strip()

            occurred = datetime.strptime(occurred, "%m/%d/%Y %I:%M %p")
            submitted = datetime.strptime(submitted, "%m/%d/%Y %I:%M %p")

            occurred = int(occurred.timestamp())
            submitted = int(submitted.timestamp())

            #Estos ifs son para casos en los que no se dan numeros
            if len(distance) == 0:
                distance = "0"
            
            if len(altitude) == 0:
                altitude = "0"

            # Mostrar los resultados
            data = { "source" : elem,
                    "time_event": occurred,
                    "time_post": submitted,
                    "location_aprox": location,
                    "location_precise": [],
                    "distance": int(distance),
                    "altitude": int(altitude),
                    "shape": shape,
                    "size": "N/A",
                    "features": features,
                    "summary": summary,
                    "description": detailed_description,
                    "explanation": "N/A",
                    "num_observers": 1, #Porque almenos 1 persona ha tenido que observarlo e introducirlo en la página
                    "media": []
            }
            x = requests.post("http://backend:8000/sightings", json = data)
            time.sleep(1)

if __name__ == '__main__':
    
    Num = 15 #Numero de datos por iteracion
    url = "https://ufostalker.com/ufo-sighting-list"
    try:
        while True:
            urls = get_urls(Num,url)
            get_data(urls)
            time.sleep(150) #5 minutos
            logging.info("Let's refill the database!")
    
    except Exception as e:
        logging.error("Error: {}".format(e))
