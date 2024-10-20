'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SongDetails: React.FC = () => {
  const searchParams = useSearchParams();
  
  const metadata = JSON.parse(searchParams.get('metadata') || '{}');
  const nftMetadata = JSON.parse(searchParams.get('nftMetadata') || '{}');

  const [isCommercialUse, setIsCommercialUse] = useState(false);
  const [allowRemix, setAllowRemix] = useState(false);
  const [licenseCost, setLicenseCost] = useState('');
  const [royaltyPercentage, setRoyaltyPercentage] = useState('');
  const [allowRemixCommercialize, setAllowRemixCommercialize] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Send this data to your backend or handle it as needed
    console.log({
      isCommercialUse,
      allowRemix,
      licenseCost,
      royaltyPercentage,
      allowRemixCommercialize
    });
    // Close the modal
    (document.getElementById('licensing_modal') as HTMLDialogElement)?.close();
  };

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="btn btn-secondary mb-4">Back to List</Link>
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 pr-4">
          <img
            src={metadata.metadataJson?.watermarkImg || nftMetadata.imageUrl || 'https://via.placeholder.com/400'}
            alt={metadata.metadataJson?.title || 'Song image'}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="md:w-1/2 pl-4">
          <h1 className="text-3xl font-bold mb-4">{metadata.metadataJson?.title || nftMetadata.name}</h1>
          <p className="mb-4">{metadata.metadataJson?.description || 'No description available'}</p>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">NFT Details</h2>
            <p><strong>Contract:</strong> {nftMetadata.tokenContract}</p>
            <p><strong>Token ID:</strong> {nftMetadata.tokenId}</p>
            <p><strong>Token URI:</strong> {nftMetadata.tokenUri}</p>
          </div>
          <div className="mt-4 space-x-2">
            <a
              href={`https://ipfs.io/ipfs/${nftMetadata.tokenUri.split('ipfs://')[1]}`}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on IPFS
            </a>
            <button 
              className="btn btn-secondary" 
              onClick={() => (document.getElementById('licensing_modal') as HTMLDialogElement)?.showModal()}
            >
              Add Licensing Terms
            </button>
          </div>
        </div>
      </div>

      <dialog id="licensing_modal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="font-bold text-lg">Add Licensing Terms</h3>
          <form onSubmit={handleSubmit} className="py-4">
            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Allow IP for commercial usage?</span> 
                <input 
                  type="checkbox" 
                  checked={isCommercialUse} 
                  onChange={(e) => setIsCommercialUse(e.target.checked)} 
                  className="checkbox" 
                />
              </label>
            </div>
            {isCommercialUse && (
              <>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Cost to mint License Token:</span>
                  </label>
                  <input 
                    type="number" 
                    value={licenseCost} 
                    onChange={(e) => setLicenseCost(e.target.value)} 
                    className="input input-bordered" 
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Royalty Percentage:</span>
                  </label>
                  <input 
                    type="number" 
                    value={royaltyPercentage} 
                    onChange={(e) => setRoyaltyPercentage(e.target.value)} 
                    className="input input-bordered" 
                  />
                </div>
              </>
            )}

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text">Allow other people to remix your work?</span> 
                <input 
                  type="checkbox" 
                  checked={allowRemix} 
                  onChange={(e) => setAllowRemix(e.target.checked)} 
                  className="checkbox" 
                />
              </label>
            </div>

            {/* This block is only visible when both isCommercialUse and allowRemix are true */}
            {isCommercialUse && allowRemix && (
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Allow Others to commercialize the remixed work?</span> 
                  <input 
                    type="checkbox" 
                    checked={allowRemixCommercialize} 
                    onChange={(e) => setAllowRemixCommercialize(e.target.checked)} 
                    className="checkbox" 
                  />
                </label>
              </div>
            )}

            <div className="mt-4 text-sm text-gray-500">
              Note: Once a licensing term has been added, it cannot be edited or changed.
            </div>
            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Submit</button>
              <button type="button" className="btn" onClick={() => (document.getElementById('licensing_modal') as HTMLDialogElement)?.close()}>Close</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default SongDetails;
