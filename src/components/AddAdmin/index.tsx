/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useAccount } from "wagmi";
import useAddAdmin from "@/hooks/useAddAdmin";
export const AddAdmin = () => {
  const [address, setAddress] = useState<string>("");
  const { address: connectedAddress } = useAccount();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { addAdmin } = useAddAdmin();
  const handleAddAdmin = async () => {
    if (!address) {
      //  console.log("The Admin is",address)
    }

    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return;
    }

    try {
      const result = await addAdmin(address);
      // console.log("Adding admin with address:", address, result);
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Admin</h2>

        <div className="mb-6">
          <label
            htmlFor="admin-address"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Admin Address
          </label>
          <input
            id="admin-address"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Ethereum address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="flex justify-center">
          {connectedAddress ? (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleAddAdmin}
              className={`py-3 px-8 rounded-lg font-medium ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? "Processing..." : "Add Admin"}
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleAddAdmin}
              className={`py-3 px-8 rounded-lg font-medium ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? "Processing..." : "Add Admin"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
