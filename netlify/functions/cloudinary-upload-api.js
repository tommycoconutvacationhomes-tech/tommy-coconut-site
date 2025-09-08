// Secure Cloudinary Upload via API
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary with API credentials from environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Validate environment variables are present
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing required Cloudinary environment variables');
}

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { imageUrl, imageName, folder = 'tommy-coconut/villas' } = JSON.parse(event.body);
        
        if (!imageUrl) {
            return {
                statusCode: 400,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Image URL is required' })
            };
        }

        // Upload to Cloudinary with optimizations
        const result = await cloudinary.uploader.upload(imageUrl, {
            public_id: imageName || undefined,
            folder: folder,
            resource_type: 'auto',
            transformation: [
                { quality: 'auto:best' },
                { fetch_format: 'auto' },
                { width: 1920, height: 1080, crop: 'limit' }
            ],
            eager: [
                { width: 400, crop: 'scale', quality: 'auto' },
                { width: 800, crop: 'scale', quality: 'auto' },
                { width: 1200, crop: 'scale', quality: 'auto' }
            ],
            eager_async: true,
            overwrite: true,
            invalidate: true
        });

        // Return optimized URLs
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                message: 'Image uploaded successfully',
                data: {
                    public_id: result.public_id,
                    url: result.secure_url,
                    optimized_url: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_auto/'),
                    thumbnail: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_400,c_fill/'),
                    responsive: {
                        small: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_400/'),
                        medium: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_800/'),
                        large: result.secure_url.replace('/upload/', '/upload/f_auto,q_auto,w_1200/')
                    },
                    format: result.format,
                    width: result.width,
                    height: result.height,
                    bytes: result.bytes
                }
            })
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ 
                error: 'Failed to upload image',
                details: error.message 
            })
        };
    }
};