
function Loading() {
  return (
    // UR MAIN SECTION FULL SCREEN LOADING
    <section className="bg-blue-900 relative place-items-center grid h-screen w-screen gap-4">   
      {/* <!--   ITEM 1 --> */}
      <div className="bg-blue-500 w-48 h-48  absolute animate-ping rounded-full delay-5s shadow-xl"></div>
      {/* <!--   ITEM 2 --> */}
      <h1 className='text-2xl font-sans text-blue-400'>Loading...</h1>
      <div className="bg-blue-400 w-32 h-32 absolute animate-ping rounded-full shadow-xl"></div>
      {/* <!--   ITEM 3 --> */}
      <div className=" w-24 h-24 absolute animate-pulse rounded-full shadow-xl"></div>
      {/* <!--   SVG LOGO --> */}
        {/* <svg xmlns="http://www.w3.org/2000/svg" className="text-blue-900 filter mix-blend-overlay h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
      </svg> */}
    </section>
  )
}

export default Loading
