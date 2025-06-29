import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Uploads klasörünü oluştur
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Resim storage yapılandırması
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const imageDir = path.join(uploadsDir, 'images');
    if (!fs.existsSync(imageDir)) {
      fs.mkdirSync(imageDir, { recursive: true });
    }
    cb(null, imageDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `image-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Video storage yapılandırması
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const videoDir = path.join(uploadsDir, 'videos');
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `video-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Dosya filtresi
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Sadece resim ve video dosyaları yüklenebilir!'), false);
  }
};

// Multer yapılandırması
export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece resim dosyaları yüklenebilir!'), false);
    }
  }
});

export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Sadece video dosyaları yüklenebilir!'), false);
    }
  }
});

// URL doğrulama fonksiyonları
export function isValidImageUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const pathname = parsedUrl.pathname.toLowerCase();
    
    return validExtensions.some(ext => pathname.endsWith(ext)) || 
           pathname.includes('image') || 
           parsedUrl.searchParams.has('format');
  } catch {
    return false;
  }
}

export function isValidVideoUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // YouTube URL kontrolü
    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      return true;
    }
    
    // Vimeo URL kontrolü
    if (hostname.includes('vimeo.com')) {
      return true;
    }
    
    // Diğer video dosya uzantıları
    const validExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov'];
    const pathname = parsedUrl.pathname.toLowerCase();
    return validExtensions.some(ext => pathname.endsWith(ext));
  } catch {
    return false;
  }
}

// YouTube URL'lerini embed URL'ye dönüştürme
export function convertToEmbedUrl(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.toLowerCase();
    
    // YouTube URL dönüştürme
    if (hostname.includes('youtube.com')) {
      const videoId = parsedUrl.searchParams.get('v');
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (hostname.includes('youtu.be')) {
      const videoId = parsedUrl.pathname.slice(1);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Vimeo URL dönüştürme
    if (hostname.includes('vimeo.com')) {
      const videoId = parsedUrl.pathname.split('/').pop();
      if (videoId) {
        return `https://player.vimeo.com/video/${videoId}`;
      }
    }
    
    // Eğer dönüştürülemeyen bir URL ise, orijinal URL'yi döndür
    return url;
  } catch {
    return url;
  }
}