import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Spacer,
    Image,
    CardFooter,
} from "@nextui-org/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!form.email) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: "Password Harus Diisi",
            }));
            return;
        }
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });

            if (error) {
                console.error(error.message);
            } else {
                console.log("SUCCESS");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };

    return (
        <>
            <section className="container mx-auto font-violet">
                <div className="flex justify-center items-center">
                    <Card radius="sm" className="w-[500px] mt-12">
                        <CardHeader className="flex justify-center items-center">
                            <h1 className="text-center text-xl font-semibold text-slate-600">
                                Log In
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
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        id="email"
                                        placeholder="Email"
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
                                        id="password"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        type="password"
                                        placeholder="Password"
                                    />
                                    {errors.password && (
                                        <span className="text-red-500">
                                            {errors.password}
                                        </span>
                                    )}
                                </div>
                            </section>
                            <Divider />
                            <CardFooter>
                                <Button
                                    type="submit"
                                    className="max-w-full w-full"
                                >
                                    Login
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Login;
