export default async function handler(req, res) {
    const { filename } = req.query;

    const url = `https://api.github.com/repos/kamilhussen24/Music-Artists/commits?path=blog/${filename}`;
    
    const response = await fetch(url, {
        headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    });

    const data = await response.json();
    res.status(200).json(data);
}