const { user_functions, auth_functions} = require("../middleware"); 

/*
  This file defines the API endpoints begining with /auth that will be used by the frontened to authenticate a user.
*/

module.exports = (app) => {

  /* 
   * /auth/verify_user
   * 
   * Middleware:
   * generate_onetime_code
   * read_user_email_phone
   *
   * Request Body:
   * {
   *    email_or_phone: <regex too long for comment | null> or <\+1\d{10}$ | null>
   * }
   *
   * Response Body (200):
   * {
   *    user_id: <id>,
   *    auth_type: <email | phone>
   * }
   *
   * Response Body(404):
   * {
   *    message: "User does not exist",
   *    auth_type: <email | phone>
   * }
   *
   * Email or phone number must not be null
   */
  app.post("/api/auth/verify_user",
    (req, res, next) => {
      // validates api request body  
      console.log(req.body);
      if(!req.body.email_or_phone) {
        res.status(400).send({error: "Please input email or phone number"});
        return;
      }

      res.locals.email = null;
      res.locals.phone_number = null;

      const email_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      const phone_number_regex = /\+1\d{10}$/;
      if (email_regex.test(req.body.email_or_phone)) {
        res.locals.email = req.body.email_or_phone;
        res.locals.auth_type = "email";
      } else if (phone_number_regex.test(req.body.email_or_phone)) {
        res.locals.phone_number = req.body.email_or_phone;
        res.locals.auth_type = "phone";
        // TODO: fix twilio phone number registration bug
        res.status(400).send({error: "Phone number functionality not working "});
        return;
      } else {
        res.status(400).send({error: "Improper formatting. Phone number must match +11234567890 or email must match name@example.com"});
        return;
      } 
      
      next();
    },
    auth_functions.generate_onetime_code, user_functions.read_user_email_or_phone,
    (req, res) => {
      res.status(200).send(
        {
          user_id: res.locals.user_id, 
          auth_type: res.locals.auth_type
        }
      );
    }
  ); 
  
  /* 
   * /auth/signup
   *
   * Middleware:
   *
   * auth_functions.verify_onetime_code
   * user_functions.create_new_user
   * auth_functions.generate_session_token
   *
   * Request Body:
   * {
   *    name: <name>,
   *    preferred_zip_code: 
   *    email: <regex too long for comment | null>,
   *    phone_number: <\+1\d{10}$ | null>
   *    onetime_code: <code>,
   *    remember_me: <true | false>
   * }
   *
   * Response Body (201):
   * {
   *    message: "User successfully created"
   * }
   * 
   * Cookies Set:
   * {
   *    user_id,
   *    device_id,
   *    session_token
   * }
   *
   */
  app.post("/api/auth/signup",
    (req, res, next) => {
      // validates api request body  
      // TODO: patch to require email until twilio issue is resolved
      // if (!(req.body.email || req.body.phone_number)) {
      //   res.status(400).send({error: "Must include phone number or email"});
      //   return;
      // } 

      if(!req.body.email) {
        res.status(400).send({error: "Must include email"});
        return;
      }

      if(req.body.email === "" || req.body.phone_number === "") {
        res.status(400).send({error: "Email or phone number cannot be empty string"});
        return;
      }
      
      const email_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      if (req.body.email && !email_regex.test(req.body.email)) {
        res.status(400).send({error: "Invalid email"});
        return;
      }

      const phone_number_regex = /\+1\d{10}$/;
      if (req.body.phone_number && !phone_number_regex.test(req.body.phone_number)) {
        res.status(400).send({error: "Invalid phone number"});
        return;
      }

      if(!(req.body.onetime_code)) {
        res.status(400).send({error: "Body must include onetime_code"});
        return;
      }
      if(!(typeof req.body.onetime_code === 'string')) {
        res.status(400).send({error: "onetime_code value type must be string"});
        return;
      }

      if(!(typeof req.body.remember_me === 'boolean')) {
        res.status(400).send({error: "remember_me value type must be boolean"});
        return;
      }

      const zip_code_regex = /^\d{5}(?:[-\s]\d{4})?$/;
      if (!zip_code_regex.test(req.body.preferred_zip_code)) {
        res.status(400).send({error: "Invalid zip code"});
        return;
      }

      // sets email and phone number to res.locals values so that verify_onetime_code will function properly
      res.locals.email = req.body.email;
      res.locals.phone_number = req.body.phone_number;

      next();
    }, auth_functions.verify_onetime_code, user_functions.create_new_user, auth_functions.generate_session_token, 
    (req, res) => {
      res.status(201).send(
        {
          message: "User successfully created and authenticated"
        }
      );

    }
  );

  /* /api/auth/login
   *
   * Middleware:
   *
   *
   * Request Body:
   * {
   *    user_id: <id>,
   *    email_or_phone,
   *    onetime_code: <code>,
   *    remember_me: <true | false>
   * }
   *
   * Response Body:
   * {
   *    message: User authenticated
   * }
   * 
   * Cookies Set:
   * {
   *    user_id,
   *    device_id,
   *    session_token
   * }
   *
   */
  app.post("/api/auth/login",
    (req, res, next) => {
      // validates api request body  
      if(!req.body.email_or_phone) {
        res.status(400).send({error: "Please input email or phone number"});
        return;
      }

      res.locals.email = null;
      res.locals.phone_number = null;

      const email_regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
      const phone_number_regex = /\+1\d{10}$/;
      if (email_regex.test(req.body.email_or_phone)) {
        res.locals.email = req.body.email_or_phone;
      } else if (phone_number_regex.test(req.body.email_or_phone)) {
        res.locals.phone_number = req.body.email_or_phone;
        // TODO: fix twilio phone number registration bug
        res.status(400).send({error: "Phone number functionality not working "});
        return;
      } else {
        res.status(400).send({error: "Improper formatting. Phone number must match +11234567890 or email must match name@example.com"});
        return;
      } 

      if(!(req.body.onetime_code && req.body.user_id)) {
        res.status(400).send({error: "Body must include user_id and onetime_code"});
        return;
      }

      if(!(typeof req.body.onetime_code === 'string' && typeof req.body.user_id === 'string')) {
        res.status(400).send({error: "user_id and onetime_code value types must be strings"});
        return;
      }

      if(!(typeof req.body.remember_me === 'boolean')) {
        res.status(400).send({error: "remember_me value type must be boolean"});
        return;
      }
      // /auth/signup and /auth/login are the only two routes that use auth_functions.generate_session_token. Because user_id is not 
      // known until user_functions.create_new_user, /auth/signup stores user_id in res.locals. The same is done here for consistency. 
      res.locals.user_id = req.body.user_id;

      next();
    },
    auth_functions.verify_onetime_code, auth_functions.generate_session_token,
    (req, res) => {
      res.status(200).send(
        {
          message: "User authenticated"
        }
      );
    }
  );

  /* /auth/logout
   *
   * Middleware:
   *
   *
   * Request Body:
   * {
   *
   * }
   *
   * Response Body:
   * {
   *    message: "User logged out"
   * }
   *
   */
  app.post("/api/auth/logout",
    (req, res, next) => {
      // validates api request body  
      next();
    },
    auth_functions.verify_session_token, auth_functions.delete_session_token,
    (req, res) => {
      res.status(200).send(
        {
          message: "User logged out"
        }
      );
    }
  );

};

