import {
    Card as CardNextui,
    CardHeader,
    CardFooter,
    CardBody,
    Divider,
    Spacer,
} from "@nextui-org/react";
import { supabase } from "@/utils/supabase";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Campaign = () => {
    const [campaignData, setCampaignData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function init() {
            try {
                const { data, error } = await supabase
                    .from("campaign")
                    .select("*");

                if (error) {
                    console.error(error.message);
                } else {
                    const updatedData = await Promise.all(
                        data.map(async (campaign) => {
                            const { data: imageData } = await supabase.storage
                                .from("picture/images")
                                .getPublicUrl(campaign.photo_campaign);

                            return {
                                ...campaign,
                                imageUrl: imageData.publicUrl,
                            };
                        })
                    );

                    setCampaignData(updatedData);
                }
            } catch (error) {
                console.error(error);
            }
        }
        init();
    }, []);

    function navCampaign() {
        navigate("/create/campaign");
    }
    function navIdDetail(id) {
        navigate(`/campaign/${id}`);
    }
    return (
        <>
            <main className="mx-auto container font-violet">
                <section className="mt-4">
                    <div className="">
                        <h1 className="text-3xl font-bold text-slate-800 text-center">
                            Campaigns List
                        </h1>
                        <Divider className="my-6 border-purple-600" />

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {campaignData.map((campaign) => (
                                <CardNextui
                                    key={campaign.id}
                                    className="p-4 bg-white rounded-lg shadow-md"
                                >
                                    <CardHeader>
                                        <h2 className="text-xl font-bold">
                                            {campaign.nama_campaign}
                                        </h2>
                                    </CardHeader>
                                    <CardBody>
                                        <img
                                            src={campaign.imageUrl}
                                            alt={campaign.nama_campaign}
                                            className="w-full h-48 object-cover rounded-lg mb-4"
                                        />
                                        <p>{campaign.deskripsi_campaign}</p>
                                    </CardBody>
                                    <CardFooter>
                                        <Button
                                            className="bg-indigo-600 text-white w-full"
                                            onClick={() =>
                                                navIdDetail(campaign.id)
                                            }
                                        >
                                            View Details
                                        </Button>
                                    </CardFooter>
                                </CardNextui>
                            ))}
                        </div>
                        <Divider className="my-6 border-purple-600" />
                        <Card className="mb-6 p-6 bg-indigo-600 rounded-lg shadow-lg flex justify-between items-center">
                            <h1 className="text-xl text-white">
                                Build Your Own Campaign Now
                            </h1>
                            <Button
                                onClick={navCampaign}
                                className="bg-white text-violet-700 font-bold shadow-lg hover:bg-gray-200 transition"
                            >
                                Create Now
                            </Button>
                        </Card>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Campaign;
