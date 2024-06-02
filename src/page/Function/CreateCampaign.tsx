import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import { Divider } from "@nextui-org/react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { v4 as uuidv4 } from "uuid";

const CreateCampaign = () => {
    const [namaCampaign, setNamaCampaign] = useState("");
    const [deskripsiCampaign, setDeskripsiCampaign] = useState("");
    const [gambar, setGambar] = useState(null);
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
                console.log(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchUser();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault(); // Prevent default form submission

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
            nama_campaign: namaCampaign,
            deskripsi_campaign: deskripsiCampaign,
            photo_campaign: imageName,
        };

        const { data, error } = await supabase
            .from("campaign")
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
                                Create Campaigns
                                <Divider />
                            </section>
                            <section className="grid grid-cols-1 mt-4 gap-3">
                                <Input
                                    placeholder="Nama Campaign"
                                    name="nama_campaign"
                                    value={namaCampaign}
                                    onChange={(e) =>
                                        setNamaCampaign(e.target.value)
                                    }
                                />
                                <Textarea
                                    placeholder="Deskripsi Campaign"
                                    name="deskripsi_campaign"
                                    value={deskripsiCampaign}
                                    onChange={(e) =>
                                        setDeskripsiCampaign(e.target.value)
                                    }
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

export default CreateCampaign;
