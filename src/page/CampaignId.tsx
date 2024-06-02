import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Divider, Image } from "@nextui-org/react";

export default function CampaignId() {
    const [campaignData, setCampaignData] = useState(null);
    const [image, setImage] = useState(null);
    const { campaignId } = useParams();

    useEffect(() => {
        async function fetchCampaignData() {
            try {
                const { data, error } = await supabase
                    .from("campaign")
                    .select("*")
                    .eq("id", campaignId)
                    .single();

                if (error) {
                    console.error(error.message);
                    return;
                }

                setCampaignData(data);

                if (data.photo_campaign) {
                    const res = await supabase.storage
                        .from("picture/images")
                        .getPublicUrl(data.photo_campaign);
                    setImage(res.data.publicUrl);
                }
            } catch (error) {
                console.error(error);
            }
        }

        if (campaignId) {
            fetchCampaignData();
        }
    }, [campaignId]);

    return (
        <main className="mx-auto container font-violet">
            <div className="mt-8">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Campaign Details
                </h1>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Card className="w-full sm:w-[500px] p-4">
                        <h2 className="text-lg font-bold mb-4">
                            Select Campaign Section
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition">
                                Books
                            </Button>
                            <Button className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-2 rounded-md transition">
                                Lore
                            </Button>
                            <Button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-md transition">
                                Map
                            </Button>
                        </div>
                    </Card>
                    <Card className="mt-2 w-full sm:w-[500px]">
                        <section className="p-4">
                            <h1 className="text-xl font-bold mb-2">
                                {campaignData
                                    ? campaignData.nama_campaign
                                    : "Loading..."}
                            </h1>
                            <Divider className="my-4" />
                            <div className="flex justify-center">
                                <Image
                                    src={image ? image : "No image"}
                                    width={600}
                                    height={400}
                                    alt="Campaign Image"
                                />
                            </div>
                            <Divider className="mt-2" />
                            <h1 className="text-lg font-bold mt-2">
                                {campaignData
                                    ? campaignData.deskripsi_campaign
                                    : "no"}
                            </h1>
                        </section>
                    </Card>
                </div>
                <div className="flex justify-center mt-8">
                    <Card className="max-w-full w-full sm:w-[800px] p-4">
                        <h1 className="text-center">Characters List</h1>
                    </Card>
                </div>
            </div>
        </main>
    );
}
