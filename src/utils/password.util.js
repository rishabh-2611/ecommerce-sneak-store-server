/** Import node modules */
import bcrypt from 'bcrypt'
const { randomBytes } = await import('node:crypto')

const encryptPassword = async function (password) {
  try {
    // todo : dont save salt in doc
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)
    return Promise.resolve({ salt, hash })
  } catch (err) {
    return Promise.reject(err)
  }
}

const generatePassword = () => {
  return randomBytes(16).toString('base64')
}

const validatePassword = async (password, hash) => {
  try {
    const response = bcrypt.compareSync(password, hash)
    return Promise.resolve(response)
  } catch (err) {
    return Promise.reject(err)
  }
}

export default {
  encryptPassword,
  generatePassword,
  validatePassword
}
