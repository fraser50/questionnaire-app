import {Link} from "next/link";

export function NavEntry({name, href}) {
    return (
        <li className="naventry"><a href={href}>{name}</a></li>
    );
}

export function Navbar() {
    return (
        <ul className="navbar">
            <NavEntry name="Home" href="/" />
            <NavEntry name="Create" href="/createform" />
        </ul>
    )
}