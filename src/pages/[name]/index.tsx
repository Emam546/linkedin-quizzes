import { GetStaticPaths } from "next";

import Home from "./[id]";
export { getStaticProps } from "./[id]";
import { getAllDirs } from "@/utils";
export const getStaticPaths: GetStaticPaths = async () => {
    const dirs = await getAllDirs();

    return {
        paths: dirs.map((name) => ({
            params: {
                name,
            },
        })),
        fallback: false,
    };
};

export default Home;
