const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  region: "eu-north-1",
});

const sns = new AWS.SNS();

async function sendVerificationSMS(phoneNumber, code) {
  const params = {
    Message: `Your Password reset code is: ${code}`,
    PhoneNumber: phoneNumber,
    Subject: "Mekanik",
    MessageAttributes: {
      "AWS.SNS.SMS.SenderID": {
        DataType: "String",
        StringValue: "Mekanik",
      },
    },
  };

  try {
    const result = await sns.publish(params).promise();
    console.log("SMS sent:", result.MessageId);
    return true;
  } catch (error) {
    console.error("SMS sending error:", error);
    return false;
  }
}

module.exports = { sendVerificationSMS };
