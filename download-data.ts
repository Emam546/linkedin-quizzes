import axios from "axios";
import fs from "fs";
import path from "path";
import { folderPath } from "@/utils/index";
import dotenv from "dotenv";
dotenv.config();

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
    const permissions = response.data.permissions;
    const isPermissionGranted = permissions.admin || permissions.push;
    if (!isPermissionGranted)
        return console.log("no permission", path.join(dirPath));
    if (Array.isArray(response.data)) {
        for (const item of response.data) {
            console.log(path.join(dirPath, item.name));
            if (item.type === "file") {
                await downloadFile(item.download_url, dirPath);
            } else if (item.type === "dir") {
                if (!(item.name as string).endsWith("quiz.md")) continue;
                const subDirPath = path.join(dirPath, item.name);
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
const isGithubActions = process.env.GITHUB_ACTIONS || false;

downloadRepository(path.join(__dirname, folderPath));
