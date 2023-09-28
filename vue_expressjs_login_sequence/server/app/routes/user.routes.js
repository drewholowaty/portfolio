const { user_functions, auth_functions} = require("../middleware"); 

module.exports = (app) => {

  /* 
   * /user/update_user
   *
   * Middleware:
   *
   *
   * Request Body:
   * {
   *    preferred_zip_code: <zip code>
   * }
   *
   * Response Body:
   * {
   *
   * }
   *
   */
  app.post("/user/update_user",
    (req, res, next) => {

      const zip_code_regex = /^\d{5}(?:[-\s]\d{4})?$/;
      if (!zip_code_regex.test(req.body.preferred_zip_code)) {
        res.status(400).send({error: "Invalid zip code"});
        return;
      }

    }, 
    (req, res) => {

    }
  );

};

