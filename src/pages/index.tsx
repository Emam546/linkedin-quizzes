import Image from "next/image";
import { Inter } from "next/font/google";
import Head from "next/head";
import Header from "@/components/header";
import Footer, { GetData } from "@/components/footer";
import { GetStaticProps, NextPage } from "next";
import { getAllDirs, getData } from "@/utils";
import Link from "next/link";
import classNames from "classnames";
import data from "@/data.json";
import MainContainer from "@/components/container";
import {
    Props as FooterProps,
    getStaticProps as FooterGetStaticProps,
} from "@/components/footer";
interface Test {
    title: string;
    desc: string;
}
interface Props extends FooterProps {
    tests: Test[];
}
function TestEle({ desc, title }: Test) {
    return (
        <div
            className={classNames(
                "bg-white rounded-lg p-6 shadow-md text-center",
                "flex flex-col items-stretch gap-y-4"
            )}
        >
            <div>
                <h3 className="text-xl font-semibold mb-2 capitalize">
                    {title.split("-").join(" ")}
                </h3>
                <p className="text-gray-600">{desc}</p>
            </div>
            <div className="flex items-end flex-1 pt-4">
                <Link
                    href={`./${title}`}
                    className={classNames(
                        "mt-auto block w-fit px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 ease-in-out",
                        "mx-auto sm:mr-auto"
                    )}
                >
                    Start Test
                </Link>
            </div>
        </div>
    );
}
const Home: NextPage<Props> = ({ tests, ...info }) => {
    return (
        <>
            <Head>
                <title>LinkedIn Assignments</title>
                <meta
                    name="description"
                    content="LinkedIn Exams IT: An online test platform by Mahmoud Imam. Test your knowledge with real LinkedIn assignments. Visit emam546.github.io for more details."
                />
            </Head>

            <Header />
            <MainContainer>
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Information</h2>
                    LinkedIn Exams IT: An online test platform by Mahmoud Imam.
                    Test your knowledge with real LinkedIn assignments. Visit{" "}
                    <a href="https://emam546.github.io">
                        emam546.github.io
                    </a>{" "}
                    for more details.
                </section>
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Tests</h2>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {tests.map((data) => {
                            return (
                                <TestEle
                                    {...data}
                                    key={data.title}
                                />
                            );
                        })}
                        {/* Add more test cards as needed */}
                    </div>
                    <div className="mt-6 text-center">
                        {/* <a
                            href="#"
                            className="text-blue-500 hover:text-blue-700"
                        >
                            Show More
                        </a> */}
                    </div>
                </section>
            </MainContainer>
            <Footer {...info} />
        </>
    );
};
type Technologies = keyof (typeof data)["descriptions"];
export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
    const questions = (await getAllDirs()) as Technologies[];
    const footerData = await GetData();
    return {
        props: {
            tests: questions.map((val) => ({
                title: val,
                desc: data["descriptions"][val] || "",
            })),
            ...footerData,
        },
    };
};
export default Home;
