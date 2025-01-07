# Firebase & Express Boilerplate

This repository contains a boilerplate for creating a secure and scalable Express.js server. It includes features like rate limiting, Firebase token verification, and advanced logging.

---

## **Modules and Dependencies**

### **Core Modules:**
- `express`: Web framework for handling routes and middleware.
- `fs`: File system module for reading files.
- `path`: Utilities for handling and transforming file paths.
- `dotenv`: Loads environment variables from a `.env` file.
- `jsonwebtoken`: For verifying and decoding JSON Web Tokens (JWT).
- `express-rate-limit`: Middleware for limiting repeated requests.

### **Custom Modules:**
- `logs`: Provides advanced logging utilities like `info`, `error`, `success`, `warn`, and `special`.

---

## **Environment Variables**
- `PORT`: Port on which the server listens. Defaults to `80`.
- `ADVANCED_LOGGING`: Enables detailed logging if set to `true`.

---

## **Middleware**

### **1. JSON and URL Encoding**
- `app.use(express.json())`: Parses incoming JSON requests.
- `app.use(express.urlencoded({ extended: true }))`: Parses URL-encoded data.

---

### **2. Rate Limiting**
- **Route Limiter:** Limits general routes to 20 requests per minute.
- **API Limiter:** Limits API endpoints to 10 requests per minute.

---

### **3. Firebase Token Verification**
Authenticates requests using Firebase JSON Web Tokens (JWT).

**Steps:**
1. Checks for `token` in cookies.
2. Decodes the token to extract the `kid` (key ID).
3. Fetches Firebase public keys if not cached or expired.
4. Verifies the token signature and claims using the appropriate public key.

**Errors:**
- Invalid token header.
- Missing or incorrect public key.
- Token verification failure.

---

### **4. Internal Routes Access Control**
- Restricts internal routes to domains listed in `internal/allowlist.json`.
- Responds with a `403 Forbidden` status if the request is unauthorized.

---

## **Folder Structure and Route Handling**

### **1. Routes Directory**
- All files in the `./routes` folder are loaded automatically if they export a valid middleware function.
- Uses `routeLimiter` for rate-limiting.

### **2. Internal Directory**
- Internal routes in `./internal` require hostname validation using the `internalAllowList`.
- These routes are intended for internal usage only.

### **3. API Directory**
- API routes in the `./api` folder are prefixed with `/api`.
- Uses `apiLimiter` for rate-limiting.

---

## **Logging**

### **Log Types:**
- **`info`**: Logs general information in blue.
- **`warn`**: Logs warnings in yellow.
- **`error`**: Logs errors in red.
- **`success`**: Logs success messages in green.
- **`special`**: Logs custom messages in magenta.

### **Advanced Logging:**
- Enabled when `ADVANCED_LOGGING` is set to `true` or if the `--al` argument is passed during server start.
- Logs details such as successfully loaded routes.

---

## **Utility Functions**

### `getCachedFirebasePublicKeys`
**Description:** Fetches and caches Firebase public keys.

**Key Points:**
- Cached keys expire after 24 hours.
- If fetching fails, an error is thrown.

**Usage:**
```javascript
const keys = await getCachedFirebasePublicKeys();
```

---

## **Static File Serving**
- Serves `firebase.js` from the root directory when requested.

**Route:**
```javascript
app.get('/firebase.js', (req, res) => {
    res.setHeader('Content-Type', 'text/javascript').sendFile(path.join(__dirname, 'firebase.js'));
});
```

---

## **Error Handling**
- Unauthorized access to internal routes responds with:
  ```json
  {
    "error": "Forbidden",
    "status": 403
  }
  ```
- Token validation errors redirect to `/resignin` to re-authenticate.

---

## **Starting the Server**

**Command:**
```bash
node index.js
```

**Output:**
- On successful start, logs the following:
  ```
  Server started on port <PORT>
  ```

---

## **Example Environment File (`.env`)**
```env
PORT=3000
ADVANCED_LOGGING=true
```

---

## **Example Allowlist (`internal/allowlist.json`)**
```json
[
    "localhost",
    "127.0.0.1",
    "example.com"
]
```

---

## **Error Scenarios and Responses**

| **Scenario**                 | **Response/Action**                        |
|-------------------------------|--------------------------------------------|
| Missing `internal/allowlist.json` | Throws an error on server startup.       |
| Missing `serviceAccountKey.json` | Throws an error on server startup.       |
| Missing `.env` file           | Defaults to `PORT=80` and `ADVANCED_LOGGING=false`. |
| Unauthorized internal access  | Responds with `403 Forbidden`.            |
| Token verification failure    | Logs the error and redirects to `/resignin`. |
| Missing or invalid route files| Logs an error during route loading.       |