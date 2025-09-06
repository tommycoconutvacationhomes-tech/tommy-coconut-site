// Analytics Alerts & Automated Reporting
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
        const alertData = JSON.parse(event.body);
        const { type, metric, value, threshold, timestamp } = alertData;
        
        // Define alert thresholds and conditions
        const alertConditions = {
            'conversion_drop': { threshold: 15, operator: 'below' }, // Below 15%
            'traffic_spike': { threshold: 200, operator: 'above' },  // Above 200 visitors
            'form_abandonment': { threshold: 80, operator: 'above' }, // Above 80%
            'whatsapp_conversion': { threshold: 10, operator: 'below' }, // Below 10%
            'error_rate': { threshold: 5, operator: 'above' } // Above 5%
        };
        
        const condition = alertConditions[type];
        let shouldAlert = false;
        
        if (condition) {
            shouldAlert = condition.operator === 'above' ? 
                value > condition.threshold : 
                value < condition.threshold;
        }
        
        if (shouldAlert) {
            // Prepare alert message
            const alertMessage = {
                text: `🚨 Tommy Coconut Analytics Alert`,
                attachments: [{
                    color: value < threshold ? 'danger' : 'warning',
                    fields: [
                        {
                            title: 'Alert Type',
                            value: type.replace('_', ' ').toUpperCase(),
                            short: true
                        },
                        {
                            title: 'Current Value',
                            value: `${value}${metric.includes('rate') ? '%' : ''}`,
                            short: true
                        },
                        {
                            title: 'Threshold',
                            value: `${threshold}${metric.includes('rate') ? '%' : ''}`,
                            short: true
                        },
                        {
                            title: 'Timestamp',
                            value: new Date(timestamp).toLocaleString(),
                            short: true
                        }
                    ],
                    actions: [{
                        type: 'button',
                        text: 'View Dashboard',
                        url: 'https://tommy-coconut-site.netlify.app/analytics-dashboard.html'
                    }]
                }]
            };
            
            // Send alert to Slack webhook (replace with your Slack webhook URL)
            const slackWebhook = process.env.SLACK_WEBHOOK_URL;
            if (slackWebhook) {
                await fetch(slackWebhook, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(alertMessage)
                });
            }
            
            // Send email alert via Zapier webhook
            const zapierData = {
                alert_type: type,
                metric_name: metric,
                current_value: value,
                threshold: threshold,
                timestamp: timestamp,
                dashboard_url: 'https://tommy-coconut-site.netlify.app/analytics-dashboard.html',
                severity: value < threshold * 0.7 ? 'HIGH' : 'MEDIUM'
            };
            
            await fetch('https://hooks.zapier.com/hooks/catch/12863026/uddzzjj/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(zapierData)
            });
            
            return {
                statusCode: 200,
                headers: { 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ 
                    success: true, 
                    alert_sent: true,
                    message: 'Alert triggered and notifications sent'
                })
            };
        }
        
        return {
            statusCode: 200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ 
                success: true, 
                alert_sent: false,
                message: 'Metric within normal range'
            })
        };
        
    } catch (error) {
        console.error('Analytics Alert Error:', error);
        
        return {
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ 
                error: 'Failed to process alert: ' + error.message 
            })
        };
    }
};