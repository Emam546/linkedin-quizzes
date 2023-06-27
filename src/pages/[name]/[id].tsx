import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import fs from "fs/promises";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import style from "./style.module.scss";
import {
    Choice,
    getAllDirs,
    folderPath,
    Question,
    getAllData,
} from "@/utils";
import Timer from "@/components/timer";
import classNames from "classnames";
import { useRouter } from "next/router";
import path from "path";

export interface Props {
    question: Question;
    length: number;
    title: string;
    index: number;
    name: string;
}
function generateQuestion(html: string, val: number) {
    return `
            <label>
                <input
                    type="radio"
                    name="choice"
                    value="${val}"
                    data-value="${val}"
                    required
                />
                ${html}
            </label>
    `;
}
type StateType = "correct" | "error" | "";
function getHtml(string: string) {
    return marked.parse(string, {
        mangle: false,
        headerIds: false,
        headerPrefix: null,
    } as any) as any;
}
const Page: NextPage<Props> = ({ question, length, index, name, title }) => {
    const choices: Choice[] = question.filter(
        (val) => typeof val != "string"
    ) as Choice[];
    const formRef = useRef<HTMLFormElement>(null);
    const [state, setState] = useState<StateType>("");
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState(new Array(length));
    const router = useRouter();

    const html = useMemo(() => {
        let i = 0;
        return question
            .map((val) => {
                if (typeof val == "string") return getHtml(val);
                else return generateQuestion(getHtml(val[1]), i++);
            })
            .join("\n");
    }, [question]);
    if (typeof html != "string") throw new Error("undefined error");
    if (choices.length == 0) throw new Error("undefined choices");

    if (!choices.some(([state]) => state)) {
        console.error("no answer");
        choices[0][0] = true;
        // throw new Error("there is no correct answer");
    }
    useEffect(() => {
        const answer = router.query.answer as string | undefined;
        if (typeof answer == "string") {
            const res = formRef.current!.querySelector<HTMLInputElement>(
                `input[value='${+answer}']`
            );
            if (res) {
                res.checked = true;
                onSubmit();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.query.answer]);
    useEffect(() => {
        setState("");
        setSubmitted(false);
    }, [question]);
    useEffect(() => {
        setResults(new Array(length));
    }, [length, name]);
    const navigateToNextPage = (index: number) => {
        if (index >= length) return router.push("/");
        const currentPath = router.asPath.split("?")[0]; // Get the current path
        const newPath = currentPath.replace(/\/(\d+)$/, () => "") + `/${index}`;
        router.push(newPath); // Navigate to the new path
    };
    function onSubmit(e?: any) {
        if (e) e.preventDefault();
        if (submitted) {
            return navigateToNextPage(index + 1);
        }
        const form = formRef.current!;
        const formData = new FormData(form);
        const val = formData.get("choice") as string;
        if (typeof val != "string" && val != null)
            throw new Error("undefined Question type");

        const correct = choices[parseInt(val)]?.[0];

        setState(correct ? "correct" : "error");
        if (!correct) {
            const i = choices.findIndex(([state]) => state);
            const inputs = form.querySelectorAll<HTMLLabelElement>(
                `label:has(input[value='${i}'])`
            );
            if (!inputs.length) throw new Error("undefined answer");
            inputs.forEach((input) => {
                input.classList.add(style.correct);
                input.style.color = "green";
            });
        }
        form.querySelectorAll<HTMLInputElement>("input").forEach((input) => {
            input.disabled = true;
        });
        setResults((pre) => {
            pre[index] = correct;
            return pre;
        });
        setSubmitted(true);
    }
    return (
        <form
            onSubmit={onSubmit}
            ref={formRef}
            className="bg-gray-100 min-h-screen flex items-stretch justify-between flex-col gap-y-4"
        >
            <div className="container mx-auto px-4 pt-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-semibold text-center">
                        {title} Choice Questions
                    </h1>
                    <p className="text-center text-gray-600">
                        Question {index + 1} of {length}
                    </p>
                </div>
                <div
                    className={classNames(style.question, {
                        [style.correct]: state == "correct",
                        [style.error]: state == "error",
                    })}
                    dangerouslySetInnerHTML={{ __html: html }}
                ></div>
            </div>
            <div className="container mx-auto px-4 pb-12">
                <div className="flex  justify-between items-stretch xs:items-center mt-8 flex-col-reverse gap-y-3 xs:flex-row ">
                    {index > 0 ? (
                        <button
                            type="button"
                            onClick={() => navigateToNextPage(index - 1)}
                            className="block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 ease-in-out"
                        >
                            Previous
                        </button>
                    ) : (
                        <div></div>
                    )}

                    <button
                        type="submit"
                        className="block  px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 ease-in-out"
                    >
                        {submitted
                            ? index == length - 1
                                ? "Finished"
                                : "Next"
                            : "Submit"}
                    </button>
                </div>
                <div className="mt-8 flex items-center justify-between flex-col gap-y-3 xs:flex-row">
                    <Timer
                        seconds={90}
                        redTime={30}
                        state={!submitted}
                        onEnd={() => {
                            if (!submitted) onSubmit();
                        }}
                    />
                    <p className="text-lg">
                        Questions: {index + 1}/{length}
                    </p>
                </div>
            </div>
        </form>
    );
};
async function getQuestionLength(name: string) {
    const data = await fs.readFile(
        path.join(folderPath, name, `${name}-quiz.md`)
    );
    return getAllData(data.toString(), "")[0].length;
}
export const getStaticPaths: GetStaticPaths = async (ctx) => {
    const dirs = await getAllDirs();
    const questions: {
        params: {
            name: string;
            id: string;
        };
    }[] = [];
    for (const name of dirs) {
        const res = await getQuestionLength(name);
        for (let i = 0; i < res; i++)
            questions.push({
                params: {
                    id: i.toString(),
                    name,
                },
            });
    }

    return {
        paths: questions,
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
    const name = ctx!.params!.name as string;
    const id = parseInt(ctx!.params!.id as string) || 0;
    const data = await fs.readFile(
        path.join(folderPath, name, `${name}-quiz.md`)
    );
    const [questions, title] = getAllData(data.toString(), `../../linkedin/${name}`);
    return {
        props: {
            question: questions[id],
            title,
            length: questions.length,
            index: id,
            name,
        },
    };
};

export default Page;
