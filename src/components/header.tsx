import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
export function Elem({
    children,
    href = "#",
}: {
    children: string;
    href?: string;
}) {
    const state = useRouter().route == href;
    return (
        <Link
            href={href}
            className={classNames({
                "p-2 lg:px-4 md:mx-2 text-gray-300 rounded hover:bg-gray-100 hover:text-black transition-colors duration-300":
                    !state,
                "p-2 lg:px-4 md:mx-2 text-white rounded bg-blue-600": state,
            })}
        >
            {children}
        </Link>
    );
}
export default function Header() {
    const [state, setSTate] = useState(false);
    useEffect(() => {
        window.addEventListener("resize", () => {
            setSTate(false);
        });
    }, []);
    return (
        <header className="bg-blue-600 py-2 md:py-4">
            <div className="container px-4 mx-auto flex items-center">
                <div className="flex justify-between items-center">
                    <a
                        href="https://github.com/Emam546"
                        className="font-bold text-xl text-white"
                    >
                        Linkedin Courses
                    </a>
                </div>
                <div
                    className="flex flex-row ml-auto mt-0"
                    id="navbar-collapse"
                >
                    <Elem href="/">Home</Elem>
                    <Elem href="/about">About</Elem>
                    <Elem href="/contact">Contact</Elem>
                </div>
            </div>
        </header>
    );
}
