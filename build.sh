# Build docker image
sudo docker build -t cas-dashboard .

# Run docker container
sudo docker run -d --name cas-dashboard -p 80:80 cas-dashboard