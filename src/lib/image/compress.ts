import imageCompression from 'browser-image-compression'

interface CompressOptions {
  maxSizeMB?: number
  maxWidthOrHeight?: number
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  const { maxSizeMB = 0.8, maxWidthOrHeight = 1920 } = options

  return imageCompression(file, {
    maxSizeMB,
    maxWidthOrHeight,
    useWebWorker: true,
    fileType: file.type as 'image/jpeg' | 'image/png' | 'image/webp',
  })
}
