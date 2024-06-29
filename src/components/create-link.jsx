import React, { useEffect, useRef, useState } from 'react'
import { QRCode } from 'react-qrcode-logo';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { UrlState } from '@/context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import Error from './Error';
import * as yup from "yup";
import { QrCode } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { createUrl } from '@/backend/apiUrl';
import { BeatLoader } from 'react-spinners';


const CreateLink = () => {
    const { user } = UrlState();
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");

    const ref = useRef()

    const [errors, setErrors] = useState({});
    const [formValues, setFormValues] = useState({
        title: "",
        long_url: longLink ? longLink : "",
        prefix: "",
    });

    const schema = yup.object().shape({
        title: yup.string().required("title is required"),
        long_url: yup.string().url("Must be a valid url").required("Url is required"),
        prefix: yup.string()
    });

    const handleChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value,
        })
    }

    const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl, { ...formValues, user_id: user.id });

    useEffect(() => {
        if (error === null && data) {
            navigate(`/link/${data[0].id}`);
        }
    }, [error, data]);


    const createNewUrl = async () => {
        setErrors([])
        try {
            await schema.validate(formValues, { abortEarly: false });
            const canvas = ref.current.canvasRef.current;
            const blob = await new Promise((resolve) => canvas.toBlob(resolve));
            await fnCreateUrl(blob);
        } catch (e) {
            const newErrors = {}
            e?.inner?.forEach(err => {
                newErrors[err.path] = err.message;
            });
            setErrors(newErrors);
        }
    }
    return (
        <Dialog defaultOpen={longLink}
            onOpenChange={(res) => {
                if (!res) {
                    setSearchParams({});
                }
            }}>
            <DialogTrigger asChild>
                <Button variant="destructive">Create Link</Button>
            </DialogTrigger>
            <DialogContent className="w-1/2">
                <DialogHeader>
                    <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
                </DialogHeader>
                <Input id="title"
                    value={formValues.title}
                    onChange={handleChange} placeholder="Short links title" />
                {errors.title && <Error message={errors.title} />}

                {formValues.long_url && <QRCode value={formValues.long_url} size={250} ref={ref} />}
                <Input id="long_url"
                    value={formValues.long_url}
                    onChange={handleChange} placeholder="Enter your long URL" />
                {errors.long_url && <Error message={errors.long_url} />}

                <Input id="prefix"
                    value={formValues.prefix}
                    onChange={handleChange} placeholder="Your url will look like prefix/<short url>" />

                {error && <Error message={error.message} />}
                <DialogFooter className="sm:justify-end">
                    <Button disabled={loading} onClick={createNewUrl} variant="destructive">
                        {loading ? <BeatLoader size={10} color='white' /> : "Create"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateLink
