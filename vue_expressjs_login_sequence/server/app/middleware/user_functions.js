const db = require("../db_objects.js").db;

/*
 * create_new_user
 *
 * Creates a new user and adds them to the database.
 */
const create_new_user = async (req, res, next) => {
  // Save the new user to the database, if duplicate, return 409 conflict code
  try {
    const timestamp = new Date();
    const result = await db.query(
      "INSERT INTO users (name, email, phone_number, preferred_zip_code, created_at_timestamp) VALUES ($1, $2, $3, $4, $5) RETURNING user_id", 
      [req.body.name, req.body.email, req.body.phone_number, req.body.preferred_zip_code, timestamp]
    );
    res.locals.user_id = result.rows[0].user_id.toString();
  } catch (err) {
    if (err.code === "23505") {
      console.error(err);
      res.status(409).send({error: "User already exists"});
    } else {
      console.error(err);
      res.status(500).send({error: "Internal Server Error"});
    }
    return;
  }   

  next();
};

/*
 * read_user_email_phone
 *
 * Reads user based on email or phone from database
 */
const read_user_email_or_phone = async (req, res, next) => {
  try{
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 OR phone_number = $2",
      [res.locals.email, res.locals.phone_number]
    );

    if(result.rowCount === 0) {
      // sends uuid generated in auth_functions.generate_token
      res.status(404).send(
        {
          message: "User does not exist",
          auth_type: res.locals.auth_type
        }
      );
      return;
    }

    res.locals.user_id = result.rows[0].user_id.toString();
  } catch(err) {
    console.error(err);
    res.status(500).send({error: "Internal Server Error"});
    return;
  } 

  next();
};

/*
 * read_user_id
 *
 * reads user based on ID from database
 */
const read_user_id = async (req, res, next) => {

};

/*
 * update_user
 *
 * updates user based on ID from database
 */
const update_user = async (req, res, next) => {

};

/*
 * delete_user
 *
 * deletes user based on ID from database
 */
const delete_user = async (req, res, next) => {

};

const user_functions = {
  create_new_user,
  read_user_email_or_phone,
  read_user_id,
  update_user,
  delete_user
};

module.exports = user_functions;

