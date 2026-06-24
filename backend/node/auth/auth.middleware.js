import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  
  console.log(
    "AUTH HEADER:",
    req.headers.authorization
  );
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`Decoded token: ${JSON.stringify(decoded)}`);
    req.user = decoded;
    console.log(`Decoded user from token: ${JSON.stringify(decoded)}`);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}