import { Data, RespondType } from "@/info";
import axios from "axios";
import { GetStaticProps } from "next";
export type Link = Data["links"]["data"];
export interface Props {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    links: Link;
    address: string;
    desc: string;
}
export type LinkType =
    | "youtube"
    | "facebook"
    | "linkedin"
    | "skype"
    | "github"
    | "twitter";
const icons: Record<LinkType, string> = {
    facebook: "fa-brands fa-facebook-f facebook",
    github: "fa-brands fa-square-github github",
    linkedin: "fa-brands fa-linkedin linkedin",
    skype: "fa-brands fa-skype skype",
    youtube: "fa-brands fa-youtube youtube",
    twitter: "fa-brands fa-twitter twitter",
};

export function getLink(val: string): LinkType | undefined {
    return Object.keys(icons).find(
        (v) => v.includes(val) || val.includes(v)
    ) as LinkType;
}
export function isValidLinkType(val: string): val is LinkType {
    return getLink(val) != undefined;
}
export function LinkElem({ label, link }: Link[0]) {
    const mainLabel = getLink(label);
    if (!mainLabel) return null;
    return (
        <a href={link}>
            <i className={icons[mainLabel]}></i>
        </a>
    );
}
export default function Footer({
    email,
    lastName,
    links,
    address,
    phone,
    firstName: firstname,
    desc,
}: Props) {
    return (
        <footer className="footer">
            <div className="container grid grid-cols-1 md:grid-cols-3 gap-5 py-10 px-3">
                <div className="social-media">
                    <h1 className="text-3xl font-semibold mb-4">
                        {firstname} {lastName}
                    </h1>
                    <div className="social-icons">
                        {links.map((val, i) => (
                            <LinkElem
                                {...val}
                                key={i}
                            />
                        ))}
                    </div>
                </div>
                <div dangerouslySetInnerHTML={{ __html: desc }}></div>
                <ul className="contact-info">
                    <li>
                        <i className="fa-solid fa-location-pin"></i>
                        {address}
                    </li>
                    <li>
                        <i className="fa-regular fa-clock"></i>
                        Business Hours: From 10:00 To 18:00
                    </li>
                    <li>
                        <i className="fa-solid fa-phone"></i>
                        {phone}
                    </li>
                </ul>
            </div>
            <div className="contact-info capitalize">
                <h3>
                    Made By {firstname} {lastName}
                </h3>
            </div>
        </footer>
    );
}
export async function GetData(): Promise<Props> {
    const res = await axios.get<RespondType<Data>>(
        "https://cv-builder-tobe.onrender.com/api/v1/data",
        {
            params: {
                apikey: process.env.API_KEY,
            },
        }
    );
    const { info, links, professional } = res.data.data;
    return {
        email: info.data.email,
        phone: info.data.phone,
        links: links.data,
        address: info.data.address,
        firstName: info.data.firstName,
        lastName: info.data.lastName,
        desc: professional.data,
    };
}
export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
    const props = await GetData();
    return {
        props,
    };
};
