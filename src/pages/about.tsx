import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MainContainer from "@/components/container";
import { Props } from "@/components/footer";
import { NextPage } from "next";
export { getStaticProps } from "@/components/footer";
const Page: NextPage<Props> = (info) => {
    const fullName = `${info.firstName} ${info.lastName}`;
    return (
        <>
            <Head>
                <title>linked in Assignments</title>
            </Head>
            <Header />
            <MainContainer>
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                        About
                    </h2>
                    <div>
                        <h1>About LinkedIn Exams (by {fullName})</h1>
                        <p>
                            LinkedIn Exams, developed by solo developer{" "}
                            {fullName}, is an innovative client-side application
                            that offers a convenient way for professionals to
                            test their knowledge and skills based on LinkedIn
                            assignments. As an aspiring developer and technology
                            enthusiast, {fullName} has curated a collection of
                            assignments from LinkedIn and transformed them into
                            an engaging online test format.
                        </p>
                        <p>
                            LinkedIn Exams provides professionals with an
                            opportunity to assess their expertise across various
                            industries and fields. The client-side app offers a
                            seamless user experience without the need for login
                            or sign-up.
                        </p>

                        <h2>Key Features of LinkedIn Exams:</h2>
                        <ol className="pl-4">
                            <li>
                                Curated LinkedIn Assignments: LinkedIn Exams
                                offers a thoughtfully curated collection of
                                assignments sourced from LinkedIn, enabling
                                professionals to test their understanding of
                                industry-specific topics.
                            </li>
                            <li>
                                Interactive Online Testing: The application
                                provides an interactive and engaging testing
                                experience, allowing professionals to apply
                                their knowledge and skills to real-world
                                scenarios.
                            </li>
                            <li>
                                Self-Paced Learning: Professionals can utilize
                                LinkedIn Exams at their own pace, tailoring
                                their learning experience to their specific
                                needs and schedule.
                            </li>
                            <li>
                                Developer{"'"}s Commitment: LinkedIn Exams is
                                passionately developed and maintained by Mahmoud
                                Imam, an aspiring developer dedicated to
                                providing professionals with a valuable resource
                                to enhance their skills and knowledge.
                            </li>
                        </ol>

                        <p>
                            With LinkedIn Exams, professionals can challenge
                            themselves, assess their abilities, and gain
                            insights into their strengths and areas for
                            improvement. Visit Mahmoud Imam{"'"}s personal links
                            above to explore the application and learn more
                            about his work.
                        </p>
                    </div>
                </section>
            </MainContainer>
            <Footer {...info} />
        </>
    );
};
export default Page;
