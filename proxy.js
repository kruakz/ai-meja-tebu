// proxy.js

const express = require('express');
const DigestFetch = require('digest-fetch').DigestClient;
const app = express();

const CAMERA_URL = "http://10.10.12.227/ISAPI/Streaming/channels/1/picture?0=0";

const USERNAME = "admin";
const PASSWORD = "Admin888cap";

const client = new DigestFetch(USERNAME, PASSWORD);

app.get('/', (req, res) => {
  res.send(
    '<h3>Proxy Kamera (Digest Auth)</h3>' +
    '<p>Akses <a href="/proxy-frame">/proxy-frame</a> untuk snapshot.</p>'
  );
});

app.get('/proxy-frame', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  try {
    const response = await client.fetch(CAMERA_URL);

    if (!response.ok) {
      res
        .status(response.status)
        .send(`Failed to fetch from camera (status ${response.status})`);
      return;
    }

    const arrayBuf = await response.arrayBuffer();
    const imgBuffer = Buffer.from(arrayBuf);

    res.type(response.headers.get('content-type') || 'image/jpeg');
    res.send(imgBuffer);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy error: " + err.message);
  }
});

// Jalankan server di port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server berjalan di http://localhost:${PORT}`);
  console.log(`- Akses frame via: http://localhost:${PORT}/proxy-frame`);
});
