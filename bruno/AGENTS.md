# Bruno Agent Guidelines: API Test Collections

This guide outlines rules and practices for maintaining and extending the **Bruno API Test Collection** (`bruno/`).

---

## 1. Collection Purpose & Scope

The Bruno collection tests the integration contracts between the email service desk, the Strapi backend, and the customer portal:

* **`01-Inbound-Email-Webhooks/`**: Tests the inbound email parser and webhook controller (`POST /webhooks/inbound-email`). Covers staff update generation, client thread replies, staff thread replies, empty body rejection, and format validation.
* **`02-Portal-REST-API/`**: Tests customer authentication (`POST /api/auth/local`), update message submission (`POST /api/update-messages`), and scoped project retrieval (`GET /api/projects?...`).

---

## 2. Running the Tests

* **Via Headless CLI** (used in CI):
  ```bash
  cd bruno
  npx -y @usebruno/cli run -r --env Local
  ```
* **Via Root Monorepo NPM Script**:
  ```bash
  npm run test:api
  ```
* **Via GUI (Flatpak)**:
  ```bash
  flatpak run com.usebruno.Bruno
  ```
  Open the collection at `houseforce/bruno` and select the **Local** environment.

---

## 3. Authoring Guidelines for New Tests

* **Sequential Execution & Shared State**:
  * Tests run sequentially. Variables captured using `bru.setVar('varName', value)` (e.g. `jwtToken` or `updateId`) persist across subsequent tests in the collection run.
* **Environment Variables**:
  * Store any new static endpoints or test credentials in [`environments/Local.bru`](./environments/Local.bru).
* **CI Compatibility**:
  * Do not hardcode non-localhost domains.
  * In GitHub Actions, Bruno is executed with `--reporter-junit ../bruno-report.xml`. Ensure tests exit with clean status codes.
