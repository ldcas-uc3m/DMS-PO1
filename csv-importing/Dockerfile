FROM python:3.12.3

WORKDIR /app

COPY src/requirements.txt .

COPY src/events.json ./src/

RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/

ENV PYTHONUNBUFFERED=1  

CMD ["python", "src/csv_importing.py"]