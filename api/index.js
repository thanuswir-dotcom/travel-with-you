// Vercel Serverless Function Proxy -> Render Live Backend
export default function handler(req, res) {
  const targetUrl = `https://travel-with-you-backend.onrender.com${req.url}`;
  return res.redirect(307, targetUrl);
}
