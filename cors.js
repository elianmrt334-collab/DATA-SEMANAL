export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, X-Mc-Auth');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: "Missing url parameter" });
    }

    try {
        const headers = {
            "Accept": "application/json"
        };
        // Forward authentication header if present
        if (req.headers['x-mc-auth']) {
            headers['X-Mc-Auth'] = req.headers['x-mc-auth'];
        }

        const fetchRes = await fetch(url, {
            method: req.method,
            headers: headers
        });

        const status = fetchRes.status;
        const contentType = fetchRes.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            const data = await fetchRes.json();
            return res.status(status).json(data);
        } else {
            const text = await fetchRes.text();
            return res.status(status).send(text);
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
