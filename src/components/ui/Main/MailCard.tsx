import { supabase } from "../../../utils/supabase";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, Image, Divider } from "@nextui-org/react";
import { format } from "date-fns";
import { Card, CardHeader, CardContent as CardBody } from "../../ui/card";
import { Spinner } from "@nextui-org/react";
import { Button } from "../button";
import { AiOutlineMail } from "react-icons/ai";
import { Checkbox } from "../checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "../badge";
import { useNavigate } from "react-router-dom";

interface PaginationItemProps {
  children: React.ReactNode;
}
export default function MailCard() {
  const [userId, setUserId] = useState(null);
  const [receiverData, setReceiverData] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ascendingOrder, setAscendingOrder] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const navigate = useNavigate()
  useEffect(() => {
    async function fetchUser() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          throw error;
        }

        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("id")
          .eq("email", user.email)
          .single();

        if (userError) {
          throw userError;
        }

        setUserId(userData.id);

        const { data: receiver, error: receiverError } = await supabase
          .from("message")
          .select("*")
          .eq("ReceiverMaillerURL", userData.id)
          .order("send_at", { ascending: ascendingOrder });

        if (receiverError) {
          throw receiverError;
        }

        setReceiverData(receiver);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user or messages:", error);
        setLoading(false);
      }
    }

    fetchUser();
  }, [ascendingOrder, currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "MMMM, dd, yyyy");
  };

  const handleToggleAscending = () => {
    setAscendingOrder(!ascendingOrder);
  };

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
  };

  // Pagination calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = receiverData
    ? receiverData.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(
    (receiverData ? receiverData.length : 0) / itemsPerPage
  );

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <main>
        <section>
          {loading ? (
            <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <Spinner className="" size="lg">
                <p className="text-black text-md">Loading</p>
              </Spinner>
            </div>
          ) : receiverData ? (
            <>
              <div className="container mt-12">
                <div className="flex justify-between mx-[30px]  md:mx-[86px] lg:-mx-[10px] xl:-mx-[40px] ">
                  <section>
                    <Button className="">
                      <AiOutlineMail size="1em" />
                      <h1 className="ml-2">List Mail</h1>
                    </Button>
                  </section>
                  <section>
                    <Checkbox onChange={handleToggleAscending} /> Old
                  </section>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 m-4">
                  {currentItems.map((message) => (
                    <li key={message.id} className="flex justify-center">
                      <motion.section
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        animate={{
                          opacity: 1,
                        }}
                        className="max-w-lg w-full"
                        style={{ transformOrigin: "center" }}
                      >
                        <Card className="border-2">
                          <CardHeader>
                            <a href={`/me/mail/${message.id}`}>
                              <Image
                                src="/violet/Letter.jpg"
                                className="object-contain"
                                width={300}
                              />
                            </a>
                          </CardHeader>
                          <Divider />
                          <CardBody>
                            <div className="font-violet">
                              <div className="flex justify-between">
                                <h1 className="text-md mt-4">
                                  {formatDate(message.send_at)}
                                </h1>
                              </div>
                            </div>
                          </CardBody>
                        </Card>
                      </motion.section>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Pagination UI */}
              <div className="flex justify-center mt-8 pb-20">
                <Pagination className="flex items-center space-x-4">
                  <PaginationPrevious
                    onClick={handlePrevPage}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 cursor-pointer"
                  >
                    Previous
                  </PaginationPrevious>
                  <PaginationContent className="flex space-x-2">
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <PaginationItem key={index}>
                        <PaginationLink
                          onClick={() => handlePageClick(index + 1)}
                          className={`px-4 py-2 rounded-lg cursor-pointer ${
                            currentPage === index + 1
                              ? "bg-primary text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                  </PaginationContent>
                  <PaginationNext
                    onClick={handleNextPage}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 cursor-pointer"
                  >
                    Next
                  </PaginationNext>
                </Pagination>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-[750px] font-violet">
              <section className="grid grid-cols-1">
                <div className="size-72">
                  <Image src="/icons/512L4T.png" />
                </div>
                <h1 className="text-2xl text-center">401 Unauthorized</h1>
                <Button onClick={() => navigate("/login")} className="mt-4">Click Me For Sessions</Button>
              </section>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
