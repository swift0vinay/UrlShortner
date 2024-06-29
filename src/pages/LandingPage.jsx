import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React, { useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useNavigate } from 'react-router-dom'


const LandingPage = () => {
  const [longUrl, setLongUrl] = useState("")
  const navigate = useNavigate()

  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) {
      navigate(`/auth?createNew=${longUrl}`);
    }
  }
  return (
    <div className='flex flex-col items-center'>
      <h2 className='my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold'>Url Shortener</h2>
      <form className='sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2'
        onSubmit={handleShorten}>
        <Input
          type="url"
          placeholder="Enter your looong url"
          className="h-full flex-1 py-4 px-4"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)} />
        <Button className="h-full" type="submit" variant="destructive">Shorten!</Button>
      </form>


      <Accordion type="multiple" collapsible="true" className="w-full md:px-11">
        <AccordionItem value="item-1">
          <AccordionTrigger>Who made this</AccordionTrigger>
          <AccordionContent>
            Vinay
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it fun?</AccordionTrigger>
          <AccordionContent>
            Yes.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default LandingPage
