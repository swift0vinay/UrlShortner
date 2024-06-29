import React, { useEffect, useState } from 'react'
import * as Yup from 'yup';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from './ui/input'
import { Button } from './ui/button'
import { BeatLoader } from 'react-spinners'
import Error from './Error'
import useFetch from '@/hooks/use-fetch';
import { login } from '@/backend/apiAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UrlState } from '@/context';


const Login = () => {

    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");

    const [errors, setErrors] = useState([]);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const { data, loading, error, fn: fnLogin } = useFetch(login, formData);
    const { fetchUser } = UrlState();

    useEffect(() => {
        console.log("-- In Login --");
        if (error === null && data) {
            fetchUser();
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
        }
    }, [data, error]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleLogin = async () => {
        setErrors([]);
        try {
            const schema = Yup.object().shape({
                email: Yup.string().email("Invalid email").required("Email is required"),
                password: Yup.string().min(6, "Password must be atleast 6 characters")
                    .required("Password is required")
            });
            await schema.validate(formData, { abortEarly: false });
            await fnLogin();
        } catch (e) {
            const newErrors = {}
            e?.inner?.forEach(err => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Login to your account!
                </CardDescription>
                {error && <Error message={error.message} />}
            </CardHeader>
            <CardContent className="space-y-2">
                <div className='space-y-1'>
                    <Input name="email" type="email" placeholder="Enter email"
                        onChange={handleInputChange} />
                    {errors.email && <Error message={errors.email} />}
                </div>
                <div className='space-y-1'>
                    <Input name="password" type="password" placeholder="Enter password"
                        onChange={handleInputChange} />
                    {errors.password && <Error message={errors.password} />}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleLogin}>
                    {loading ?
                        <BeatLoader size={10} color="#36d7b7" />
                        : "Login"
                    }
                </Button>
            </CardFooter>
        </Card>

    )
}

export default Login
