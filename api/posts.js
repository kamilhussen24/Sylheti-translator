export default async function handler(req, res) {
    const response = await fetch('https://api.github.com/repos/kamilhussen24/sylheti-translator/contents/blog', {
        headers: {
            Authorization: `token ${process.env.GITHUB_TOKEN}`
        }
    });

    const data = await response.json();
    res.status(200).json(data);
}