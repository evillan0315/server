import fs from 'fs';
import path from 'path';


const EXCLUDED_FOLDERS: string[] = [];
// Function to recursively get file tree
function getFileTree(dir: string): any[] {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir);
  return files
    .filter((file) => !EXCLUDED_FOLDERS.includes(file))
    .map((file) => {
      const filePath = path.join(dir, file);
      const isDirectory = fs.statSync(filePath).isDirectory();
      return {
        name: file,
        isDirectory,
        path: filePath,
      };
    });
}

// Get file tree by directory
export async function getFilesByDirectory(directory: string = ''): Promise<any> {
  try {
    
    if(directory){
    	return getFileTree(directory);
    }
    const directoryPath = path.join(process.cwd(), directory);
    return getFileTree(directoryPath);
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// Get file content
export async function getFileContent(filePath: string): Promise<any> {
  try {
    if (!filePath) return { error: "File path is required" };

    const fileExtension = path.extname(filePath).toLowerCase();
    const imageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"];

    if (imageExtensions.includes(fileExtension)) {
      const imageData = fs.readFileSync(filePath);
      return { content: imageData.toString("base64"), type: "image" };
    }

    const fileContent = await fs.promises.readFile(filePath, "utf-8");
    return { content: fileContent, type: "text" };
  } catch (error) {
    return { error: (error as Error).message };
  }
}

// Create or update a file
export async function createFile(filePath: string, content: string) {
  try {
    await fs.promises.writeFile(filePath, content, "utf-8");
    return { message: "File saved successfully", path: filePath };
  } catch (error) {
    return { error: (error as Error).message };
  }
}
