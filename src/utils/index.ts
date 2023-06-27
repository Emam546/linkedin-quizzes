import axios from "axios";
import fs from "fs/promises";
import path from "path";

export type Choice = [boolean, string];
export type Question = (string | Choice)[];

export function extractOption(string: string): Choice | false {
    const regex = /- (\[[x ]\])(.*)/;
    const match = string.match(regex);
    if (match && match.length > 2) {
        const checkbox = match[1] === "[ ]";
        const text = match[2];
        return [!checkbox, text];
    }
    return false;
}
export function getQuestionNum(data: string) {
    return data.split(/####\sQ\d+\./).length;
}
export function getTitle(data: string) {
    const questions = data.split(/####\sQ\d+\./);
    const title = questions.pop()!.slice(2) || "";
    return title;
}
export const folderPath = "public/linkedin";
export async function getAllDirs() {
    const dirs = (
        await fs.readdir(folderPath, {
            withFileTypes: true,
        })
    )
        .filter((dir) => dir.isDirectory())
        .map((file) => file.name);
    const dirsWithMDFiles = await Promise.all(
        dirs.map(async (dir) => {
            const files = await fs.readdir(path.join(folderPath, dir), {
                withFileTypes: true,
            });
            const hasMDFiles = files.some(
                (file) => file.isFile() && file.name == `${dir}-quiz.md`
            );
            return hasMDFiles;
        })
    );
    return dirs.filter((_, i) => dirsWithMDFiles[i]);
}
function replaceImageSources(markdownText: string, serverDomain: string) {
    // Regular expression to match image tags in Markdown
    const imageRegex = /!\[(.*?)\]\((.*?)\)/g;

    // Replace the image sources with the server domain
    const modifiedMarkdown = markdownText.replace(
        imageRegex,
        (match, altText, imagePath) => {
            // Check if the image path is a relative path
            if (!imagePath.startsWith("http") && !imagePath.startsWith("/")) {
                // Append the server domain to the relative path
                imagePath = `${serverDomain}/${imagePath}`;
            }
            // Return the modified image tag
            return `![${altText}](${imagePath})`;
        }
    );

    return modifiedMarkdown;
}
export function getData(
    data: string,
    index: number,
    prePath: string
): [Question, string] {
    const questions = data.split(/####\sQ\d+\./);
    const title = questions.shift()!.slice(2) || "";
    const quest = replaceImageSources(questions[index], prePath).split("\n");
    const result: Question = [quest[0].replace(/^####\sQ\d+\.\s/, "#### ")];
    let code = "";

    for (let i = 1; i < quest.length; i++) {
        const element = extractOption(quest[i]);
        if (element != false) {
            if (code) {
                result.push(code);
                code = "";
            }
            result.push(element);
        } else code += quest[i] + "\n";
    }
    if (code) result.push(code);

    return [result, title];
}
// export async function getFoldersFromGitHubRepo() {
//     const response = await axios.get(
//         `https://api.github.com/repos/Ebazhanov/linkedin-skill-assessments-quizzes/contents`
//     );
//     if (Array.isArray(response.data)) {
//         const folders = response.data
//             .filter((item: any) => item.type === "dir")
//             .map((item: any) => item.name);
//         return folders;
//     }
// }
