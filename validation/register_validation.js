const {body} = require('express-validator');

function userValidation() {
    return [
      // Validate email format
      body('email').isEmail().withMessage('Must be a valid hcmut email address.').custom((value)=>{
          return value.endsWith("hcmut.edu.vn")
      }).withMessage('Must be a valid hcmut email address.'),
      // Validate password length
      body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long.'),
      // Validate passwords match
      body('passwordConfirm').custom((value, { req }) => {
        if (value === req.body.password) {
          return true;
        } else {
          return false;
        }
      }).withMessage('Password do not match. Try again!')
    ];
};

module.exports=userValidation;