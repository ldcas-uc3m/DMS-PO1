docker build -t api_importing .

docker run -it --rm api_importing

docker rmi api_importing