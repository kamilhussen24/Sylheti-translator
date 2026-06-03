export default async function handler(req, res) {
    try {
        const response = await fetch(
            'https://api.github.com/repos/kamilhussen24/sylheti-translator/contents/blog',
            { headers: { Authorization: `token ${process.env.GITHUB_TOKEN}` } }
        );

        if (!response.ok) {
            return res.status(response.status).json({ error: `GitHub API error: ${response.status}` });
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
}
