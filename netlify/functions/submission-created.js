// Runs automatically on every Netlify Forms submission ("submission-created" event).
// Adds the captured email to Flodesk.
//
// Set these in Netlify → Site settings → Environment variables:
//   FLODESK_API_KEY     (required) your Flodesk API key
//   FLODESK_SEGMENT_ID  (optional) a segment to add subscribers to
//
// The Netlify form is named "email-capture" (see gate.js / the gate forms).

exports.handler = async function (event) {
  try {
    var body = JSON.parse(event.body || '{}');
    var data = (body.payload && body.payload.data) || {};
    var email = (data.email || '').trim();
    if (!email || email.indexOf('@') < 1) {
      return { statusCode: 200, body: 'no valid email, skipping' };
    }

    var key = process.env.FLODESK_API_KEY;
    if (!key) {
      console.log('FLODESK_API_KEY not set — captured', email, 'but did not forward.');
      return { statusCode: 200, body: 'FLODESK_API_KEY not configured' };
    }
    var auth = 'Basic ' + Buffer.from(key + ':').toString('base64');
    var headers = { 'Authorization': auth, 'Content-Type': 'application/json' };

    // 1) Create or update the subscriber.
    var r1 = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ email: email })
    });
    if (!r1.ok) {
      console.log('Flodesk subscriber error', r1.status, await r1.text());
    }

    // 2) Optionally add them to a segment (so they enter the right list/workflow).
    var seg = process.env.FLODESK_SEGMENT_ID;
    if (seg) {
      var r2 = await fetch('https://api.flodesk.com/v1/subscribers/' + encodeURIComponent(email) + '/segments', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ segment_ids: [seg] })
      });
      if (!r2.ok) console.log('Flodesk segment error', r2.status, await r2.text());
    }

    return { statusCode: 200, body: 'forwarded to Flodesk' };
  } catch (e) {
    console.log('submission-created error', e && e.message);
    return { statusCode: 200, body: 'handled' };
  }
};
