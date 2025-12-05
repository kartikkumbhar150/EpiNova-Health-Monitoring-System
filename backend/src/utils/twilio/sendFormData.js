import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(
  accountSid,
  authToken
);

export async function sendSms(msg){
    
return client.messages.create({
  body: msg,
  from: fromPhoneNumber, // Your Twilio number
  to: '+917410539769' // recipient
})
.then(msg => console.log('Message sent:', msg.sid))
.catch(err => console.error(err));
}
