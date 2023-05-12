const fs = require('fs');

const pngFiles = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        console.log(err);
        return reject([]);
      }
      const pngs = files.filter(file => /png$/.test(file));
      resolve(pngs);
      // console.log(dir, pngs);
    });
  });
};

const image = (file, baseDir, dir) => {
  return `![${file}](./${baseDir}/${dir}/${file})`;
}
const readDir = async (baseDir) => {
  console.log("# " + baseDir);
  const assetDir = './images/' + baseDir;

  await (() => {
    return new Promise((resolve, reject) => {
      fs.readdir(assetDir, async (err, dirs) => {
        for (let i = 0; i < dirs.length; i++) {
          const dir = dirs[i];
          if (dir.match(/^\d{2}-/)) {
            const prefDir = assetDir + "/" + dir;
            const pngs = await pngFiles(prefDir);
            console.log("## " + dir)
            pngs.map(png => {
              console.log(" - " + png + " " + image(png, baseDir, dir));
            });
          }
        }
        resolve()
      });
    })
  })()
}

const main = async () => {
  await readDir("2-accessories");
  await readDir("3-heads");
};

main();
