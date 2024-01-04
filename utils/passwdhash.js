const bcrypt = require("bcrypt");

async function generateHashedPassword(password) {
  // Generate a salt
  const saltRounds = 10; // Adjust the number of rounds as needed
  const salt = await bcrypt.genSalt(saltRounds);

  // Hash the password with the generated salt
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

module.exports = {generateHashedPassword}