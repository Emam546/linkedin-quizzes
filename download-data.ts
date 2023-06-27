import axios from "axios";
import fs from "fs";
import path from "path";
import { folderPath } from "@/utils/index";

async function downloadRepository(dirPath = "") {
    const owner = "Ebazhanov";
    const repo = "linkedin-skill-assessments-quizzes";
    const url = `https://api.github.com/repos/${owner}/${repo}/contents`;
    fs.mkdirSync(dirPath, { recursive: true });
    try {
        console.log("start downloading");
        await downloadDirectory(url, dirPath);
        console.log("Repository downloaded successfully.");
    } catch (error: any) {
        console.error("Error downloading repository:", error.message);
    }
}

async function downloadDirectory(url: string, dirPath = "") {
    const response = await axios.get(url, {
        headers: {
            Accept: "application/vnd.github.v3+json",
        },
    });
    if (Array.isArray(response.data)) {
        for (const item of response.data) {
            if (item.type === "file") {
                await downloadFile(item.download_url, dirPath);
            } else if (item.type === "dir") {
                if (
                    ![".png", ".jpg", "quiz.md"].some((rest) =>
                        item.name.endsWith(rest)
                    )
                )
                    continue;
                const subDirPath = path.join(dirPath, item.name);
                console.log(path.join(dirPath, item.name));
                fs.mkdirSync(subDirPath, { recursive: true });
                await downloadDirectory(item.url, subDirPath);
            }
        }
    }
}

async function downloadFile(url: string, dirPath: string) {
    const response = await axios.get(url, {
        responseType: "stream",
    });

    const fileName = url.substring(url.lastIndexOf("/") + 1);
    const filePath = path.join(dirPath, fileName);
    response.data.pipe(fs.createWriteStream(filePath));
}

downloadRepository(folderPath);
