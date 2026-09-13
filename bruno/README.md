# Houseforce Email Service Desk & Portal Bruno Collection

This directory contains a complete [Bruno](https://www.usebruno.com/) API testing collection covering the **Inbound Email Webhooks** and **Portal REST APIs**.

---

## Getting Started in Bruno

1. **Launch Bruno** (installed via Flatpak):
   ```bash
   flatpak run com.usebruno.Bruno
   ```
2. In the Bruno home screen, click **"Open Collection"**.
3. Select this folder:
   ```
   /home/serathian/Repositories/houseforce-stack/houseforce/bruno
   ```
4. In the top-right corner of Bruno, switch the active environment to **`Local`**.

---

## Environment Variables (`environments/Local.bru`)

* `baseUrl`: `http://localhost:1337`
* `staffEmail`: `staff@houseforce.com` (change to your active Strapi admin email)
* `clientEmail`: `client@example.com` (registered client email)
* `clientPassword`: `password123`
* `projectId`: `1` (target project ID)
* `updateId`: (Automatically captured when creating an update)
* `jwtToken`: (Automatically captured upon logging in)

---

## Test Suites Included

### `01-Inbound-Email-Webhooks`
* `01-Create-Project-Update-Staff`: Simulates an incoming email to `project-{{projectId}}@replies.houseforce.com`. Verifies 200, creates update, triggers client notifications, and stores `updateId`.
* `02-Reject-NonStaff-Project-Update`: Verifies that unauthorized non-staff senders are rejected with `403 Forbidden`.
* `03-Client-Reply-To-Thread`: Simulates a client replying to `update-{{updateId}}@replies.houseforce.com`. Verifies 200, stripped quotes, and records message.
* `04-Staff-Reply-To-Thread`: Simulates staff replying to `update-{{updateId}}@replies.houseforce.com`.
* `05-Reject-Empty-Body`: Verifies empty bodies are rejected with `400 Bad Request`.
* `06-Reject-Invalid-To-Address`: Verifies invalid recipient addresses are rejected with `400 Bad Request`.

### `02-Portal-REST-API`
* `01-Client-Login`: Authenticates client and extracts `jwtToken`.
* `02-Portal-Post-Update-Message`: Posts a new reply message to `{{updateId}}` via the REST API with Bearer token.
* `03-Get-Project-With-Updates-And-Messages`: Queries project details with nested updates and messages.

---

## Running the Entire Suite

1. Click on the collection name in the left sidebar: **Houseforce Email Service Desk**.
2. Click **Run** at the top.
3. Select the **Local** environment.
4. Click **Run Collection** to execute all HTTP tests and assertions sequentially.
