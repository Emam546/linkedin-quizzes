import { ReactNode } from "react";

export default function MainContainer({ children }: { children: ReactNode }) {
    return (
        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
    );
}
