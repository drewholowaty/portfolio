const bcrypt = require("bcryptjs");
// const sgMail = require('@sendgrid/mail')
const crypto = require('crypto');
const cache = require("../db_objects.js").cache;
// const twilio_client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const salt_rounds = 10;

require("dotenv").config();
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/*
 * delete_session_token
 *
 * This function will remove the user's session token from the redis cache, thereby invalidating the client stored cookie. 
 */
const delete_session_token = async (req, res, next) => {
  const session_key = req.cookies.user_id + req.cookies.device_id;
  const result = await cache.DEL(session_key); 
  next();
};

/*
  verify_token

  This function will be invoked before every request that is accessing data to ensure that the requestor is authorized to interact  
  with such resources. This will be done by checking if the payload token is in the Redis token cache.
*/
const verify_session_token = async (req, res, next) => {
  const session_key = req.cookies.user_id + req.cookies.device_id;
  
  // if session_key is not present, return 401
  if(!session_key) {
    res.status(401).send({message: "Unauthorized"});
    return;
  }

  const session_token_hash = await cache.GET(session_key);   

  // if null, return unauthorized. bcrypt cannot handle null arguments
  if(!session_token_hash) {
    res.status(401).send({message: "Unauthorized"});
    return;
  } else {
    const match = await bcrypt.compare(req.cookies.session_token, session_token_hash);
    if(!match) {
      res.status(401).send({message: "Unauthorized"});
      return;
    }
  }
  next();
};

/*
  generate_session_token

  This function will generate a session token upon a login or sign up authentication action. The session token will be sent to a Redis 
  cache and be sent back to the user. If the user signifies that they are operating on a private device, the session token will be 
  saved in local storage.

  cache:
  user_id + device_id: session_token_hash
*/
const generate_session_token = async (req, res, next) => {
  const session_token = crypto.generateKeySync('aes', { length: 256 }).export().toString('hex');
  const device_id =  crypto.randomBytes(12).toString("hex");
  const session_key = res.locals.user_id + device_id;

  let cache_ttl = 0;
  let cookie_ttl = null;

  if(req.body.remember_me) {
    cache_ttl = 31536000; // 1 year ttl
    cookie_ttl = cache_ttl * 1000; // express sets max-age cookie in milliseconds
  } else {
    cache_ttl = 86400; // 24 hour cache ttl, cookie_ttl will expire when browser session ends due to not being set
  }

  // sets cookies
  // TODO: Change cookie attribute SameSite to strict after reverse proxy is configured properly
  res
    .cookie(
      "user_id", res.locals.user_id, 
      {
        secure: true,
        httpOnly: true,
        // SameSite: "Strict"
        SameSite: "None; Secure",
        maxAge: cookie_ttl
      }
    )
    .cookie(
      "device_id", device_id, 
      {
        secure: true,
        httpOnly: true,
        // SameSite: "Strict"
        SameSite: "None; Secure",
        maxAge: cookie_ttl
      }
    )
    .cookie(
      "session_token", session_token, 
      {
        secure: true,
        httpOnly: true,
        // SameSite: "Strict",
        SameSite: "None; Secure",
        maxAge: cookie_ttl
      }
    );

  // synchronously generates hash and stores to redis db
  const hash = bcrypt.hashSync(session_token, salt_rounds);

  result = await cache
    .multi()
    .SET(session_key, hash) 
    .EXPIRE(session_key, cache_ttl) 
    .exec();

  next();
};

/* 
 * generate_onetime_code
 *
 * This function will generate a onetime code with a 5 minute expiry limit. The code will be stored in the Redis cache. This code 
 * will then be sent to the user via email or phone. 
 */
const generate_onetime_code = (req, res, next) => {
  const onetime_code = random_string(15);
  bcrypt.hash(onetime_code, salt_rounds, (err, hash) => {
    if (err) throw err;
    cache
      .multi()
      .SET(req.body.email_or_phone, hash) 
      .EXPIRE(req.body.email_or_phone, 300) // 300 second TTL
      .exec();
  });

  const message_text = "Please copy this one-time code and paste it into the app to sign in: \n\n" + onetime_code;

  console.log(message_text);
  // if req.body.email is not null, send code via email. Else, send via text
//  if(res.locals.email) {
//    const msg = {
//      to: res.locals.email,
//      from: `${process.env.FROM_EMAIL}`, 
//      subject: "One-time Password",
//      text: message_text,
//    }
//    sgMail
//      .send(msg)
//      .then(() => {
//        console.log("Email sent");
//      })
//      .catch((error) => {
//        console.error(error);
//      });
//  } else {
//    twilio_client.messages
//      .create({
//        body: message_text,
//        from: `${process.env.TWILIO_PHONE_NUMBER}`,
//        to: res.locals.phone_number
//      })
//      .then(message => console.log(message.sid))
//      .catch((error) => {
//        console.error(error);
//      });
//    console.log("Text sent");
//  }

  next();
};

/* 
 * verify_onetime_code
 *
 * This function will verify the onetime code that was sent to the user, and entered by them into the application input field.
 */
const verify_onetime_code = async (req, res, next) => {
  let onetime_code_hash = null; 
  
  // try email. Checked first due to assumption that it will be more frequently used than phone_number
  if(res.locals.email) {
    onetime_code_hash = await cache.GET(res.locals.email);   
    if(onetime_code_hash) {
      const match = await bcrypt.compare(req.body.onetime_code, onetime_code_hash);
      if(!match) {
        res.status(401).send({message: "Unauthorized"});
        return;
      }
      cache.DEL(res.locals.email);
      next();
      return;
    }
  }

  if(res.locals.phone_number) {
    onetime_code_hash = await cache.GET(res.locals.phone_number);
    if(onetime_code_hash) {
      const match = await bcrypt.compare(req.body.onetime_code, onetime_code_hash);
      if(!match) {
        res.status(401).send({message: "Unauthorized"});
        return;
      }
      cache.DEL(res.locals.phone_number);
      next();
      return;
    }
  } 

  // if phone number or email are not in cache, unauthorized
  res.status(401).send({message: "Unauthorized"});
  return;
  
};

// private functions // 
const random_string = (length) => {
  let result = '';
  const characters = "1234567890" //'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};


const auth_functions = {
  verify_session_token,
  generate_session_token,
  generate_onetime_code,
  verify_onetime_code,
  delete_session_token
};

module.exports = auth_functions;

