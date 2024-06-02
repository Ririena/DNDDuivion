import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Spacer,
    Image,
    CardFooter,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    function handleLogin() {
        navigate("/login");
    }

    const { toast } = useToast();
    const [tambahUsers, setTambahUsers] = useState({
        email: "",
        password: "",
        password2: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        password2: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTambahUsers((prev) => ({
            ...prev,
            [name]: value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: "", // Reset error when input changes
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }

        if (!tambahUsers.email) {
            setErrors((prev) => ({
                ...prev,
                email: "Email harus diisi",
            }));
            return;
        }

        if (!tambahUsers.password) {
            setErrors((prev) => ({
                ...prev,
                password: "Password harus diisi",
            }));
            return;
        }

        if (!tambahUsers.password2) {
            setErrors((prev) => ({
                ...prev,
                password2: "Konfirmasi password harus diisi",
            }));
            return;
        }

        if (tambahUsers.password !== tambahUsers.password2) {
            setErrors((prev) => ({
                ...prev,
                password2: "Password konfirmasi tidak cocok",
            }));
            return;
        }

        setIsSubmitting(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: tambahUsers.email,
                password: tambahUsers.password,
            });

            if (error) {
                toast({
                    title: "Sepertinya Ada Yang Salah",
                    description: `${error.message}`,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: `Selamat, Akun Anda Telah Dibuat ${data}`,
                    description: "Dipindahkan ke Halaman Login",
                    variant: "success",
                });

                navigate("/login");
            }
        } catch (error) {
            toast({
                title: `Sepertinya Ada Error Di Sisi Server`,
                description: `Error: ${error as Error}`,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="container mx-auto font-violet">
                <div className="flex justify-center items-center">
                    <Card radius="sm" className="w-[500px] mt-12">
                        <CardHeader className="flex justify-center items-center">
                            <h1 className="text-center text-xl font-semibold text-slate-600">
                                Register
                            </h1>
                        </CardHeader>
                    </Card>
                </div>
                <div className="flex justify-center items-center mt-12">
                    <form onSubmit={handleSubmit}>
                        <Card radius="sm" className="w-[500px]">
                            <CardHeader className="flex justify-center items-center">
                                <h1 className="text-2xl font-semibold">
                                    DNDDuivion
                                </h1>
                            </CardHeader>
                            <Divider />
                            <section className="m-4 grid grid-cols-1 gap-2">
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="Email"
                                        value={tambahUsers.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <span className="text-red-500">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="password">Pasword</Label>
                                    <Input
                                        type="password"
                                        name="password"
                                        id="password"
                                        placeholder="Password"
                                        value={tambahUsers.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <span className="text-red-500">
                                            {errors.password}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="repassword">
                                        Retype Password
                                    </Label>
                                    <Input
                                        type="password"
                                        name="password2"
                                        id="repassword"
                                        placeholder="Retype Password"
                                        value={tambahUsers.password2}
                                        onChange={handleChange}
                                    />
                                    {errors.password2 && (
                                        <span className="text-red-500">
                                            {errors.password2}
                                        </span>
                                    )}
                                </div>
                            </section>
                            <Divider />
                            <CardFooter>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full"
                                >
                                    <Button type="submit" className="w-full">
                                        {isSubmitting
                                            ? "Submitting..."
                                            : "Signup"}
                                    </Button>
                                </motion.div>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Register;
