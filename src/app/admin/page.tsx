"use client";
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import "rsuite/dist/rsuite-no-reset.min.css";
import Select from "react-select";
import { DatePicker } from "rsuite";
import { colorStyles } from "@/constants/contract";
import useCreateMarket from "@/hooks/useCreateMarket";
import { useAccount } from "wagmi";
import SettleMarkets from "@/components/Settlemarket";
import { AddAdmin } from "@/components/AddAdmin";


const categories = [
  {
    value: "Crypto Market",
    label: "Crypto",
  },
  {
    value: "Global Politics",
    label: "Politics",
  },
  {
    value: "Pop Culture",
    label: "Pop Culture",
  },
  {
    value: "Sports",
    label: "Sports",
  },
  {
    value: "Armored MMA",
    label: "AMMA",
  },
];

export default function AdminPortal() {
  const [heading, setHeading] = useState("");
  const [category, setCategory] = useState("");
  const [outcome1, setOutcome1] = useState("");
  const [outcome2, setOutcome2] = useState("");
  const [deadline, setDeadline] = useState(Number(new Date().getTime)/1000);
  const [image, setImage] = useState<string>("");
  const [canCreate, setCanCreate] = useState(false);

  const {address}=useAccount();

  useEffect(()=>{
    if(address===undefined || image === ""){
      setCanCreate(false)
    }else{
      setCanCreate(true)
    }
  },[address,image])
  const [action, setAction] = useState(0);

  
  const { createMarket } = useCreateMarket({
    heading,
    category,
    outcome1,
    outcome2,
    deadline,
    image,
  });
  useEffect(() => {
    const validateMarket = () => {
      if (
        heading == "" ||
        outcome1 == "" ||
        outcome2 == "" ||
        image == "" ||
        category == ""
    ) {
        setCanCreate(false);
        return;
      }

      setCanCreate(true);
      return;
    };
    validateMarket();
  }, [
    category,
    heading,
    image,
    outcome1,
    outcome2,
  ]);

  return (
    <main className="w-full max-w-6xl mx-auto p-6 bg-gray-100">
      <div className="flex items-center justify-between mb-8 border-b border-gray-300 pb-4">
        <div className="text-3xl font-bold text-gray-800">Market Dashboard</div>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          className={`py-2 px-6 rounded-lg font-medium ${action === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} 
          onClick={() => setAction(1)}
        >
          Create Market
        </button>
        <button 
          className={`py-2 px-6 rounded-lg font-medium ${action === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} 
          onClick={() => setAction(0)}
        >
          Settle Market
        </button>
        <button 
          className={`py-2 px-6 rounded-lg font-medium ${action === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} 
          onClick={() => setAction(2)}
        >
         Add Admin
        </button>
      </div>
      {action == 1 && (
        <>
          <div className="bg-white rounded-lg shadow-md p-6">
            <Box className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">Heading</span>
              <Box className="w-full">
                <input
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="string"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                  placeholder="Trump vs Biden"
                  required
                />
              </Box>
            </Box>
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Box className="w-full">
                <span className="block text-sm font-medium text-gray-700 mb-1">Outcome 1</span>
                <Box className="w-full">
                  <input
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="string"
                    id="numberInput"
                    name="numberInput"
                    value={outcome1}
                    onChange={(e) => setOutcome1(e.target.value)}
                    placeholder="Yes!"
                    required
                  />
                </Box>
              </Box>
              <Box className="w-full">
                <span className="block text-sm font-medium text-gray-700 mb-1">Outcome 2</span>
                <Box className="w-full">
                  <input
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="string"
                    id="numberInput"
                    name="numberInput"
                    value={outcome2}
                    onChange={(e) => setOutcome2(e.target.value)}
                    placeholder="No"
                    required
                  />
                </Box>
              </Box>
            </Box>
            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Box className="w-full">
                <span className="block text-sm font-medium text-gray-700 mb-1">Category</span>
                <Box className="w-full">
                  <Select
                    className="w-full"
                    styles={colorStyles}
                    options={categories}
                    onChange={(category) => {
                      if (category?.value) {
                        setCategory(category.value);
                      }
                    }}
                  />
                </Box>
              </Box>
              <Box className="w-full">
                <span className="block text-sm font-medium text-gray-700 mb-1">Deadline</span>
                <Box className="w-full">
                  <DatePicker
                    className="w-full"
                    placeholder="Select Deadline"
                    format="MM/dd/yyyy HH:mm"
                    onChange={(value) => setDeadline(value?.getTime() as number)}
                    value={new Date(deadline)}
                  />
                </Box>
              </Box>
            </Box>
            <Box className="mb-4">
              <span className="block text-sm font-medium text-gray-700 mb-1">Image</span>
              <Box className="w-full">
                  <input
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    required
                  />
              </Box>
            </Box>
            <Box className="flex justify-center">
                <button
                  disabled={!canCreate}
                  onClick={()=>{
                        createMarket()
                }}
                  className={`py-3 px-8 rounded-lg font-medium ${canCreate ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  {address !== undefined? "Create Market" : "Connect Wallet"} 
                </button>
            </Box>
          </div>
        </>
      )}
      {action == 0 && (
        <>
          <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-4">
            <div className="text-2xl font-bold text-gray-800">Settle Markets</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <SettleMarkets />
          </div>
        </>
      )}
      {
      action == 2 && (
          <>
            <div className="flex items-center justify-between mb-6 border-b border-gray-300 pb-4">
              <div className="text-2xl font-bold text-gray-800">Settle Markets</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <AddAdmin/>
            </div>
          </>
        )
      }
    </main>
  );
}