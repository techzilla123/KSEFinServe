const { google } = require('googleapis');
const fs = require('fs');

const serviceAccount = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

async function test() {
  const res = await calendar.freebusy.query({
    requestBody: {
      timeMin: '2026-11-06T00:00:00.000Z',
      timeMax: '2026-11-06T23:59:59.999Z',
      timeZone: 'America/Chicago',
      items: [{ id: 'kay.business360@gmail.com' }],
    },
  });
  console.log(JSON.stringify(res.data, null, 2));
}
test().catch(console.error);