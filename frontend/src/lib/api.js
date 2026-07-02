function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export async function fetchWithCSRF(url, options = {}) {
  // If it's a mutation (POST, PUT, DELETE, PATCH)
  if (options.method && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method.toUpperCase())) {
    let csrfToken = getCookie("csrf_token");
    
    // Fetch it if it doesn't exist
    if (!csrfToken) {
      const res = await fetch("/api/auth/csrf-token", { credentials: "include" });
      if (res.ok) {
        csrfToken = getCookie("csrf_token");
      }
    }

    if (csrfToken) {
      options.headers = {
        ...options.headers,
        "x-csrf-token": csrfToken,
      };
    }
  }

  // Ensure credentials are included to send cookies
  options.credentials = "include";

  let res = await fetch(url, options);

  // Handle 401 Unauthorized globally
  if (res.status === 401 && !url.includes('/api/auth/')) {
    try {
      // Attempt to refresh the token
      const refreshOptions = { method: 'POST', credentials: 'include', headers: {} };
      let csrfToken = getCookie("csrf_token");
      if (!csrfToken) {
        const csrfRes = await fetch("/api/auth/csrf-token", { credentials: "include" });
        if (csrfRes.ok) csrfToken = getCookie("csrf_token");
      }
      if (csrfToken) {
        refreshOptions.headers["x-csrf-token"] = csrfToken;
      }
      
      const refreshRes = await fetch("/api/auth/refresh", refreshOptions);
      if (refreshRes.ok) {
        // Retry original request if refresh succeeded
        res = await fetch(url, options);
      } else {
        // Redirect to login if refresh failed
        if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/")) {
          window.location.href = "/auth/login";
        }
      }
    } catch (err) {
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth/")) {
        window.location.href = "/auth/login";
      }
    }
  }

  return res;
}
