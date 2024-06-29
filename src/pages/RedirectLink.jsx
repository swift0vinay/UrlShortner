import { storeClicks } from '@/backend/apiClicks';
import { getLongUrl } from '@/backend/apiUrl';
import useFetch from '@/hooks/use-fetch';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners';

const RedirectLink = () => {
  const { id } = useParams();

  const { loading, data, fn: fnLongUrl } = useFetch(getLongUrl, id);

  const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    long_url: data?.long_url
  });

  useEffect(() => {
    fnLongUrl();
  }, []);
  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading])

  if (loading || loadingStats) {
    return (
      <>
        <BarLoader width={"100%"} color='#36d7b7' />
        <br />
        Redirecting....
      </>
    )
  }
  return null;
}

export default RedirectLink
