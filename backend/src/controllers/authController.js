import jwt from "jsonwebtoken";

export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return res.status(500).json({
      message: "Admin account is not configured on the server yet",
    });
  }

  const emailMatches = email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
  const passwordMatches = password === adminPassword;

  if (!emailMatches || !passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    { email: adminEmail, role: "admin" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

  res.json({ token, email: adminEmail });
}
