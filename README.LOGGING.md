# Logging Utility Documentation

This utility module provides a collection of reusable functions for standardized API responses and logging in Node.js applications. The functions include error handling, API responses, and colored console logging.

---

## **API Response Handlers**

### `APIError`

**Description:** Generates a standardized API error response.

**Usage:**

```javascript
APIError(payload={msg, code, res});
```

**Parameters:**

- `payload.msg` (optional): Custom error message. Defaults to `'An error occurred'`.
- `payload.code` (optional): HTTP status code. Defaults to `500`.
- `payload.res` (optional): Express response object. If provided, sends the error response directly to the client.

**Returns:**

- If `payload.res` is provided, sends the error response directly to the client.
- If `payload.res` is not provided, returns a JSON object:
  ```json
  {
    "error": "Error message",
    "status": 500
  }
  ```

**Example:**

```javascript
APIError({ msg: "Not Found", code: 404, res: response });
```

---

### `APIResponse`

**Description:** Generates a standardized API success response.

**Usage:**

```javascript
APIResponse(payload={msg, data, code, res});
```

**Parameters:**

- `payload.msg` (optional): Custom success message. Defaults to `'Success'`.
- `payload.data` (optional): Data to include in the response. Defaults to `null`.
- `payload.code` (optional): HTTP status code. Defaults to `200`.
- `payload.res` (optional): Express response object. If provided, sends the success response directly to the client.

**Returns:**

- If `payload.res` is provided, sends the success response directly to the client.
- If `payload.res` is not provided, returns a JSON object:
  ```json
  {
    "message": "Success",
    "data": null,
    "status": 200
  }
  ```

**Example:**

```javascript
APIResponse({ msg: "Data retrieved successfully", data: userData, res: response });
```

---

### `APIResponseError`

**Description:** Generates an API response for errors that include additional data.

**Usage:**

```javascript
APIResponseError(payload={msg, data, code, res});
```

**Parameters:**

- `payload.msg` (optional): Custom error message. Defaults to `'An error occurred'`.
- `payload.data` (optional): Data to include in the error response. Defaults to `null`.
- `payload.code` (optional): HTTP status code. Defaults to `500`.
- `payload.res` (optional): Express response object. If provided, sends the error response directly to the client.

**Returns:**

- If `payload.res` is provided, sends the error response directly to the client.
- If `payload.res` is not provided, returns a JSON object:
  ```json
  {
    "error": "Error message",
    "data": null,
    "status": 500
  }
  ```

**Example:**

```javascript
APIResponseError({ msg: "Invalid data", data: validationErrors, res: response });
```

---

## **Logging Functions**

These functions add color-coded logs to the console for better readability.

First, import the functions into your project:

```javascript
const { success, error, info, warn, special } = require('./logs');
```

### `success`

**Description:** Logs a success message in green.

**Usage:**

```javascript
success(...msgs);
```

**Parameters:**

- `...msgs`: Messages to log. Multiple arguments are concatenated into a single string.

**Example:**

```javascript
success("Server started successfully on port", port);
```

---

### `error`

**Description:** Logs an error message in red.

**Usage:**

```javascript
error(...msgs);
```

**Parameters:**

- `...msgs`: Messages to log. Multiple arguments are concatenated into a single string.

**Example:**

```javascript
error("Failed to connect to database");
```

---

### `info`

**Description:** Logs an informational message in blue.

**Usage:**

```javascript
info(...msgs);
```

**Parameters:**

- `...msgs`: Messages to log. Multiple arguments are concatenated into a single string.

**Example:**

```javascript
info("New user registered:", username);
```

---

### `warn`

**Description:** Logs a warning message in yellow.

**Usage:**

```javascript
warn(...msgs);
```

**Parameters:**

- `...msgs`: Messages to log. Multiple arguments are concatenated into a single string.

**Example:**

```javascript
warn("Disk space running low");
```

---

### `special`

**Description:** Logs a custom message in magenta.

**Usage:**

```javascript
special(...msgs);
```

**Parameters:**

- `...msgs`: Messages to log. Multiple arguments are concatenated into a single string.

**Example:**

```javascript
special("Special debug message for admins");
```

---


### Original Console Methods

Since index.js overwrites the original `console` methods, such as `console.error`, `console.info`, and `console.warn`, this file also preserves them via `original.error`, `original.info`, and `original.warn`, respectively. This allows you to use the default console behavior if needed.

**Example:**
```javascript
const { error, original } = require('./logs');

// Use error logging
error("This is an error message");

// Use original console error
original.error("This is a default error message");
```


---

## **Summary**

This module simplifies response handling and logging in Node.js applications. It ensures consistent API responses and provides visually distinct logs for easier debugging. Import and use the functions in your project as needed.

**Example Integration:**

```javascript
const { APIResponse, APIError, success, error } = require('./logs');

app.get('/api', (req, res) => {
    try {
        // Successful response
        APIResponse({ msg: "Hello, world!", data: { greeting: "Hello" }, res });
        success("API endpoint /api was called");
    } catch (err) {
        // Error response
        APIError({ msg: "Something went wrong", code: 500, res });
        error("Error at /api:", err.message);
    }
});
```