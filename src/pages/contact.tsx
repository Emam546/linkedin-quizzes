import Head from "next/head";
import Header from "@/components/header";
import Footer from "@/components/footer";
import MainContainer from "@/components/container";
import { NextPage } from "next";
import { Props } from "@/components/footer";
export { getStaticProps } from "@/components/footer";
const Home: NextPage<Props> = (info) => {
    function onSubmit() {}

    return (
        <>
            <Head>
                <title>Linked in Assignments</title>
            </Head>
            <Header />
            <MainContainer>
                <div className="container mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">
                                Send Us a Message
                            </h3>
                            <form
                                action="https://api.web3forms.com/submit"
                                method="post"
                            >
                                <div className="mb-4">
                                    <label
                                        htmlFor="name"
                                        className="block text-lg font-semibold mb-2"
                                    >
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <input
                                    type="hidden"
                                    name="access_key"
                                    value={process.env.NEXT_PUBLIC_ACCESS_KEY}
                                />
                                <div className="mb-4">
                                    <label
                                        htmlFor="email"
                                        className="block text-lg font-semibold mb-2"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="subject"
                                        className="block text-lg font-semibold mb-2"
                                    >
                                        Subject
                                    </label>
                                    <input
                                        type="subject"
                                        id="subject"
                                        className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label
                                        htmlFor="message"
                                        className="block text-lg font-semibold mb-2"
                                    >
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        rows={4}
                                        defaultValue={""}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 ease-in-out"
                                >
                                    Send
                                </button>
                            </form>
                        </div>
                        <div>
                            <h3 className="text-2xl font-semibold mb-4">
                                Contact Information
                            </h3>
                            <p className="text-lg">Email: {info.email}</p>
                            <p className="text-lg">Phone: {info.phone}</p>
                            <p className="text-lg">{info.address}</p>
                        </div>
                    </div>
                </div>
            </MainContainer>
            <Footer {...info} />
        </>
    );
};

export default Home;
