'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const SongDetails: React.FC = () => {
  const searchParams = useSearchParams();
  
  const metadata = JSON.parse(searchParams.get('metadata') || '{}');
  const nftMetadata = JSON.parse(searchParams.get('nftMetadata') || '{}');

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
          <div className="mt-4">
            <a
              href={`https://ipfs.io/ipfs/${nftMetadata.tokenUri.split('ipfs://')[1]}`}
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              View on IPFS
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDetails;