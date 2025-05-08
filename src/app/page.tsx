"use client";

import { useState } from "react";
import {
  getRedemptionValue,
  getRedemptionValues,
} from "@stabilis/c9-shape-liquidity-getter";

interface RedemptionResult {
  xToken: string;
  yToken: string;
  isActive: boolean;
}

interface BatchResult {
  [key: string]: RedemptionResult;
}

export default function Home() {
  const [singleResult, setSingleResult] = useState<RedemptionResult | null>(
    null
  );
  const [batchResults, setBatchResults] = useState<BatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Input states
  const [componentAddress, setComponentAddress] = useState(
    "component_rdx1cpqcstnjnj5cpag7wc04y6t4azrfxjtr3g53jdpv4y72m0lpp8qkf4"
  );
  const [stateVersion, setStateVersion] = useState("282256254");
  const [singleNftId, setSingleNftId] = useState("");
  const [nftIds, setNftIds] = useState<string[]>([""]);
  const [newNftId, setNewNftId] = useState("");
  const [lowerPriceBound, setLowerPriceBound] = useState("");
  const [upperPriceBound, setUpperPriceBound] = useState("");

  const handleAddNftId = () => {
    if (newNftId.trim()) {
      setNftIds([...nftIds, newNftId.trim()]);
      setNewNftId("");
    }
  };

  const handleRemoveNftId = (index: number) => {
    setNftIds(nftIds.filter((_, i) => i !== index));
  };

  const getPriceBounds = () => {
    const lower = lowerPriceBound.trim()
      ? parseFloat(lowerPriceBound)
      : undefined;
    const upper = upperPriceBound.trim()
      ? parseFloat(upperPriceBound)
      : undefined;

    console.log("Price Bounds:", { lower, upper });

    if (lower !== undefined && upper !== undefined) {
      const bounds = [lower, upper] as [number, number];
      console.log("Final Price Bounds:", bounds);
      return bounds;
    }
    return undefined;
  };

  const handleSingleCheck = async () => {
    if (!singleNftId.trim()) {
      setError("Please enter an NFT ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const params = {
        componentAddress,
        nftId: singleNftId.trim(),
        stateVersion: parseInt(stateVersion),
        priceBounds: getPriceBounds(),
      };
      console.log("Single Check Params:", params);
      const result = await getRedemptionValue(params);
      console.log("Single Check Result:", result);
      setSingleResult(result);
    } catch (err) {
      console.error("Single Check Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleBatchCheck = async () => {
    const validNftIds = nftIds.filter((id) => id.trim());
    if (validNftIds.length === 0) {
      setError("Please add at least one NFT ID");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const params = {
        componentAddress,
        nftIds: validNftIds,
        stateVersion: parseInt(stateVersion),
        priceBounds: getPriceBounds(),
      };
      console.log("Batch Check Params:", params);
      const results = await getRedemptionValues(params);
      console.log("Batch Check Results:", results);
      setBatchResults(results);
    } catch (err) {
      console.error("Batch Check Error:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">
          NFT Redemption Value Checker
        </h1>

        {/* Common Input Fields */}
        <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div>
            <label
              htmlFor="componentAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Component Address
            </label>
            <input
              type="text"
              id="componentAddress"
              value={componentAddress}
              onChange={(e) => setComponentAddress(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter component address"
            />
          </div>
          <div>
            <label
              htmlFor="stateVersion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              State Version
            </label>
            <input
              type="number"
              id="stateVersion"
              value={stateVersion}
              onChange={(e) => setStateVersion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter state version"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="lowerPriceBound"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Lower Price Bound (optional)
              </label>
              <input
                type="number"
                id="lowerPriceBound"
                value={lowerPriceBound}
                onChange={(e) => setLowerPriceBound(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter lower bound"
                step="any"
              />
            </div>
            <div>
              <label
                htmlFor="upperPriceBound"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Upper Price Bound (optional)
              </label>
              <input
                type="number"
                id="upperPriceBound"
                value={upperPriceBound}
                onChange={(e) => setUpperPriceBound(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter upper bound"
                step="any"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2">
          {/* Single NFT Check */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Single NFT Check</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="singleNftId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  NFT ID
                </label>
                <input
                  type="text"
                  id="singleNftId"
                  value={singleNftId}
                  onChange={(e) => setSingleNftId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter NFT ID"
                />
              </div>
              <button
                onClick={handleSingleCheck}
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Checking..." : "Check Single NFT"}
              </button>
            </div>

            {singleResult && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Results:</h3>
                <p>X Token Amount: {singleResult.xToken}</p>
                <p>Y Token Amount: {singleResult.yToken}</p>
                <p className="mt-2">
                  Status:{" "}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      singleResult.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {singleResult.isActive ? "Active" : "Inactive"}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Batch NFT Check */}
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Batch NFT Check</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NFT IDs
                </label>
                <div className="space-y-2">
                  {nftIds.map((nftId, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={nftId}
                        onChange={(e) => {
                          const newNftIds = [...nftIds];
                          newNftIds[index] = e.target.value;
                          setNftIds(newNftIds);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter NFT ID"
                      />
                      <button
                        onClick={() => handleRemoveNftId(index)}
                        className="px-3 py-2 text-red-600 hover:text-red-700"
                        aria-label="Remove NFT ID"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={newNftId}
                    onChange={(e) => setNewNftId(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add new NFT ID"
                  />
                  <button
                    onClick={handleAddNftId}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              <button
                onClick={handleBatchCheck}
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Checking..." : "Check Multiple NFTs"}
              </button>
            </div>

            {batchResults && (
              <div className="mt-4 space-y-4">
                <h3 className="font-medium">Results:</h3>
                {Object.entries(batchResults).map(([nftId, value]) => (
                  <div key={nftId} className="p-4 bg-gray-50 rounded-md">
                    <p className="font-medium mb-2">NFT: {nftId}</p>
                    <p>X Token Amount: {value.xToken}</p>
                    <p>Y Token Amount: {value.yToken}</p>
                    <p className="mt-2">
                      Status:{" "}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          value.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {value.isActive ? "Active" : "Inactive"}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
