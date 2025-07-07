const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
    // Add CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers
        };
    }

    if (event.httpMethod !== 'POST') {
        return { 
            statusCode: 405, 
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        const { email, content, subject } = JSON.parse(event.body);

        if (!email || !content) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email and content are required' })
            };
        }

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: [email],
            subject: subject || 'Your AI Results from StartupStack-AI',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #6B46C1;">Your StartupStack-AI Results</h2>
                    <p>Here are the results you generated with StartupStack-AI:</p>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #6B46C1;">
                        <pre style="white-space: pre-wrap; font-family: monospace;">${content}</pre>
                    </div>
                    <p style="margin-top: 30px;">
                        Need more help? Login to your <a href="${process.env.URL || 'https://startupstackai.netlify.app'}" style="color: #6B46C1; text-decoration: none;">StartupStack-AI dashboard</a> for more AI tools.
                    </p>
                </div>
            `
        });

        if (error) {
            throw error;
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Results email sent successfully' })
        };
    } catch (error) {
        // Error sending results email - handle appropriately
        return {
            statusCode: error.code || 500,
            headers,
            body: JSON.stringify({ error: 'Failed to send results email' })
        };
    }
};
