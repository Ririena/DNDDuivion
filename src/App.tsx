import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./page/Home";
import HomeLayouts from "./layouts/HomeLayouts";
import Login from "./page/Auth/Login";
import Register from "./page/Auth/Register";
import Campaign from "./page/Campaign";
import CreateCampaign from "./page/Function/CreateCampaign";
import CampaignId from "./page/CampaignId";
import CreateCharacter from "./page/Function/CreateCharacter";
function App() {
    const withLayout = (LayoutComponent: any, ChildComponent: any) => {
        return (props: any) => (
            <LayoutComponent>
                <ChildComponent {...props}></ChildComponent>
            </LayoutComponent>
        );
    };

    const HomeWithLayout = withLayout(HomeLayouts, Home);

    return (
        <>
            <Routes>
                <Route path="/" element={<HomeWithLayout />}>
                    <Route index element={<Home />} />
                    <Route path="campaign">
                        <Route index element={<Campaign />} />
                        <Route path=":campaignId">
                            <Route index element={<CampaignId />} />
                            <Route path="create/character" element={<CreateCharacter/>}/>
                        </Route>
                    </Route>
                    <Route
                        path="create/campaign"
                        element={<CreateCampaign />}
                    />
                </Route>
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
            </Routes>
        </>
    );
}

export default App;
