import { OAuth2Client } from 'google-auth-library';
import  User  from "../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Initialize Google Client using process.env
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---------------------------------------------------------
// Google Login/Register Controller
// ---------------------------------------------------------
export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body; // This is the ya29... token

    // 1. CALL GOOGLE USERINFO API INSTEAD OF VERIFYIDTOKEN
    const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!googleResponse.ok) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const payload = await googleResponse.json();
    
    // Google uses 'sub' as the unique ID
    const { sub: googleId, email, name } = payload;

    // 2. The rest of your logic remains the SAME
    let user = await User.findOne({ 
      $or: [{ googleId }, { email }] 
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      user = await User.create({ name, email, googleId });
    }

    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email , name : user.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export async function register(req, res) {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    passwordHash,
  });

  const token = jwt.sign(
    { userId: user._id, email: user.email , name : user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({token , user: { id: user._id, name: user.name, email: user.email } });
}

export async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user._id, email: user.email , name : user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({token , user: { id: user._id, name: user.name, email: user.email } });
}

export async function getMe(req, res) {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-passwordHash");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (error) {
    console.error("GetMe Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}