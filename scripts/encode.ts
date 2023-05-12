import { PNGCollectionEncoder, PngImage } from '@nouns/sdk';
import { promises as fs } from 'fs';
import { PNG } from 'pngjs';
import path from 'path';

// original nouns asset image data
const originalData = require("../src/image-original-nouns-data.json");

const DESTINATION = path.join(__dirname, '../src/image-local-data.json');

/**
 * Read a PNG image file and return a `PngImage` object.
 * @param path The path to the PNG file
 */
const readPngImage = async (path: string): Promise<PngImage> => {
  const buffer = await fs.readFile(path);
  const png = PNG.sync.read(buffer);

  return {
    width: png.width,
    height: png.height,
    rgbaAt: (x: number, y: number) => {
      const idx = (png.width * y + x) << 2;
      const [r, g, b, a] = [png.data[idx], png.data[idx + 1], png.data[idx + 2], png.data[idx + 3]];
      return {
        r,
        g,
        b,
        a,
      };
    },
  };
};

const encode = async () => {
  const encoder = new PNGCollectionEncoder(originalData.palette);

  const partfolders = ['images/0-backgrounds', 'images/3-heads', 'nouns_images/4-glasses'];

  for (const folder of partfolders) {
    const folderpath = path.join(__dirname, '../', folder);
    const files = await fs.readdir(folderpath);
    for (const file of files) {
      if (file.endsWith("png")) {
        const image = await readPngImage(path.join(folderpath, file));
        encoder.encodeImage(file.replace(/\.png$/, ''), image, folder.split("/")[1].replace(/^\d-/, ''));
      }
    }
  }

  // ヘッドとアクセサリは都道府県のサブフォルダごとに格納されている
  const partfolders2 = ['images/2-accessories', 'images/3-heads'];

  for (const folder of partfolders2) {
    const folderpath = path.join(__dirname, '../', folder);
    const subFolders = await fs.readdir(folderpath);
    for (const subfolder of subFolders) {
      const prefix = subfolder.match(/^\d{2}-/);  // サブフォルダは数字2桁+"-"で始まる 
      if (prefix) { 
        const files = await fs.readdir(folderpath + '/' + subfolder);
        for (const file of files) {
          if (file.endsWith("png")) {
            const image = await readPngImage(path.join(folderpath + '/' + subfolder, file));
            encoder.encodeImage(prefix[0] + file.replace(/\.png$/, ''), image, folder.split("/")[1].replace(/^\d-/, ''));
          }
        }
      }
    }
  }

  await fs.writeFile(
    DESTINATION,
    JSON.stringify(
      {
        bgcolors: ['d5d7e1', 'e1d7d5'],
        ...encoder.data,
      },
      null,
      2,
    ),
  );
};

const check_additional_palette_colors = () => {
  const original_palette: string[] = originalData.palette;
  const new_palette: string[] = require(DESTINATION).palette;
  const added = new_palette.filter(color => !original_palette.includes(color));
  if (added.length > 0) {
    console.log(`Found new colors in palette: [${added.toString()}]`);
    return 1;
  }
  return 0;
};

(async () => {
  await encode();
  const r = check_additional_palette_colors();
  process.exit(r);
})();
