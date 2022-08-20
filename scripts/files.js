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

const readDir = async (baseDir) => {
  console.log("# " + baseDir);
  const assetDir = '../images/' + baseDir;

  await (() => {
    return new Promise((resolve, reject) => {
      fs.readdir(assetDir, async (err, dirs) => {
        for(let i = 0; i < dirs.length; i++) {
          const dir = dirs[i];
          const prefDir = assetDir + "/" + dir;
          const pngs = await pngFiles(prefDir);
          console.log("## " + dir)
          pngs.map(png => {
            console.log(" - " + png);
          });
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
