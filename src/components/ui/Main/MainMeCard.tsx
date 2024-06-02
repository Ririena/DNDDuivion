import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Image } from "@nextui-org/react";
import { Divider } from "@nextui-org/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getUserByEmail, getUserFromTable } from "@/libs/UserLibs";
import { supabase } from "@/utils/supabase";
import { useToast } from "../use-toast";
let yourName: string = "Zayshi";
type CardProps = React.ComponentProps<typeof Card>;
console.log(yourName);
export default function MainMeCard({ className, ...props }: CardProps) {
  const { toast } = useToast();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [title, setTitle] = useState("");
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserByEmail();
        setUserEmail(user?.email);
        console.log(userEmail);

        const userDataFromTable = await getUserFromTable(user.email);
        setUserData(userDataFromTable);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleAddData = async () => {
    try {
      if (!title) {
        console.error("Title is empty");
        return;
      }

      if (!userEmail) {
        console.error("User email is empty");
        return;
      }

      const { error: updateError } = await supabase
        .from("user")
        .update({ title: title })
        .eq("email", userEmail);

      if (updateError) {
        throw updateError;
      }

      console.log("Title updated successfully!");
      toast({
        title: "Title Updated Succesfully✉️",
        description: `Good Work Major ${userData ? userData.nama_user && userData.nama_user.toUpperCase() : "No Major"} `,
        variant: "default"
      });

      const { data, error: fetchError } = await supabase
        .from("user")
        .select("*")
        .eq("email", userEmail)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      setUserData(data);
    } catch (error) {
      console.error("Error updating title:", error as Error);
    }
  };

  if (loading) {
    return <h1>Loading</h1>;
  }
  return (
    <>
      <section className="bg-slate-50 pt-12 font-violet">
        <main className="">
          <div className="flex justify-center items-center">
            <div className=" max-w-md  lg:max-w-lg xl:max-w-lg">
              <Card className={cn("", className)} {...props}>
                <CardHeader>
                  <div className="mx-auto">
                    <Image src="/PFP.jpg" alt="Background Picture" sizes="lg" />
                  </div>
                </CardHeader>
                <Divider />

                <CardContent className="p-6">
                  <h1 className="text-violet-600 text-2xl font-bold mb-4 mx-auto text-center">
                    {userData ? userData.title : ""}
                  </h1>
                  <Input
                    value={title}
                    onChange={handleTitleChange}
                    type="text"
                    className="mb-4"
                    placeholder={`Enter Your New Title Major ${
                      userData
                        ? userData.nama_user && userData.nama_user.toUpperCase()
                        : "No Major"
                    }`}
                  />
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="max-w-full w-full"
                      onClick={handleAddData}
                    >
                      Add New Title
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </section>
    </>
  );
}
