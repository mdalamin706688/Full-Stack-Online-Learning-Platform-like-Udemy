import User from '../models/user'
import { hashPassword, comparePassword } from '../utils/auth'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password } = req.body
    //validation
    if (!name) {
      return res.status(400).send('Name is required')
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .send(
          'Password is required and should have 1 digit, letter and special characters.'
        )
    }
    let userExist = await User.findOne({ email }).exec()

    if (userExist) {
      return res.status(400).send('Email already used by another user')
    }

    //hash password
    const hashedPassword = await hashPassword(password)

    //register
    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    console.log('saved user', user)
    return res.json({ ok: true })
  } catch {
    console.log(err)
    return res.status(400).send('Error. Try again.')
  }
}

export const login = async (req, res) => {
  try {
    console.log(req.body); 
    const { email, password } = req.body
    // check if our database has user with that email
    const user = await User.findOne({ email }).exec()
    if (!user) {
      return res.status(400).send('No user found')
    }
    //check password
    const match = await comparePassword(user.password, password)

    //create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // return user and token to client, exclude hashed password
    user.password = undefined;
    // send token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      //secure: true, //only works on https
    });

    res.json(user);

  } catch (err) {
    console.log(err)
    return res.status(400).send('Error. Try again.')
  }
}

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({message: "Logout Success"});
  } catch(err) {
    console.log(err); 
  }
}

export const currentUser = async(req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec()
    console.log("Current User", user)
    return res.json({ok: true})
  } catch( err) {
    console.log(err)
  }
}
 