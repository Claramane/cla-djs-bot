// src/services/googleCalendar.js
import fs from 'fs';
import readline from 'readline';
import { google } from 'googleapis';

// 憑證和 Token 檔案路徑
const CREDENTIALS_PATH = './src/services/credentials.json';
const TOKEN_PATH = './src/services/token.json';
const SCOPES = ['https://www.googleapis.com/auth/calendar'];

export const authorize = (callback) => {
  fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  });
};

const getAccessToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
};

export const listEvents = (auth, calendarId = 'primary') => {
  const calendar = google.calendar({ version: 'v3', auth });
  return new Promise((resolve, reject) => {
    calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return reject('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
        resolve(events);
      } else {
        resolve([]);
      }
    });
  });
};
