import axios from "axios";
import fs from "fs";
import { folderPath } from "@/utils/index";
import AdmZip from "adm-zip";
import path from "path";

const downloadAndExtractZip = async (url: string) => {
    try {
        // Download the zip file
        const response = await axios.get(url, { responseType: "arraybuffer" });

        // Save the downloaded zip file
        fs.writeFileSync(path.join(__dirname, "temp.zip"), response.data);

        // Extract the zip file
        const zip = new AdmZip("temp.zip");
        zip.extractAllTo(folderPath, true);

        console.log("Zip file downloaded and extracted successfully.");
    } catch (error: any) {
        console.error("Error:", error.message);
    } finally {
        // Clean up - delete the temporary zip file
        fs.unlinkSync("temp.zip");
    }
};
const owner = "Ebazhanov";
const repo = "linkedin-skill-assessments-quizzes";
const githubUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
// Usage
downloadAndExtractZip(githubUrl);
