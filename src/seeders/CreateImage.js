import fs from "fs/promises";
import path from "path";

export async function createImages() {
  const publicPath = path.join(process.cwd(), "public");
  const sourcePath = path.join(process.cwd(), "source-images");
  const imagesPath = path.join(publicPath, "images");

  // ساخت public/images
  await fs.mkdir(imagesPath, { recursive: true });

  for (let i = 1; i <= 200; i++) {
    // ساخت پوشه public/images/1 و ...
    const folderPath = path.join(imagesPath, String(i));

    await fs.mkdir(folderPath, { recursive: true });

    // مسیر عکس اصلی
    const sourceFile = path.join(sourcePath, `${i}.jfif`);

    // مسیر مقصد
    const destinationFile = path.join(folderPath, `${i}.jfif`);

    // کپی عکس
    await fs.copyFile(sourceFile, destinationFile);

    console.log(`Copied: ${i}.jfif`);
  }

  console.log("✅ تمام 200 عکس کپی شدند.");
}

// createImages();