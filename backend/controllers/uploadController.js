const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    const filename = req.file.filename;
    const inputPath = req.file.path;
    const optimizedDir = path.join(path.dirname(inputPath), 'optimized');
    if (!fs.existsSync(optimizedDir)) fs.mkdirSync(optimizedDir, { recursive: true });
    
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, ext);
    
    const outputPath = path.join(optimizedDir, `${baseName}.webp`);
    
    await sharp(inputPath)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    const thumbnailPath = path.join(optimizedDir, `${baseName}_thumb.webp`);
    await sharp(inputPath)
      .resize(400, 300, { fit: 'cover' })
      .webp({ quality: 60 })
      .toFile(thumbnailPath);
    
    const fileUrl = `/uploads/optimized/${baseName}.webp`;
    const thumbUrl = `/uploads/optimized/${baseName}_thumb.webp`;
    
    res.json({
      url: fileUrl,
      thumbnail: thumbUrl,
      original: `/uploads/${filename}`,
      filename
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const baseName = path.parse(filename).name;
    const dir = process.env.UPLOAD_PATH || path.join(__dirname, '..', 'uploads');
    
    const files = [
      path.join(dir, filename),
      path.join(dir, 'optimized', `${baseName}.webp`),
      path.join(dir, 'optimized', `${baseName}_thumb.webp`)
    ];
    
    files.forEach(f => { if (fs.existsSync(f)) fs.unlinkSync(f); });
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
