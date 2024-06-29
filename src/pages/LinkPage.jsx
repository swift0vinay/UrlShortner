import { getClicksForUrl, getClicksForUrls } from '@/backend/apiClicks';
import { deleteUrl, getUrl } from '@/backend/apiUrl';
import { Button } from '@/components/ui/button';
import { UrlState } from '@/context';
import useFetch from '@/hooks/use-fetch';
import { CopyIcon, DownloadIcon, LinkIcon, TrashIcon } from 'lucide-react';
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BarLoader, BeatLoader } from 'react-spinners';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LocationData from '@/components/Location';
import DeviceInfo from '@/components/DeviceInfo';


const LinkPage = () => {

  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();
  const { loading, data: url, fn, error } =
    useFetch(getUrl, { id, user_id: user?.id });
  const { loading: loadingStats, data: stats, fn: fnStats } =
    useFetch(getClicksForUrl, id);

  useEffect(() => {
    fn();
  }, []);

  useEffect(() => {
    if (error) {
      navigate("/dashboard");
    }
    if (!error && loading === false) fnStats();
  }, [loading, error]);


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
    <>
      {(loading || loadingStats) &&
        <BarLoader className="mb-4" width={"100%"} color='#36d7b7' />}
      <div className='flex flex-col gap-8 sm:flex-row justify-between'>
        <div className='flex flex-col items-start gap-8 rounded-lg sm:w-2/5'>
          <span className='text-6xl font-extrabold hover:underline cursor-pointer'>{url?.title}</span>
          <a
            className='text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer'
            href={`https://${url?.prefix ? url?.prefix : "short.in"}/${url?.short_url}`} target='_blank'>
            {`https://${url?.prefix ? url?.prefix : "short.in"}/${url?.short_url}`}
          </a>
          <a href={url?.long_url} target='_blank' className='flex items-center gap-1 hover:underline cursor-pointer'>
            <LinkIcon className='p-1' />
            {url?.long_url}
          </a>
          <span className='flex items-end font-extralight text-sm'>
            {new Date(url?.created_at).toLocaleString()}
          </span>
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
                fnDelete();
              }}>
              {deleteLoading ? <BeatLoader size={5} color='white' /> : <TrashIcon />}
            </Button>
          </div>
          <img
            className="w-full object-contain ring ring-blue-500 self-center"
            src={url?.qr}
            alt="QR code"
          />
        </div>
        <Card className='sm:w-3/5'>
          <CardHeader>
            <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
          </CardHeader>
          {stats && stats.length ?
            (
              <CardContent className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Clicks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{stats?.length}</p>
                  </CardContent>
                </Card>
                <CardTitle>Location Data</CardTitle>
                <LocationData stats={stats} />
                <CardTitle>Device Info</CardTitle>
                <DeviceInfo stats={stats} />
              </CardContent>
            ) :
            (
              <CardContent>
                {loadingStats === false ?
                  "No stats yet" :
                  "Loading data..."}
              </CardContent>
            )
          }

        </Card>
      </div>
    </>
  )
}

export default LinkPage
