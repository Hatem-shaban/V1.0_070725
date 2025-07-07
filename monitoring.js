// Production Error Handling and Monitoring
class ProductionErrorHandler {
    constructor() {
        this.errorLog = [];
        this.init();
    }

    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.logError({
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.logError({
                type: 'Unhandled Promise Rejection',
                message: event.reason?.message || event.reason,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                url: window.location.href
            });
        });
    }

    logError(errorInfo) {
        // Log to console in development
        if (window.APP_CONFIG?.debug) {
            console.error('Error logged:', errorInfo);
        }

        // Store in memory (could send to monitoring service)
        this.errorLog.push(errorInfo);

        // Send critical errors to backend (optional)
        if (this.isCriticalError(errorInfo)) {
            this.sendErrorToBackend(errorInfo);
        }
    }

    isCriticalError(errorInfo) {
        const criticalMessages = [
            'payment',
            'checkout',
            'subscription',
            'database',
            'supabase'
        ];
        
        return criticalMessages.some(keyword => 
            errorInfo.message?.toLowerCase().includes(keyword)
        );
    }

    async sendErrorToBackend(errorInfo) {
        try {
            // Could implement error reporting to a service like Sentry
            // For now, just log critical errors
            console.error('CRITICAL ERROR:', errorInfo);
        } catch (err) {
            console.error('Failed to send error report:', err);
        }
    }

    getErrorReport() {
        return {
            totalErrors: this.errorLog.length,
            recentErrors: this.errorLog.slice(-10),
            criticalErrors: this.errorLog.filter(err => this.isCriticalError(err))
        };
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
        this.init();
    }

    init() {
        // Monitor page load time
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.recordMetric('page_load_time', loadTime);
        });
    }

    recordMetric(name, value) {
        this.metrics[name] = {
            value,
            timestamp: new Date().toISOString()
        };
    }

    startTimer(name) {
        this.metrics[`${name}_start`] = performance.now();
    }

    endTimer(name) {
        const startTime = this.metrics[`${name}_start`];
        if (startTime) {
            const duration = performance.now() - startTime;
            this.recordMetric(`${name}_duration`, duration);
            delete this.metrics[`${name}_start`];
            return duration;
        }
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize monitoring in production
if (typeof window !== 'undefined') {
    window.errorHandler = new ProductionErrorHandler();
    window.performanceMonitor = new PerformanceMonitor();
    
    // Add helpful debugging info
    window.getAppStatus = function() {
        return {
            environment: window.APP_CONFIG?.environment,
            supabaseConnected: !!window.StartupStack?.supabase,
            userLoggedIn: !!localStorage.getItem('userId'),
            errors: window.errorHandler.getErrorReport(),
            performance: window.performanceMonitor.getMetrics()
        };
    };
}
