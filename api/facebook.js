const axios = require('axios');

function isValidFacebookUrl(url) {
    const patterns = [
        /facebook\.com\/.*\/videos\/\d+/,
        /facebook\.com\/video\.php/,
        /facebook\.com\/watch/,
        /facebook\.com\/reel\/\d+/,
        /facebook\.com\/share\/v\//,
        /facebook\.com\/share\/r\//,
        /fb\.watch\/[\w\d]+/,
        /m\.facebook\.com\/.*\/videos\/\d+/,
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
        if (!isValidFacebookUrl(url)) return res.status(400).json({ success: false, message: 'Invalid Facebook URL' });

        const response = await axios.get(`https://api.ivoid.cfd/downloader/facebook?url=${encodeURIComponent(url)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'application/json'
            },
            timeout: 15000
        });

        if (!response.data || !response.data.status) {
            return res.status(404).json({ success: false, message: 'Video not found or unable to process' });
        }

        const data  = response.data.result;
        const media = data.media || {};
        return res.status(200).json({
            success: true,
            data: {
                title:      data.title || 'Facebook Video',
                type:       data.type || 'video',
                thumbnail:  data.thumbnail || null,
                duration:   data.duration || null,
                uploader:   data.uploader || null,
                videoUrl:   media.video    || null,
                videoUrlSD: media.video_sd || null,
                images:     media.images   || null,
            }
        });
    } catch (error) {
        console.error('Facebook API Error:', error.message);
        if (error.code === 'ECONNABORTED') return res.status(408).json({ success: false, message: 'Request timeout. Please try again.' });
        return res.status(500).json({ success: false, message: 'Failed to process video. Please try again later.' });
    }
}

module.exports = handler;
