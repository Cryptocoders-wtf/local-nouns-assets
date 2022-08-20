const fs = require('fs');

["2-accessories", "3-heads"].forEach(baseDir => {
  const assetDir = '../images/' + baseDir;
  fs.readdir(assetDir, (err, dirs) => {
    dirs.forEach(dir => {
      const prefDir = assetDir + "/" + dir;
      fs.readdir(prefDir, (err, files) => {
        const pngs = files.filter(file => /png$/.test(file));
        console.log(baseDir, dir, pngs);
      });
    });
  });
});
