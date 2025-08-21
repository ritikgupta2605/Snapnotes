const bcrypt = require('bcrypt');

// Function to hash and secure the user's password
async function securePassword(password) {
  const saltRounds = 10; // Number of salt rounds for hashing

  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  } catch (error) {
    throw error;
  }
}

module.exports = securePassword;
