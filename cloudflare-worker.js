// Cloudflare Worker for LightWork R2 Bucket
// Deploy this as a Worker and bind it to your R2 bucket

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // List all objects in the bucket
      const listed = await env.LIGHTWORK_BUCKET.list({ limit: 1000 });

      // R2 public URL base
      const baseUrl = 'https://pub-456f19304a5c430d8c184ecc68198a3c.r2.dev';

      // Filter for media files and build full URLs
      const mediaUrls = listed.objects
        .filter(obj => obj.key.match(/\.(jpg|jpeg|png|gif|webp|mp4|mov)$/i))
        .filter(obj => obj.key.startsWith('Portfolio-Content/') || obj.key.includes('/'))
        .map(obj => `${baseUrl}/${obj.key}`);

      return new Response(JSON.stringify(mediaUrls), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};
