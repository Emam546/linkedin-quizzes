import React from "react";

export default function Footer() {
    return (
        <footer className="bg-blue-600 py-4b">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Contact Us
                        </h3>
                        <p className="mt-2 text-white">
                            Email: example@example.com
                        </p>
                        <p className="text-white">Phone: 123-456-7890</p>
                    </div>
                    <div>
                        <a
                            href="#"
                            className="text-white hover:text-gray-300 ml-4"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="#"
                            className="text-white hover:text-gray-300 ml-4"
                        >
                            Twitter
                        </a>
                        <a
                            href="#"
                            className="text-white hover:text-gray-300 ml-4"
                        >
                            Facebook
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
