import {
    IconDefinition,
    faFacebook,
    faLinkedin,
    faSkype,
    faSquareGithub,
    faTwitter,
    faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { faLocationPin, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { GetStaticProps } from "next";
export type Link = PersonalData["links"]["data"];
export interface Props {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    links: Link;
    address: string;
    desc?: string | null;
}
export type LinkType =
    | "youtube"
    | "facebook"
    | "linkedin"
    | "skype"
    | "github"
    | "twitter";
const icons: Record<LinkType, { icon: IconDefinition; className: string }> = {
    facebook: {
        icon: faFacebook,
        className: "facebook",
    },
    github: {
        icon: faSquareGithub,
        className: "github",
    },
    linkedin: {
        icon: faLinkedin,
        className: "linkedin",
    },
    skype: {
        icon: faSkype,
        className: "skype",
    },
    youtube: {
        icon: faYoutube,
        className: "youtube",
    },
    twitter: {
        icon: faTwitter,
        className: "twitter",
    },
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
            <FontAwesomeIcon
                icon={icons[mainLabel].icon}
                className={icons[mainLabel].className}
            />
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
                {desc && <div dangerouslySetInnerHTML={{ __html: desc }}></div>}
                <ul className="contact-info">
                    <li>
                        <FontAwesomeIcon icon={faLocationPin} />

                        {address}
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faClock} />
                        Business Hours: From 10:00 To 18:00
                    </li>
                    <li>
                        <FontAwesomeIcon icon={faPhone} />

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
    const res = await axios.get<RespondType<PersonalData>>(
        "https://cv-builder-tobe.onrender.com/api/v1/data",
        {
            params: {
                apikey: process.env.API_KEY,
            },
        }
    );
    const { info, links, paragraph } = res.data.data;
    return {
        email: info.data.email,
        phone: info.data.phone,
        links: links.data,
        address: info.data.address,
        firstName: info.data.firstName,
        lastName: info.data.lastName,
        desc:
            paragraph.data.find((val) => {
                return val.title == "Description";
            })?.desc || null,
    };
}
export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
    const props = await GetData();
    return {
        props,
    };
};
