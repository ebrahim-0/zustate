import fs from "fs";
import path from "path";

// Function to locate the `.zustaterc.json` file
export const getZustateConfig = (): { debug: boolean } => {
  const configFileName = ".zustaterc.json";
  const configFilePath = path.resolve(process.cwd(), configFileName);

  // Check if the file exists
  if (fs.existsSync(configFilePath)) {
    try {
      const configContent = fs.readFileSync(configFilePath, "utf-8");
      const config = JSON.parse(configContent);
      return config;
    } catch (error: any) {
      console.error(
        `Error reading or parsing ${configFileName}:`,
        error.message
      );
    }
  } else {
    console.warn(`${configFileName} not found in the project.`);
  }

  // Default configuration
  return {
    debug: false, // Default value
  };
};