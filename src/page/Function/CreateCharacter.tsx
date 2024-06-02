import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import { Divider } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

const CreateCharacter = () => {
    const [namaCampaign, setNamaCampaign] = useState("");
    const [deskripsiCampaign, setDeskripsiCampaign] = useState("");
    const [backgroundCampaign, setBackgroundCampaign] = useState("");
    const [classCampaign, setClassCampaign] = useState("");
    const [subclassCampaign, setSubClassCampaign] = useState("");
    const [gambar, setGambar] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                const { data, error } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("email", user.email)
                    .single();

                if (error) {
                    throw new Error(error.message);
                }
                setUser(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const { data: campaigns, error } = await supabase
                    .from("campaign")
                    .select("*");

                if (error) {
                    throw new Error(error.message);
                }
                setCampaigns(campaigns);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCampaigns();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();

        if (!user) {
            console.error("Pengguna belum login.");
            return;
        }

        if (!gambar) {
            console.error("No image selected.");
            return;
        }

        const imageName = `${uuidv4()}.${gambar.name.split(".").pop()}`;

        const { data: fileData, error: fileError } = await supabase.storage
            .from("picture")
            .upload(`images/${imageName}`, gambar);
        if (fileError) {
            console.error("Error uploading file:", fileError.message);
            return;
        }

        const newData = {
            karakter_nama: namaCampaign,
            karakter_deskripsi: deskripsiCampaign,
            karakter_class: classCampaign,
            karakter_subclass: subclassCampaign,
            karakter_background: backgroundCampaign,
            karakter_photo: imageName,
            id_campaign: selectedCampaignId, // Set the selected campaign ID
        };

        const { data, error } = await supabase
            .from("characters")
            .insert([newData]);
        if (error) {
            console.error("Error saving data:", error.message);
        } else {
            console.log("Data saved successfully:", data);
        }
    };

    return (
        <>
            <main className="mx-auto container font-violet">
                <section className="flex justify-center items-center mt-2">
                    <form onSubmit={handleSave}>
                        <Card className="w-[500px] bg-white p-6 rounded-lg shadow-lg">
                            <section className="text-center font-semibold text-lg text-blue-600">
                                Create Characters
                                <Divider />
                            </section>
                            <section className="grid grid-cols-1 mt-4 gap-3">
                                <select
                                    className="input"
                                    value={selectedCampaignId}
                                    onChange={(e) => setSelectedCampaignId(e.target.value)}
                                >
                                    <option value="">Select Campaign</option>
                                    {campaigns.map((campaign) => (
                                        <option
                                            key={campaign.id}
                                            value={campaign.id}
                                        >
                                            {campaign.nama_campaign}
                                        </option>
                                    ))}
                                </select>
                                <Input
                                    placeholder="Nama Karakter"
                                    name="nama_campaign"
                                    value={namaCampaign}
                                    onChange={(e) => setNamaCampaign(e.target.value)}
                                />
                                <Textarea
                                    placeholder="Karakter Deskripsi"
                                    name="deskripsi_campaign"
                                    value={deskripsiCampaign}
                                    onChange={(e) => setDeskripsiCampaign(e.target.value)}
                                />
                                <Input
                                    placeholder="Karakter Class"
                                    name="class_campaign"
                                    value={classCampaign}
                                    onChange={(e) => setClassCampaign(e.target.value)}
                                />
                                <Input
                                    placeholder="Karakter Subclass"
                                    name="subclass_campaign"
                                    value={subclassCampaign}
                                    onChange={(e) => setSubClassCampaign(e.target.value)}
                                />
                                <Input
                                    placeholder="Karakter Background"
                                    name="background_campaign"
                                    value={backgroundCampaign}
                                    onChange={(e) => setBackgroundCampaign(e.target.value)}
                                />
                                <label htmlFor="phcp">
                                    <div className="bg-sky-600 py-2 px-1 text-white ">
                                        <h1 className="text-center">
                                            Select File
                                        </h1>
                                    </div>
                                </label>
                            </section>

                            <input
                                className="hidden"
                                type="file"
                                id="phcp"
                                onChange={(e) => setGambar(e.target.files[0])}
                            />
                            <Divider className="mt-2" />
                            <Button type="submit" className="max-w-full w-full">
                                Simpan
                            </Button>
                        </Card>
                    </form>
                </section>
            </main>
        </>
    );
};

export default CreateCharacter;
