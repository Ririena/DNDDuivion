import * as React from "react";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Link,
    Button,
} from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarGroup, AvatarIcon } from "@nextui-org/avatar";
const Header = () => {
    return (
        <>
            {/* First Navbar */}
            <Navbar position="static" className="bg-blue-600 text-white">
                <NavbarBrand>
                    <p className="font-bold text-inherit">D&DDuivion</p>
                </NavbarBrand>
                <NavbarContent
                    className="hidden sm:flex gap-4"
                    justify="center"
                >
                    <NavbarItem>
                        <Link className="text-white" href="#">
                            Collections
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className="text-white" href="/campaign">
                            Campaign List
                        </Link>
                    </NavbarItem>
                    <NavbarItem>
                        <Link className="text-white" href="#">
                            Integrations
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem className="hidden lg:flex">
                        <Link href="/login" className="text-white">
                            Login
                        </Link>
                    </NavbarItem>
                    <Divider orientation="vertical" className="bg-white h-6" />
                    <NavbarItem>
                        <Avatar size="sm" />
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </>
    );
};

export default Header;
