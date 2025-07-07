// Configuration file for environment variables
// This file should be loaded before app.js in production

// Production environment configuration
window.ENVIRONMENT = 'production';

// Supabase configuration - these should be set via environment variables in production
window.SUPABASE_URL = window.SUPABASE_URL || 'https://ygnrdquwnafkbkxirtae.supabase.co';
window.SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnbnJkcXV3bmFma2JreGlydGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTY3MjMsImV4cCI6MjA2MzczMjcyM30.R1QNPExVxHJ8wQjvkuOxfPH0Gf1KR4HOafaP3flPWaI';

// Application configuration
window.APP_CONFIG = {
    name: 'StartupStack-AI',
    version: '1.0.0',
    environment: window.ENVIRONMENT,
    debug: window.ENVIRONMENT !== 'production'
};

// Variant IDs for LemonSqueezy products (LIVE)
window.PRODUCT_VARIANTS = {
    starter: '880115',
    pro: '880114', 
    annual: '880113'
};

console.log('StartupStack-AI Configuration loaded:', window.APP_CONFIG);
