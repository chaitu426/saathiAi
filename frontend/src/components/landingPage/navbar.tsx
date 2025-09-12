import { NAV_LINKS } from "@/constants/links";
import { Link } from "react-router-dom";
import Icons from "../global/icons";
import Wrapper from "../global/wrapper";
import MobileMenu from "./mobile-menu";
import AuthActions from "../layout/authAction";

const Navbar = () => {
  return (
    <header className="sticky top-0 w-full h-16 bg-background/80 backdrop-blur-sm z-50">
      <Wrapper className="h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Icons.icon className="w-6" />
            <span className="text-xl font-semibold hidden lg:block">Vetra</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link, index) => (
              <Link key={index} to={link.href} className="text-sm font-medium">
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth + Mobile Menu */}
          <div className="flex items-center gap-4">
            <AuthActions />
            <MobileMenu />
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Navbar;
