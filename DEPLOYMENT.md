# Deploy on one AWS EC2 server with HTTPS

The static site runs in an unprivileged Nginx container. A Caddy container on the same instance accepts public traffic, obtains and renews HTTPS certificates, redirects HTTP to HTTPS, and proxies requests to Nginx. No load balancer or application database is needed. Caddy's named volumes persist certificate keys and configuration; back them up securely and do not delete them during routine updates.

## 1. Prepare DNS and network access

1. Use a public domain or subdomain you control, such as `garage.example.com`. Point its DNS **A record** to the instance's public IPv4 address. An Elastic IP can keep the address stable when the instance is stopped and started. If an AAAA record exists, it must point to a working IPv6 address on this instance; otherwise remove that record.
2. In the EC2 security group, allow inbound TCP **80** and **443** from the internet and TCP **22** only from your trusted administrative IP (or use Systems Manager). Do not allow public access to port 8080. Ensure any host firewall and network ACL also allow 80 and 443, and allow outbound DNS and HTTPS for certificate issuance and renewal.
3. Wait for DNS to propagate. From an external machine, `dig +short A YOUR_DOMAIN` should return the instance's public IPv4 address. Check `dig +short AAAA YOUR_DOMAIN` as well. Ensure no other service on the server is using ports 80 or 443 (`sudo ss -ltnp`).

Caddy requires the public hostname, externally reachable ports 80 and 443, and persistent writable storage to issue a publicly trusted certificate. See [Caddy automatic HTTPS](https://caddyserver.com/docs/automatic-https) and [AWS web server security group rules](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/security-group-rules-reference.html).

## 2. Install Docker and get the source

Connect with your existing SSH method. Install Docker Engine and the Compose plugin using [Docker's Ubuntu instructions](https://docs.docker.com/engine/install/ubuntu/). On the instance used for this project, Docker and the repository are already installed at `~/SMGarage_Website`; update that checkout to a reviewed revision containing this HTTPS configuration. A fresh checkout can be obtained with:

```bash
git clone https://github.com/AliOsmanToklu/SMGarage_Website.git
cd SMGarage_Website
```

Verify the checkout contains `Caddyfile` and `docker-compose.https.yml`. Start Docker and check Compose:

```bash
sudo systemctl enable --now docker
sudo docker compose version
```

## 3. Configure and start HTTPS

From the project directory, preserve any existing `.env` and edit it:

```bash
test -f .env || cp .env.example .env
nano .env
```

Set `SITE_DOMAIN` to the **actual public hostname**, without `http://`, a path, or a port; set `ACME_EMAIL` to a real email address for certificate notices. Replace any example values. Keep `WEB_PORT=8080` unless another local service uses it. An existing `.env` from the previous setup needs the two new settings added:

```dotenv
WEB_PORT=8080
SITE_DOMAIN=garage.example.com
ACME_EMAIL=admin@example.com
```

These are examples, not usable production values. The configuration covers exactly the hostname in `SITE_DOMAIN`; `www` needs its own DNS record and Caddy configuration if it must also work.

Once public DNS and firewall rules are ready, start the combined configuration:

```bash
sudo docker compose -f docker-compose.yml -f docker-compose.https.yml config --quiet
sudo docker compose -f docker-compose.yml -f docker-compose.https.yml up -d --build
sudo docker compose -f docker-compose.yml -f docker-compose.https.yml ps
sudo docker compose -f docker-compose.yml -f docker-compose.https.yml logs --tail=100 caddy
curl -i http://127.0.0.1:8080/healthz
```

The previous Compose service is recreated with its port bound to `127.0.0.1`; Caddy reaches it over the Docker network. Caddy may need a short time to complete certificate validation. It automatically renews certificates while running.

## 4. Verify and maintain

From outside the instance, replace `YOUR_DOMAIN` with your hostname:

```bash
curl -I http://YOUR_DOMAIN/
curl -I https://YOUR_DOMAIN/
curl -i https://YOUR_DOMAIN/healthz
curl -i https://YOUR_DOMAIN/not-a-page
```

Expect an HTTP-to-HTTPS redirect, a valid HTTPS response, `200` and `ok` for health, and `404` for the missing page. Open the site in a browser and test the legal pages and WhatsApp forms. If issuance fails, inspect the Caddy logs and verify public A/AAAA records, security group rules, host firewall, ports in use, and outbound connectivity. Do not repeatedly request production certificates while troubleshooting; certificate authorities enforce rate limits.

For future updates, obtain the reviewed source revision and repeat `sudo docker compose -f docker-compose.yml -f docker-compose.https.yml up -d --build`. Use the same two Compose files for logs and status. `docker compose down` stops containers; **do not add `-v`**, which would delete the certificate storage. Docker's restart policies restore the services after reboot. Monitor certificate renewal and back up the Caddy volumes securely. This single server remains a single point of failure.

Before public launch, complete the business, legal, asset-rights, and accessibility checks in [LEGAL-READINESS.md](LEGAL-READINESS.md).
