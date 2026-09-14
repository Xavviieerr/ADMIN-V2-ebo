import SingleProvince from '@/components/province/singleProvince'
import React, { use } from 'react'


export default function Page({ params }: { params: Promise<{ provinceId: string }> }) {
  const { provinceId } = use(params);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#18191f] text-white relative">
      <SingleProvince id={provinceId} />
    </div>
  )
}
