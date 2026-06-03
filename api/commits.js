export default async function handler(req, res) {
    const { filename } = req.query;

    if (!filename) {
        return res.status(400).json({ error: 'filename query parameter is required' });
    }

    try {
        const response = await fetch(
            `https://api.github.com/repos/kamilhussen24/sylheti-translator/commits?path=blog/${filename}`,
            { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: `GitHub API error: ${response.status}` });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch commits' });
    }
}
