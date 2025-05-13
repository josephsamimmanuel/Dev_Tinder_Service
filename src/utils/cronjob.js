const cron = require('node-cron');
const ConnectionRequestModel = require('../models/connectionRequest');
const { subDays, startOfDay, endOfDay } = require('date-fns');
const sendEmail = require('../utils/sendEmail');

// Run the cron job every minute
cron.schedule('5 * * * *', async () => {
    // Send Email to all users who got request the previous day
    try {
        console.log('Running connection request email cron job:', new Date().toISOString());
        
        const previousDay = subDays(new Date(), 1);
        const previousDayStart = startOfDay(previousDay);
        const previousDayEnd = endOfDay(previousDay);

        // Get all users who got request the previous day
        const connectionRequests = await ConnectionRequestModel.find({ 
            status: 'interested',
            createdAt: {
                $gte: previousDayStart,
                $lt: previousDayEnd
            }
        }).populate('fromUserId toUserId');

        console.log(`Found ${connectionRequests.length} connection requests to process`);
        
        const listOfEmails = [...new Set(connectionRequests.map(req => req.toUserId.emailId))];
        console.log(`Unique emails to send: ${listOfEmails.length}`);

        // Send Email to all users who got request the previous day
        for (const email of listOfEmails) {
            try {
                await sendEmail.run(
                    `You have new connection requests waiting!`,
                    `There are new connection requests for you. Please login to your account to view and respond to them.`
                );
                console.log(`Successfully sent email to: ${email}`);
            }
            catch (error) {
                console.error(`Failed to send email to ${email}:`, error.message);
            }
        }
        
        console.log('Cron job completed successfully');
    }
    catch (error) {
        console.error('Error in cron job execution:', error.message);
    }
});



