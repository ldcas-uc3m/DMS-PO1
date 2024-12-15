docker build -t csv_importing .

docker run -it --rm csv_importing

docker rmi csv_importing