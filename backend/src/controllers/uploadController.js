import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

function uploadBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "broom-store" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

export async function uploadImages(req, res) {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  const results = await Promise.all(files.map((f) => uploadBuffer(f.buffer)));

  const images = results.map((r) => ({
    url: r.secure_url,
    publicId: r.public_id,
  }));

  res.status(201).json({ images });
}
