// Serverless proxy for the Circle community feed.
// The Circle API token is a SECRET and must never live in client-side code,
// so this function holds it server-side (as a Netlify environment variable)
// and returns only a trimmed, public-safe slice of the data.
//
// SETUP (one-time, in Netlify):
//   Site settings -> Environment variables -> add:
//     CIRCLE_API_TOKEN = <your Admin API v2 token from Circle: Developers -> Tokens>
//     CIRCLE_SPACE_ID  = <optional: a space id to pull a single space's posts>
//
// The front-end (hub/index.html) calls /.netlify/functions/circle-posts.

const CORS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'public, max-age=300'
};

exports.handler = async function () {
  const token = process.env.CIRCLE_API_TOKEN;
  const spaceId = process.env.CIRCLE_SPACE_ID;

  // Not configured yet: tell the page so it shows the "join" fallback cleanly.
  if (!token) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ configured: false, posts: [] }) };
  }

  try {
    let url = 'https://app.circle.so/api/admin/v2/posts?per_page=8&status=published&sort=latest';
    if (spaceId) url += '&space_id=' + encodeURIComponent(spaceId);

    const res = await fetch(url, {
      headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
    });

    if (!res.ok) {
      return { statusCode: 200, headers: CORS, body: JSON.stringify({ configured: true, error: 'Circle API ' + res.status, posts: [] }) };
    }

    const data = await res.json();
    const records = data.records || data.posts || data.data || [];

    const posts = records.slice(0, 8).map(function (p) {
      return {
        title: p.name || p.title || 'Untitled',
        excerpt: (p.body && (p.body.plain_text || p.body.preview)) || p.excerpt || '',
        url: p.url || p.public_url || 'https://gfy-community.circle.so',
        author: (p.author && (p.author.name || p.author.full_name)) || (p.user && p.user.name) || '',
        date: p.created_at || p.published_at || ''
      };
    });

    return { statusCode: 200, headers: CORS, body: JSON.stringify({ configured: true, posts: posts }) };
  } catch (e) {
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ configured: true, error: String(e), posts: [] }) };
  }
};
