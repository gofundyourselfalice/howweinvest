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

    // Create or update the subscriber, adding them to the segment in the same
    // call. Flodesk's POST /v1/subscribers accepts segment_ids directly, which
    // avoids the separate /subscribers/{id}/segments endpoint (that one needs
    // the internal subscriber id, not the email, and 404s if given an email).
    var seg = process.env.FLODESK_SEGMENT_ID;

    // 1) Create or update the subscriber. Pass segment_ids here too, in case the
    //    create endpoint honours it directly.
    var sub = { email: email };
    if (seg) sub.segment_ids = [seg];

    var r1 = await fetch('https://api.flodesk.com/v1/subscribers', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(sub)
    });
    var created = null;
    try { created = await r1.json(); } catch (e) {}
    if (!r1.ok) {
      console.log('Flodesk subscriber error', r1.status, JSON.stringify(created));
      return { statusCode: 200, body: 'Flodesk error, logged' };
    }

    // 2) Add to the segment using the subscriber's INTERNAL ID (not the email).
    //    The /subscribers/{id}/segments endpoint 404s if given an email.
    if (seg) {
      var id = created && (created.id || (created.data && created.data.id));
      if (id) {
        var r2 = await fetch('https://api.flodesk.com/v1/subscribers/' + encodeURIComponent(id) + '/segments', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ segment_ids: [seg] })
        });
        if (!r2.ok) console.log('Flodesk segment error', r2.status, await r2.text());
      } else {
        console.log('Flodesk: no subscriber id in create response', JSON.stringify(created));
      }
    }

    return { statusCode: 200, body: 'forwarded to Flodesk' };
  } catch (e) {
    console.log('submission-created error', e && e.message);
    return { statusCode: 200, body: 'handled' };
  }
};
