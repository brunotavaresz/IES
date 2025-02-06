import BeachConditionTab from "../BeachConditions/BeachStatsTab"
import SeeErrorModal from "../Error/SeeErrorModal"
import SeeErrorConfirmation from "../Error/SeeErrorconfirmation"
import CreateWarningModal from "../Warning/CreateWarningModal"
import React, { useState } from 'react';





export default function BeachCondition(){

    {/* funçoes para mudar a flag de cor */}
    // State to keep track of the selected button
  const [selectedButton, setSelectedButton] = useState(0);

  // Function to handle button click and set the selected button
  const handleButtonClick = (buttonIndex) => {
    setSelectedButton(buttonIndex);
  };

  const getButtonColor = (index) => {
    if (selectedButton === index) {
      if (index === 0) return 'fill-green-500'; // Green for index 0
      if (index === 1) return 'fill-yellow-500'; // Yellow for index 1
      if (index === 2) return 'fill-red-500'; // Red for index 2
    }
    return 'fill-gray-500'; // Default gray for other buttons
  };

    return(
<div class="w-full">

    <div class="px-4 mx-auto flex  justify-center text-center pt-40 ">
        <h1 class=" text-4xl font-extrabold tracking-tight leading-none text-black md:text-5xl lg:text-6xl ">BeachName</h1>
        
    </div>
        <div class="px-10 flex  items-start pt-10">
        
            
                <h1 class="w-2/5  text-4xl font-bold">Status:</h1>
                <div class="w-2/5 flex">
                {/* flag*/}
                <h1 id="green_flag" class=" text-4xl ">Flag:</h1>
                <div className="flex space-x-4">
      {[0, 1, 2].map((index) => (
        <button key={index} onClick={() => handleButtonClick(index)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            width="45"
            height="45"
            className={`ml-4 ${getButtonColor(index)}`}
          >
            <path
              d="m20.414 12 5.293-5.293A1 1 0 0 0 25 5H11V3a1 1 0 0 0-2 0v25H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-9h14a1 1 0 0 0 .707-1.707z"
              data-name="Flag"
            />
          </svg>
        </button>
      ))}
    </div>

            </div>
            <div className="w-1/5"></div>
            {/* warnings */}
            <button type="button" data-modal-target="Create_warning" data-modal-toggle="Create_warning" class="bg-gray-300 border border-gray-300 rounded-2xl  px-6 text-red-600 text-2xl font-bold hover:bg-gray-300 shadow-lg flex py-3">Add Beach Warning</button>
            
        </div>

        {/* dados a buscar da Api */}
       <div class="px-20 flex  items-start pt-10">
        <div className="w-2/5">
        <a class="text-3xl ">Water:  20.9ºC</a>
        </div>
        
        
        <div className="w-2/5">
        <a class="text-3xl "> Temperature:  20.9ºC</a>
        </div>
        
        <div className="w-1/5">
        <a class="text-3xl "> UV index: 3</a>
        </div>
        </div> 




        <div class="px-20 flex  items-start pt-10">
        <div className="w-2/5">
        <a class="text-3xl ">Cloud cover:  60%</a>
        </div>
        
        
        <div className="w-2/5">
        <a class="text-3xl "> Precipitation(mm/h):  20.9ºC</a>
        </div>
        
        <div className="w-1/5">
        <a class="text-3xl "> Wind: 7 km/h</a>
        </div>
        </div> 
       <div class=" justify-center px-40 pt-10">
       
        <BeachConditionTab></BeachConditionTab>
        </div>
        <div class=" d px-20 pt-20">
          <div className="flex">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="45" height="45" class="fill-red-500"><path d="m20.414 12 5.293-5.293A1 1 0 0 0 25 5H11V3a1 1 0 0 0-2 0v25H7a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-9h14a1 1 0 0 0 .707-1.707z"  data-name="Flag"/></svg>
        <button class=" text-4xl text-red-500  hover:text-red-800" data-modal-target="default-modal" data-modal-toggle="default-modal"type="button" >Report Data Error</button>
        </div>
        <div className="py-10"></div>

        </div>
        
        {/* modals */}
        <div id="default-modal" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
        <SeeErrorModal></SeeErrorModal>
        </div>
        <div id="confirmation" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
        <SeeErrorConfirmation></SeeErrorConfirmation>
        </div>
        <div id="Create_warning" tabindex="-1" aria-hidden="true" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm">
        <CreateWarningModal></CreateWarningModal>
        </div>

    
</div>)
}