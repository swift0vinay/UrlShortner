import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Copy, CopyIcon, DownloadIcon, LucideTrash2, TrashIcon } from 'lucide-react'
import useFetch from '@/hooks/use-fetch'
import { BeatLoader } from 'react-spinners'
import { deleteUrl } from '@/backend/apiUrl'

const LinkCard = ({ url, fetchUrls }) => {
    const URL = `https://${url?.prefix ? url?.prefix : "short.in"}/${url?.short_url}`;

    const downloadImage = () => {
        const imageUrl = url?.qr;
        const fileName = url?.title;

        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.download = fileName;

        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const { loading: deleteLoading, fn: fnDelete } = useFetch(deleteUrl, url?.id);

    return (
        <div className='flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg'>
            <img
                className="h-32 object-contain ring ring-blue-500 self-start"
                src={url?.qr}
                alt="QR code"
            />
            <Link to={`/link/${url?.id}`} className='flex flex-col flex-1'>
                <span className='text-3xl font-extrabold hover:underline cursor-pointer'>{url.title}</span>
                <span className='text-2xl text-blue-400 font-bold hover:underline cursor-pointer'>
                    {URL}
                </span>
                <span className='flex items-center gap-1 hover:underline cursor-pointer'> {url?.long_url} </span>
                <span className='flex flex-1 font-extralight text-sm items-end'> {new Date(url?.created_at).toLocaleString()} </span>
            </Link>
            <div className='flex gap-2'>
                <Button variant="ghost"
                    onClick={() => {
                        navigator.clipboard.writeText(URL);
                        // TODO: snackbar
                    }}>
                    <CopyIcon />
                </Button>
                <Button variant="ghost"
                    onClick={downloadImage}>
                    <DownloadIcon />
                </Button>
                <Button variant="ghost"
                    onClick={() => {
                        fnDelete().then(() => {
                            fetchUrls();
                        })
                    }}>
                    {deleteLoading ? <BeatLoader size={5} color='white' /> : <TrashIcon />}
                </Button>
            </div>
        </div>
    )
}

export default LinkCard
