

export default function StartCards() {
    const cards = [
        { label: 'Total Products', value: '12', color: 'text-sky-500 border-sky-100' },
        { label: 'Active Listings', value: '9', color: 'text-green-500 border-green-100' },
        { label: 'Total Inventory Value', value: '135,681 Dh', color: 'text-sky-600 border-sky-100' },
        { label: 'Pending Messages', value: '19', color: 'text-orange-500 border-orange-100' },
    ]
  return (
    <div className="flex gap-4 w-auto justify-center flex-wrap">
        {
            cards.map((card,index)=>(
                <div key={index} className='bg-white text-xl  flex flex-col rounded-sm justify-center  items-center p-5  border-slate-100 shadow-sm'>
                    <h1>{card.label}</h1>
                    <h1 className={card.color}>{card.value}</h1>
                </div>
            ))
        }
    </div>
  )
}
