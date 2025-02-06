import React from 'react';



export default function LifeguardWarningCard({title,description,issuer,date}){
   

    return(



        <div className="block p-6 bg-white border border-gray-500 rounded-lg shadow-lg hover:bg-gray-100 w-3/4">
      <div className="flex">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white w-3/6">{title}</h5>
        <button
          className="text-white border border-black bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-2 mr-5 text-center"
        >
          Update Warning
        </button>
        <button
          
          className="text-white border border-black bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-2 text-center"
        >
          Remove Warning
        </button>
      </div>
      <div className="h-20">
        <p className="mt-5 font-normal text-gray-700 text-lg">Description:</p>
        <p>{description}</p>
      </div>
      <div className="flex pt-10">
        <p className="text-lg w-3/4">Warning made by: {issuer}</p>
        <p className="text-lg">Issued: {date}</p>
      </div>
    </div>

    )
}