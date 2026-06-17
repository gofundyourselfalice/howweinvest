// Brand-preview password gate (HTTP Basic Auth) across the whole site.
//
// Turn it ON  : set an env var PREVIEW_PASSWORD in Netlify, then redeploy.
// Turn it OFF : delete the PREVIEW_PASSWORD env var (or this file), then redeploy.
//
// Visitors are prompted by the browser for a username + password. Any username
// works; only the password is checked, so you just share one password.

export default async (request) => {
  const expected = Deno.env.get("PREVIEW_PASSWORD");

  // Fail-safe: if no password is configured, leave the site open.
  if (!expected) return;

  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const password = decoded.slice(decoded.indexOf(":") + 1);
      if (password === expected) return; // correct → let the request through
    } catch (_e) {
      // fall through to the 401 below
    }
  }

  return new Response("This is a private preview. Please enter the password.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="How We Invest, brand preview", charset="UTF-8"',
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};

export const config = {
  path: "/*",
  // keep the Netlify form/Flodesk functions reachable
  excludedPath: ["/.netlify/*"],
};
