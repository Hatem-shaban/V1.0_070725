#!/usr/bin/env node

// Production Readiness Checker for StartupStack-AI
const fs = require('fs');
const path = require('path');

console.log('🚀 StartupStack-AI Production Readiness Check\n');

const checks = [];

// Check 1: Required files exist
const requiredFiles = [
    'index.html',
    'dashboard.html', 
    'app.js',
    'config.js',
    'monitoring.js',
    'sw.js',
    'package.json',
    'netlify.toml',
    '.env.template',
    'PRODUCTION_DEPLOYMENT.md',
    'netlify/functions/create-lemonsqueezy-checkout.js',
    'netlify/functions/send-welcome-email.js',
    'netlify/functions/ai-operations.js'
];

requiredFiles.forEach(file => {
    const exists = fs.existsSync(file);
    checks.push({
        name: `File: ${file}`,
        status: exists ? 'PASS' : 'FAIL',
        passed: exists
    });
});

// Check 2: Package.json has required dependencies
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredDeps = [
        '@supabase/supabase-js',
        'openai',
        'resend',
        'axios'
    ];
    
    requiredDeps.forEach(dep => {
        const hasDep = packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep];
        checks.push({
            name: `Dependency: ${dep}`,
            status: hasDep ? 'PASS' : 'FAIL',
            passed: hasDep
        });
    });
} catch (e) {
    checks.push({
        name: 'Package.json parsing',
        status: 'FAIL',
        passed: false
    });
}

// Check 3: Netlify configuration
try {
    const netlifyToml = fs.readFileSync('netlify.toml', 'utf8');
    const hasBuild = netlifyToml.includes('[build]');
    const hasFunctions = netlifyToml.includes('[functions]');
    const hasHeaders = netlifyToml.includes('[[headers]]');
    
    checks.push({
        name: 'Netlify build config',
        status: hasBuild ? 'PASS' : 'FAIL',
        passed: hasBuild
    });
    
    checks.push({
        name: 'Netlify functions config',
        status: hasFunctions ? 'PASS' : 'FAIL',
        passed: hasFunctions
    });
    
    checks.push({
        name: 'Netlify headers config',
        status: hasHeaders ? 'PASS' : 'FAIL',
        passed: hasHeaders
    });
} catch (e) {
    checks.push({
        name: 'Netlify.toml parsing',
        status: 'FAIL',
        passed: false
    });
}

// Check 4: HTML files have required scripts
try {
    const indexHtml = fs.readFileSync('index.html', 'utf8');
    const hasConfig = indexHtml.includes('config.js');
    const hasMonitoring = indexHtml.includes('monitoring.js');
    const hasApp = indexHtml.includes('app.js');
    
    checks.push({
        name: 'Index.html has config.js',
        status: hasConfig ? 'PASS' : 'FAIL', 
        passed: hasConfig
    });
    
    checks.push({
        name: 'Index.html has monitoring.js',
        status: hasMonitoring ? 'PASS' : 'FAIL',
        passed: hasMonitoring
    });
    
    checks.push({
        name: 'Index.html has app.js',
        status: hasApp ? 'PASS' : 'FAIL',
        passed: hasApp
    });
} catch (e) {
    checks.push({
        name: 'HTML file parsing',
        status: 'FAIL',
        passed: false
    });
}

// Display results
console.log('📋 Check Results:\n');
checks.forEach(check => {
    const emoji = check.passed ? '✅' : '❌';
    console.log(`${emoji} ${check.name}: ${check.status}`);
});

const totalChecks = checks.length;
const passedChecks = checks.filter(c => c.passed).length;
const failedChecks = totalChecks - passedChecks;

console.log(`\n📊 Summary:`);
console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${failedChecks}`);

if (failedChecks === 0) {
    console.log('\n🎉 All checks passed! Ready for production deployment!');
} else {
    console.log(`\n⚠️  ${failedChecks} check(s) failed. Please fix before deploying.`);
}

console.log('\n📖 Next Steps:');
console.log('1. Set environment variables in Netlify dashboard');
console.log('2. Deploy to Netlify'); 
console.log('3. Test all functionality end-to-end');
console.log('4. Monitor error logs and performance');
