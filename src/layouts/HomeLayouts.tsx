import Header from "@/components/ui/Navigation/Header";
import { Outlet } from "react-router-dom";

const HomeLayouts = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    );
};

export default HomeLayouts;
