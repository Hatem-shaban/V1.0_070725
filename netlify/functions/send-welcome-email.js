const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event, context) => {
    // Removed console.log for production

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
        // Removed console.log for production
        const { email, userName } = JSON.parse(event.body);

        if (!email) {
            // No email provided - handle appropriately
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Email is required' })
            };
        }

        // Removed SendGrid configuration logging for production

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
            to: [email],
            subject: '🎉 Welcome to StartupStack-AI!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #6366F1; margin-bottom: 24px;">🎉 Welcome to StartupStack-AI!</h1>
                    
                    <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">Thank you for joining our community of entrepreneurs. Your AI-powered toolkit includes:</p>
                    
                    <div style="margin-bottom: 24px;">
                        <p style="margin: 12px 0;">✨ Business Name Generator - Create unique, brandable names</p>
                        <p style="margin: 12px 0;">🎨 Logo Creator - Professional designs in seconds</p>
                        <p style="margin: 12px 0;">📊 Pitch Deck Generator - Investor-ready presentations</p>
                        <p style="margin: 12px 0;">🔍 Market Research Tool - Competitive analysis</p>
                        <p style="margin: 12px 0;">📅 Content Calendar - Social media planning</p>
                        <p style="margin: 12px 0;">📧 Email Templates - Marketing sequences</p>
                        <p style="margin: 12px 0;">📝 Legal Document Generator - Contracts & policies</p>
                        <p style="margin: 12px 0;">💰 Financial Projections - Revenue modeling</p>
                    </div>

                    <p style="color: #374151; font-size: 16px; margin-bottom: 24px;">Ready to get started? Click the button below to access your dashboard:</p>
                    
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${process.env.URL}/dashboard" 
                           style="background: linear-gradient(to right, #6366F1, #EC4899);
                                  color: white;
                                  text-decoration: none;
                                  padding: 16px 32px;
                                  border-radius: 8px;
                                  font-weight: bold;
                                  display: inline-block;">
                            Access Your Dashboard
                        </a>
                    </div>

                    <p style="color: #6B7280; font-size: 14px; text-align: center; margin-top: 32px;">
                        Need help? Simply reply to this email - we're here to help!
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
            body: JSON.stringify({ message: 'Welcome email sent successfully' })
        };
    } catch (error) {
        // Email sending failed - handle appropriately
        
        // Check for missing API key
        if (!process.env.RESEND_API_KEY) {
            // RESEND_API_KEY is missing - configuration issue
        }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to send welcome email',
                details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
            })
        };
    }
};