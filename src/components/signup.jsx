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
import { signup } from '@/backend/apiAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UrlState } from '@/context';


const Signup = () => {

    const navigate = useNavigate();
    let [searchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");

    const [errors, setErrors] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        profile_pic: null,
    });

    const { data, loading, error, fn: fnSignup } = useFetch(signup, formData);
    const { fetchUser } = UrlState();

    useEffect(() => {
        console.log("-- In Signup --");
        if (error === null && data) {
            navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
        }
    }, [loading, error]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,

        }))
    }

    const handleSignup = async () => {
        setErrors([]);
        try {
            const schema = Yup.object().shape({
                name: Yup.string().required("Name is required"),
                email: Yup.string().email("Invalid email").required("Email is required"),
                password: Yup.string().min(6, "Password must be atleast 6 characters")
                    .required("Password is required"),
                profile_pic: Yup.mixed().required("Profile picture is required")
            });
            await schema.validate(formData, { abortEarly: false });
            await fnSignup();
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
                <CardTitle>Signup</CardTitle>
                <CardDescription>
                    Create a new account!
                </CardDescription>
                {error && <Error message={error.message} />}
            </CardHeader>
            <CardContent className="space-y-2">
                <div className='space-y-1'>
                    <Input name="name" type="text" placeholder="Enter name"
                        onChange={handleInputChange} />
                    {errors.name && <Error message={errors.name} />}
                </div>
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
                <div className='space-y-1'>
                    <Input name="profile_pic" type="file" accept="image/*"
                        onChange={handleInputChange} />
                    {errors.profile_pic && <Error message={errors.profile_pic} />}
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSignup}>
                    {loading ?
                        <BeatLoader size={10} color="#36d7b7" />
                        : "Create account"
                    }
                </Button>
            </CardFooter>
        </Card>

    )
}

export default Signup
