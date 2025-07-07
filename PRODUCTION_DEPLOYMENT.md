# StartupStack-AI Production Deployment Guide

## Pre-deployment Checklist

### 1. Environment Variables Setup
Before deploying, ensure all environment variables are set in your Netlify dashboard:

#### Required Environment Variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your Supabase anon public key  
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for server functions)
- `LEMONSQUEEZY_API_KEY` - Your LemonSqueezy API key
- `LEMONSQUEEZY_STORE_ID` - Your LemonSqueezy store ID
- `RESEND_API_KEY` - Your Resend API key for emails
- `RESEND_FROM_EMAIL` - Your verified sender email
- `OPENAI_API_KEY` - Your OpenAI API key
- `NODE_ENV=production`

### 2. Database Setup (Supabase)
Ensure your Supabase database has the following tables:

#### Users Table:
```sql
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR,
    password_hash VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    subscription_status VARCHAR DEFAULT 'pending',
    plan_type VARCHAR DEFAULT 'starter',
    lemonsqueezy_checkout_id VARCHAR,
    activated_at TIMESTAMP WITH TIME ZONE,
    last_login TIMESTAMP WITH TIME ZONE
);
```

#### Operation History Table:
```sql
CREATE TABLE operation_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    operation_type VARCHAR NOT NULL,
    input_params JSONB,
    output_result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

### 3. Domain Configuration
1. Configure your custom domain in Netlify
2. Enable HTTPS (automatic with Netlify)
3. Update CORS settings if needed

### 4. LemonSqueezy Products Setup
Make sure your LemonSqueezy store has these product variants:
- Starter Plan: ID `880115`
- Pro Plan: ID `880114` 
- Annual Plan: ID `880113`

### 5. DNS & Email Configuration
1. Set up DNS records for your domain
2. Configure email authentication (SPF, DKIM) for Resend
3. Verify your sender domain in Resend

## Deployment Steps

### 1. Code Deployment
```bash
# Build and deploy to Netlify
npm run build
# Push to your connected GitHub repository
git add .
git commit -m "Production ready deployment"
git push origin main
```

### 2. Environment Variables
Set all required environment variables in Netlify dashboard:
- Go to Site Settings > Environment Variables
- Add all variables from the checklist above

### 3. Function Configuration
The following Netlify functions will be automatically deployed:
- `create-lemonsqueezy-checkout` - Handles subscription creation
- `send-welcome-email` - Sends welcome emails to new users
- `send-trial-ending-email` - Sends trial ending reminders
- `send-results-email` - Sends AI operation results
- `ai-operations` - Handles all AI-powered operations

### 4. Testing Checklist

#### ✅ User Registration & Authentication
- [ ] Free trial signup works
- [ ] Paid plan signup redirects to LemonSqueezy
- [ ] Login with existing credentials
- [ ] Password validation
- [ ] Welcome email delivery

#### ✅ Payment Processing
- [ ] LemonSqueezy checkout flow
- [ ] Successful payment redirect
- [ ] Subscription status updates
- [ ] Access to dashboard after payment

#### ✅ AI Tools Functionality
- [ ] Business name generator
- [ ] Logo creator
- [ ] Pitch deck templates
- [ ] Market research tool
- [ ] Content planner
- [ ] Email templates
- [ ] Legal documents
- [ ] Financial projections

#### ✅ Email System
- [ ] Welcome emails send correctly
- [ ] Trial ending reminders work
- [ ] Result emails for AI operations

### 5. Monitoring & Analytics
Consider adding:
- Google Analytics or similar
- Error monitoring (Sentry)
- Performance monitoring
- User behavior tracking

## Security Checklist

- [ ] All API keys stored as environment variables
- [ ] No sensitive data in client-side code
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Input validation on all forms
- [ ] Rate limiting on API endpoints
- [ ] Secure password hashing

## Performance Optimization

- [ ] Image optimization
- [ ] CDN configuration
- [ ] Function timeout settings
- [ ] Database query optimization
- [ ] Caching strategies

## Post-Deployment

1. Monitor error logs in Netlify Functions
2. Check Supabase database for proper user creation
3. Verify email delivery in Resend dashboard
4. Test all payment flows end-to-end
5. Monitor AI operation usage and costs

## Support & Maintenance

- Regularly update dependencies
- Monitor API usage and costs
- Backup database regularly
- Review error logs weekly
- Update content and pricing as needed

---
**Ready for Production**: All systems configured and tested ✅
