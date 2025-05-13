const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, subject, message) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: [
        toAddress,
        /* more To-email addresses */
      ],
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${subject}</h1><p>${message}</p>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: `${subject}\n\n${message}\n\n`,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (subject, message) => {
  if (!process.env.AWS_SES_TO_ADDRESS || !process.env.AWS_SES_FROM_ADDRESS) {
    throw new Error('AWS SES email addresses not configured in environment variables');
  }

  const sendEmailCommand = createSendEmailCommand(
    process.env.AWS_SES_TO_ADDRESS,
    process.env.AWS_SES_FROM_ADDRESS,
    subject,
    message
  );

  try {
    const result = await sesClient.send(sendEmailCommand);
    console.log('Email sent successfully:', result.MessageId);
    return result;
  } catch (error) {
    console.error('Failed to send email:', error.message);
    throw error;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };