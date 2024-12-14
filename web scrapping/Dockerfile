FROM python:3.12.3

WORKDIR /app

COPY src/requirements.txt .

COPY src/log.json ./src/

RUN pip install --no-cache-dir -r requirements.txt

RUN playwright install

RUN playwright install-deps

COPY src/ ./src/

CMD ["python", "src/web_scrapping.py"]