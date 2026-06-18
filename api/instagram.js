const axios = require('axios');

function isValidInstagramUrl(url) {
    const patterns = [
        /instagram\.com\/p\/[\w\d\-_]+/,
        /instagram\.com\/reel\/[\w\d\-_]+/,
        /instagram\.com\/reels\/[\w\d\-_]+/,
        /instagram\.com\/tv\/[\w\d\-_]+/,
        /instagram\.com\/stories\/[\w\d\-_]+\/\d+/,
        /instagr\.am\/p\/[\w\d\-_]+/,
    ];
    return patterns.some(p => p.test(url));
}

async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.query._health) return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });

    try {
        const { url } = req.query;
        if (!url) return res.status(400).json({ success: false, message: 'URL parameter is required' });
        if (!isValidInstagramUrl(url)) return res.status(400).json({ success: false, message: 'Invalid Instagram URL' });

        const response = await axios.get(`https://api.ivoid.cfd/downloader/instagram?url=${encodeURIComponent(url)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 15000
        });

        if (!response.data || !response.data.status) {
            return res.status(404).json({ success: false, message: 'Content not found or unable to process' });
        }

        const data = response.data.result;
        const media = data.media || {};
        return res.status(200).json({
            success: true,
            data: {
                title: data.title || 'Instagram Content',
                type: data.type || 'video',
                videoUrl: media.video_hd || media.video || null,
                videoUrlSD: media.video || null,
                images: media.images || null,
                audioUrl: data.music?.url || null,
                musicTitle: data.music?.title || null,
                musicAuthor: data.music?.author || null,
            }
        });
    } catch (error) {
        console.error('Instagram API Error:', error.message);
        if (error.code === 'ECONNABORTED') return res.status(408).json({ success: false, message: 'Request timeout. Please try again.' });
        return res.status(500).json({ success: false, message: 'Failed to process content. Please try again later.' });
    }
}

module.exports = handler;
