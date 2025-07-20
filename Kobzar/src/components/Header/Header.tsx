import { logo } from "@/static/icon";
import Image from "next/image";

import "./Header.scss";

export default function Header() {
  return (
    <header className="header">
      <Image className="header_image" src={logo} alt="logo" />
    </header>
  );
}
