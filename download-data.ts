import axios from "axios";
import fs from "fs";
import { folderPath } from "@/utils/index";
import unzipper from "unzipper";
import path from "path";

const downloadAndExtractZip = async (url: string) => {
    const filepath = path.join("temp.zip");
    try {
        // Download the zip file
        const response = await axios.get(url, { responseType: "stream" });

        // Save the downloaded zip file
        const writeStream = fs.createWriteStream(filepath);
        response.data.pipe(writeStream);
        writeStream.on("finish", () => {
            fs.createReadStream(filepath)
                .pipe(unzipper.Extract({ path: folderPath }))
                .on("close", () => {
                    console.log(
                        "Zip file downloaded and extracted successfully."
                    );
                    fs.unlinkSync(filepath); // Delete the downloaded zip file
                });
        });
    } catch (error: any) {
        console.error("Error:", error.message);
    }
};
const owner = "Ebazhanov";
const repo = "linkedin-skill-assessments-quizzes";
const githubUrl = `https://api.github.com/repos/${owner}/${repo}/contents`;
// Usage
downloadAndExtractZip(githubUrl);
