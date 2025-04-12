const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient");

const createSendEmailCommand = (toAddress, fromAddress, message) => {
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
          Data: "<h1>New Connection Request</h1><p>" + message + "</p>",
        },
        Text: {
          Charset: "UTF-8",
          Data: "New Connection Request\n\n" + message + "\n\n",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "New Connection Request from Dev Tinder",
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const run = async (message) => {
  const sendEmailCommand = createSendEmailCommand(
    process.env.AWS_SES_TO_ADDRESS,
    process.env.AWS_SES_FROM_ADDRESS,
    message,
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };