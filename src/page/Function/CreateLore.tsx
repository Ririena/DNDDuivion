import React, { useState } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase";

export default function CreateLore() {
    const [loreTitle, setLoreTitle] = useState("");
    const [loreSubJudul, setLoreSubJudul] = useState("")
    const [loreContent, setLoreContent] = useState("");
    const handleCreateLore = async () => {
        try {
            if (!loreTitle || !loreContent) {
                alert("Please fill in both title and content fields.");
                return;
            }
            const { data, error } = await supabase
                .from("lores")
                .insert([{ title: loreTitle, content: loreContent }]);
            if (error) {
                console.error(error);
                alert("An error occurred while creating the lore.");
            } else {
                alert("Lore created successfully!");
                setLoreTitle("");
                setLoreContent("");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred while creating the lore.");
        }
    };

    return (
        <Card className="max-w-lg mx-auto mt-8">
            <CardHeader>
                <CardTitle>Create New Lore</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <label
                        htmlFor="loreTitle"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="loreTitle"
                        name="loreTitle"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={loreTitle}
                        onChange={(e) => setLoreTitle(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label
                        htmlFor="loreContent"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Content
                    </label>
                    <textarea
                        id="loreContent"
                        name="loreContent"
                        className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        value={loreContent}
                        onChange={(e) => setLoreContent(e.target.value)}
                    ></textarea>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={handleCreateLore}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition"
                >
                    Create Lore
                </Button>
            </CardFooter>
        </Card>
    );
}
