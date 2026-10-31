# AWS deployment

The production image builds the React/Vite site and serves static files with unprivileged Nginx. Forms open WhatsApp in the visitor's browser; there is no application server, database, or server-side form storage. No persistent volume is needed for this stateless service. The only Compose setting is the host port in `.env`. Values used by a Vite app are baked into the build, so rebuild after changing site configuration.

The example below terminates TLS on an AWS Application Load Balancer (ALB). The ALB talks HTTP to Nginx on port 8080 within the VPC; HTTPS is therefore protected up to the ALB, not encrypted on the ALB-to-instance hop. The ALB and ACM certificate incur their respective AWS charges. Use HTTPS to the target too if your threat model requires encryption inside the VPC.

## 1. Provision AWS resources

1. Launch a supported Ubuntu LTS EC2 instance in a VPC with internet access for package and image downloads. Allocate sufficient disk space for builds and enable security updates. Use a key pair for SSH; the examples below use the Ubuntu AMI's `ubuntu` account. For a private instance, use a bastion or Systems Manager instead.
2. Create an internet-facing ALB across at least two availability zones. Give its security group inbound TCP 80 and 443 from the internet. Give the EC2 security group inbound TCP 8080 **only from the ALB security group**, and TCP 22 only from your own trusted IP (or use Systems Manager). Allow the ALB outbound traffic to the instance on TCP 8080. Never expose the instance's application port directly to the internet: it is plain HTTP.
3. Request and validate an ACM certificate for your domain in the same region as the ALB. Create an ALB target group of type **instance**, protocol HTTP, port 8080, health-check path `/healthz`, success code `200`; register the EC2 instance. Create an HTTPS listener on port 443 using the certificate and forward to that target group. Configure the port 80 HTTP listener to redirect to HTTPS. Point the domain's DNS record at the ALB using the appropriate alias or CNAME. If `WEB_PORT` is changed, update the target group port, EC2 security group, and local `curl` command to match.

See [AWS ALB HTTPS listeners](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/create-https-listener.html), [ALB security groups](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-update-security-groups.html), and [target health checks](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html).

## 2. Connect and install Docker

From your computer, connect using the instance's public address (replace the placeholders):

```bash
ssh -i /path/to/key.pem ubuntu@EC2_PUBLIC_IP
```

Install Docker Engine, Buildx, and the Compose plugin using [Docker's official Ubuntu instructions](https://docs.docker.com/engine/install/ubuntu/). On a fresh supported Ubuntu installation, the repository-install steps are:

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
```

```bash
sudo tee /etc/apt/sources.list.d/docker.sources > /dev/null <<EOF
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
sudo docker compose version
```

Docker's documentation covers conflicting existing packages and supported distributions. The commands below use `sudo`; membership in the Docker group grants root-equivalent privileges.

## 3. Transfer and start

Transfer the project to the instance using your authorized Git repository or a secure file copy. The following example archives only the files needed for the build, excluding local `.env` files, Git metadata and `node_modules`. From your computer, replace the source path and connection details:

```bash
cd /path/to/SMGARAGEMASLAK
tar -czf smgarage-deploy.tar.gz Dockerfile docker-compose.yml .dockerignore .env.example nginx index.html package.json package-lock.json vite.config.js public src
scp -i /path/to/key.pem smgarage-deploy.tar.gz ubuntu@EC2_PUBLIC_IP:~/
```

On the instance:

```bash
mkdir -p ~/smgarage
tar -xzf ~/smgarage-deploy.tar.gz -C ~/smgarage
cd ~/smgarage
cp .env.example .env
sudo docker compose up -d --build
sudo docker compose ps
curl -i http://127.0.0.1:8080/healthz
sudo docker compose logs --tail=100 web
```

The health endpoint should return HTTP 200 when Nginx can find the built entry point. It does not verify every asset or external service. Confirm the target is healthy in the AWS console, then open `https://YOUR_DOMAIN/`, inspect the certificate, and test the forms and legal pages. Legal pages use hash routes (for example `/#/gizlilik`); an unknown server path returns the branded 404 page with HTTP status 404. Check this with `curl -i https://YOUR_DOMAIN/not-a-page` and confirm a missing `/assets/` file also returns 404. Avoid adding secrets to the frontend source or `VITE_` variables: compiled browser assets are public.

## 4. Maintain and update

Back up the source and deployment configuration; there is no application data in the container. Apply OS and Docker security updates, rebuild regularly to pick up updated base-image security fixes, and monitor ALB target health and container logs. Use immutable image digests and a registry/CI pipeline for controlled releases when available. This single EC2 instance remains a single point of failure; add tested redundancy if uptime requires it. AWS documents that an ALB can route to unhealthy targets when all registered targets are unhealthy, so health checks alone are not an outage response; configure monitoring and alerts as well.

For an update, transfer the reviewed source, then run `sudo docker compose up -d --build` and repeat the health and HTTPS checks above. Keep the previous source revision or tagged image available for rollback. `sudo docker compose down` stops the service; startup after a host reboot is provided by Docker's enabled service and the container restart policy.
