# Droplet Documentation
The droplet is just a Linux VM hosted by DigitalOcean. The deployment is comprised of 3 major parts.
1. Gunicorn
> Sets up the HTTP server for our Django project
2. Nginx
> The reverse proxy which forwards requests to the droplet to Gunicorn
3. Let's Encrypt
> Allows us to obtain an SSL certificate to secure traffic to our server

<hr></hr>

## Workflow
To update the droplet with the latest changes in the repository, follow the following steps
1. SSH into our droplet
```
ssh root@<ip>
```
  - SSH is protected by keypairs so your RSA public key must be manually added on the digital ocean website
2. cd into the directory of the project
```
cd ~/beatbuster
```
3. pull the latest changes from GitHub
```
git pull origin main
````
4. Restart the Gunicorn procress
```
sudo systemctl restart gunicorn
```
### Gunicorn changes
If the Gunicorn socket or service files are edited, you must restart the daemon and both files
```
sudo systemctl daemon-reload
sudo systemctl restart gunicorn.socket gunicorn.service
```

### Nginx changes
If the Nginx server block is changed you must test the configuration and restart it
```
sudo nginx -t && sudo systemctl restart nginx
```

<hr></hr>

## Gunicorn
The Gunicorn process is comprised of two parts
1. ```gunicorn.service```
2. ```gunicorn.socket```

Both of these files live in ```/etc/systemd/system```

The ```gunicorn.socket``` creates a socket file to make connections to gunicorn itself. It is active in ```/run/gunicorn.sock/``` where it listens for connections. When a connection is made to the socket, systemd automatically starts ```gunicorn.service``` to handle it.

The ```gunicorn.service``` file is what starts the HTTP server itself and runs the project. It specifies where our Django project lives and it runs the project and binds itself to ```/run/gunicorn.sock```.

<hr></hr>

## Nginx
Nginx intercepts requests made to the drople. If valid, it will pass that traffic to the gunicorn process. It also handles serving our projects static files.

The Nginx server block lives at ```/etc/nginx/sites-available/beatbuster.me```. It listens on port 80 (The default HTTP port) for requests made to beatbuster.me and then forwards that request to ```/run/gunicorn.sock```

<hr></hr>




