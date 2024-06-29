import React, { useEffect, useState } from 'react'
import { BarLoader } from 'react-spinners'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FilterIcon } from 'lucide-react';
import Error from '@/components/Error';
import useFetch from '@/hooks/use-fetch';
import { UrlState } from '@/context';
import { getClicksForUrls } from '@/backend/apiClicks';
import { getUrls } from '@/backend/apiUrl';
import LinkCard from '@/components/LinkCard';
import CreateLink from '@/components/create-link';


const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = UrlState();
  const { loading, error, data: urls, fn: fnUrls } = useFetch(getUrls, user?.id)
  const { loading: clicksLoading, error: clicksError, data: clicksData, fn: fnClicks }
    = useFetch(getClicksForUrls,
      urls?.map((url) => url.id)
    )

  useEffect(() => {
    fnUrls();
  }, []);

  useEffect(() => {
    if (urls?.length) {
      fnClicks();
    }
  }, [urls?.length]);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='flex flex-col gap-8'>
      {(loading || clicksLoading) && <BarLoader width={"100%"} color='#367db7' />}
      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{clicksData?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className='flex justify-between'>
        <h1 className='text-4xl font-extrabold'>My Links</h1>
        {/* <Button>Create Link</Button> */}
        <CreateLink />
      </div>
      <div className='relative'>
        <Input type="text" placeholder="Filter out links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FilterIcon className='absolute top-2 right-2 p-1' />
      </div>
      {(filteredUrls || []).map((url, i) => {
        return <LinkCard key={i} url={url} fetchUrls={fnUrls} />
      })} {error && <Error message={error?.mesage} />}
    </div>
  )
}

export default Dashboard
