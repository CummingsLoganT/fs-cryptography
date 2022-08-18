const bcrypt = require('bcryptjs')

const users = []


module.exports = {


  /*
  1. make sure username exists in database
    if it does, compare password being used. this will use bcrypt method
      if it does, send a copy of the user object back to front-end
  2. delete hashed password before it goes front-end
   */
    login: (req, res) => {
      // console.log('Logging In User')
      // console.log(req.body)
      const { username, password } = req.body
      for (let i = 0; i < users.length; i++) {

        // if the username entered into the system matches a username inthe users databse
        if (users[i].username === username) {
          
        
          //compare password
          //use passwordHash we created in register

          const comparison = bcrypt.compareSync(password , users[i].passwordHash); 
          // compare takes in two arguments

          // if comparison is truthy delete the hashed password. make a copy of the object without the hash password and display to user
          
          if (comparison) {
            let displayUser = {...users[i]}
            
            delete displayUser.passwordHash; // deletes the iteration copy of the passwordHash
            return res.status(200).send(users[i]);

          }
          
          
          
          res.status(200).send(users[i])
        }
      }
      res.status(400).send("User not found.")
    },














    register: (req, res) => {
      // console.log('Registering User')
      // console.log(req.body)

      //Create variables to hold in the input from the user
      //This can be done with destructuring
      const {username, email, firstName, lastName, password} = req.body;

      //Create a salt variable to add extra security to the password
      const salt = bcrypt.genSaltSync(4); //genSaltSync() takes in one number argument

      //Hash the password with the salt
      const passwordHash = bcrypt.hashSync(password, salt) //hashSync() takes two arguments

      //create a new object to store all the user information that we will push into the database

      let newUser = {
        username,
        email,
        firstName,
        lastName,
        passwordHash
      }

      //We have to push the new user to the user array
      users.push(newUser)

      let returnUser = {...users}

      //We have to prevent the passwordHash from being sent to the client. 
      delete returnUser.passwordHash;

      //Display the user information back to the client
      res.status(200).send(returnUser)

      console.log(newUser)
      console.log(returnUser)
    }
}