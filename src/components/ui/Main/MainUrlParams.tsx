import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/utils/supabase";
import { Avatar, Divider } from "@nextui-org/react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "../input";
import { Textarea } from "../textarea";
import { Card, CardHeader, CardFooter } from "../card";
import { Button } from "../button";
import { Tabs, Tab } from "@nextui-org/react";
import { useToast } from "@/components/ui/use-toast";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AiFillFile } from "react-icons/ai";

export default function MainUserParams() {
  const [url, setUrl] = useState(null);
  const { toast } = useToast();
  const [titleDynamic, setTitleDynamic] = useState(null);
  const [title, setTitle] = useState("");
  const { urlId } = useParams();
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [picture, setPicture] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState(""); // State untuk menyimpan URL video YouTube
  const [userData, setUserData] = useState(null);
  const [contentImage, setContentImage] = useState("");
  useEffect(() => {
    async function getUrl() {
      try {
        const { data, error } = await supabase
          .from("user")
          .select("nama_user, id, title")
          .eq("nama_user", urlId);

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setUrl(data[0].nama_user);
          setTitleDynamic(data[0].title);

          setUserId(data[0].id);
          console.log(userData);
          console.log(userId);
        } else {
          console.log("URL tidak ditemukan");
        }
      } catch (error) {
        console.error(error as Error);
      }
    }
    getUrl();
  }, [urlId]);

  const handleSave = async () => {
    if (userData == urlId) {
      alert("Halu");
      return;
    }

    let imageName = null;

    if (picture) {
      imageName = `${uuidv4()}.${picture.name.split(".").pop()}`;

      const { data: pictureData, error: pictureError } = await supabase.storage
        .from("gambar")
        .upload(`picture/${imageName}`, picture);

      console.log(pictureData);
      if (pictureError) {
        console.error("Error Uploading", pictureError);
      }
    }

    const newMessage = {
      title: title,
      message: message,
      gambar: imageName,
      video: youtubeUrl,
      ReceiverMaillerURL: userId,
      content_gambar: contentImage,
    };

    const { data, error } = await supabase.from("message").insert([newMessage]);
    if (error) {
      console.error(error.message);
    } else {
      console.log("Data Berhasil Dikirim", data);
      toast({
        title: "Berhasil",
        description: "Surat Sudah Terkirim Kepada Penerima, Terima Kasih",
        variant: "success",
      });
    }
  };

  let tabs = [
    {
      id: "photos",
      label: "Gambar",
      content: (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPicture(e.target.files[0])}
            color="secondary"
            className="hidden"
            id="avatar"
          />

          <Input
            className="mt-2"
            placeholder="Enter Description For Image"
            value={contentImage}
            onChange={(e) => setContentImage(e.target.value)}
          />

          <Button variant="bordered" className="w-full mt-5">
            <label
              htmlFor="avatar"
              className="cursor-pointer   px-4 py-2 rounded-md text-sm"
            >
              Upload File
            </label>
          </Button>
        </>
      ),
    },
    {
      id: "Text",
      label: "Text",
      content: (
        <Textarea
          color="secondary"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter Your Letter Violet✉️"
          className="w-full mt-4"
        />
      ),
    },
    {
      id: "Video",
      label: "Videos",
      content: (
        <>
          <Input
            type="text"
            className="mt-4"
            color="secondary"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Enter YouTube URL"
          />
          {youtubeUrl && (
            <iframe
              width="100%"
              height="315"
              src={`https://www.youtube.com/embed/${youtubeUrl.split("v=")[1]}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <main className="mx-auto container font-violet mt-4">
        <div className="flex w-full flex-col">
          <Tabs items={tabs} className="mx-auto">
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <div className="flex justify-center items-center">
                  <Card className="w-[500px]">
                    <CardHeader className="">
                      <div className="flex items-center">
                        <Avatar src="/violetP.jpg" />
                      </div>
                      <div>
                        <h1 className="">
                          Name:
                          <span> {url && url.toUpperCase()}</span>
                        </h1>
                        <Divider />
                        <h1 className="mt-1">
                          Title:
                          <span>
                            {" "}
                            {titleDynamic && titleDynamic.toUpperCase()}{" "}
                          </span>
                        </h1>
                      </div>
                      <Divider />
                    </CardHeader>
                    <Divider />
                    <CardFooter className="mb-4 grid mt-6">
                      <Input
                        type="text"
                        color="secondary"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter Your Title Violet"
                      />
                      <div className="w-full">{item.content}</div>
                    </CardFooter>
                  </Card>
                </div>
              </Tab>
            )}
          </Tabs>

          <div className="flex justify-center items-center mt-4">
            <Button
              className="max-w-[500px] w-full p-6"
              variant="borderwhite"
              onClick={handleSave}
            >
              Submit
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
