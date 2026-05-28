import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'path'
import fs from 'fs'

const execAsync = promisify(exec)

export async function processFile(filePath, options = {}) {
  const ext = path.extname(filePath).toLowerCase()

  if (ext === '.mobi' && options.convertMobi) {
    return await mobiToEpub(filePath)
  }

  if (ext === '.pdf' && options.cropPdf) {
    return await cropPdfMargins(filePath)
  }

  return filePath
}

async function mobiToEpub(inputPath) {
  const outputPath = inputPath.replace(/\.mobi$/i, '.epub')
  await execAsync(`ebook-convert "${inputPath}" "${outputPath}"`)
  fs.unlinkSync(inputPath)
  return outputPath
}

async function cropPdfMargins(inputPath) {
  const outputPath = inputPath.replace(/\.pdf$/i, '_cropped.pdf')
  try {
    await execAsync(`pdf-crop-margins -p 0 -a -5 "${inputPath}" -o "${outputPath}"`)
    return outputPath
  } catch {
    console.warn('Crop de PDF falhou, a usar ficheiro original')
    return inputPath
  }
}