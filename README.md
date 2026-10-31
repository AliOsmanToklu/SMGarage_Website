# SM Garage Maslak

A Turkish-language website presenting SM Garage's ECU software and mechanical repair services. Visitors can explore services, read frequently asked questions, and prepare appointment or information requests through WhatsApp.

## Features

- Responsive service pages, keyboard-accessible navigation, forms, and an appointment dialog.
- Draft privacy, terms, cookie, and cancellation and refund policy pages.
- A disclosure about data transfer before opening WhatsApp.
- Static hosting with Docker, a health endpoint, and a custom 404 page.
- GitHub Actions checks for the production build, dependency audit, and container behavior.

Forms do not submit data to an application server. The browser prepares a WhatsApp message, which the visitor chooses whether to send in WhatsApp. The project has no application server, database, or online payment system.

## Technology

Built with React, Vite, and CSS. A multi-stage Docker image serves the production build with unprivileged Nginx.

## Local development

Requirements: Node.js 24 and npm.

```bash
npm ci
npm run dev
```

The development server URL appears in the terminal. To build and preview the production site:

```bash
npm run build
npm run preview
```

## Run with Docker

Install Docker Engine and the Docker Compose plugin, then run:

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
curl http://localhost:8080/healthz
```

The site is available at `http://localhost:8080` by default. Change the host port with `WEB_PORT` in `.env`. Run `docker compose down` to stop the service. The application is stateless and does not require a data volume.

See the [deployment guide](DEPLOYMENT.md) for AWS EC2, Application Load Balancer, and HTTPS setup. In production, follow the guide's network and TLS configuration instead of exposing the HTTP port directly.

## Project structure

| Path | Contents |
| --- | --- |
| `src/components/` | Page sections, forms, and interface components |
| `src/data.jsx` | Service and FAQ content |
| `src/config.js` | Contact details and WhatsApp links |
| `src/components/LegalPage.jsx` | Draft legal pages |
| `public/` | Logo and static 404 page |
| `nginx/` | Production server configuration |
| `.github/` | CI workflow and Dependabot configuration |

Contact and content changes are included in the production build. Rebuild the image after changing them.

## Before launch

The legal pages are drafts. Verify the business name and contact details, personal data processing and transfer arrangements, cancellation and refund practices, and rights to the logo. Have qualified legal counsel review the policies. See [LEGAL-READINESS.md](LEGAL-READINESS.md) for outstanding items and sources. Comprehensive user and assistive technology testing is also needed to assess accessibility.
