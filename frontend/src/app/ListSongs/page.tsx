'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios'; 

interface IPAsset {
  id: string;
  nftMetadata: {
    name: string;
    tokenContract: string;
    tokenId: string;
    tokenUri: string;
    imageUrl: string;
  };
}

interface IPAssetMetadata {
  title: string;
  description: string;
  watermarkImg?: string;
}

const API_BASE_URL = 'https://api.storyprotocol.net';

const ListSongs: React.FC = () => {
  const [assets, setAssets] = useState<IPAsset[]>([]);
  const [metadata, setMetadata] = useState<{ [key: string]: IPAssetMetadata }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch all the IP assets from the specific contract
    axios
      .post(
        `${API_BASE_URL}/api/v1/assets`,
        {
          options: {
            tokenContractIds: ['0x8Cd233A62e985b0FDF3C61332eA5390A76eaf8A5'],
          },
        },
        {
          headers: {
            'X-Api-Key': '4CWuPKSRTTxC7WvjPNsaZlAqJmrGL7OhNniUrZawdu8',
            'X-Chain': '1513',
          },
        }
      )
      .then(({ data }) => {
        setAssets(data.data); // assuming the response has a `data.data` structure
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      // Fetch metadata for each asset
      assets.forEach((asset) => {
        axios
          .get(`${API_BASE_URL}/api/v1/assets/${asset.id}/metadata`, {
            headers: {
              'X-Api-Key': '4CWuPKSRTTxC7WvjPNsaZlAqJmrGL7OhNniUrZawdu8',
              'X-Chain': '1513',
            },
          })
          .then(({ data }) => {
            setMetadata((prev) => ({
              ...prev,
              [asset.id]: {
                title: data.metadataJson.title || asset.nftMetadata.name,
                description: data.metadataJson.description || 'No description available',
                watermarkImg: data.metadataJson.watermarkImg || asset.nftMetadata.imageUrl,
              },
            }));
          })
          .catch((err) => console.error(err));
      });
    }
  }, [assets]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <div key={asset.id} className="card shadow-lg bg-base-100">
          <figure>
            <img
              src={metadata[asset.id]?.watermarkImg || 'https://via.placeholder.com/150'}
              alt={metadata[asset.id]?.title || 'Image not available'}
              className="w-full h-48 object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{metadata[asset.id]?.title}</h2>
            <p>{metadata[asset.id]?.description}</p>
            <div className="card-actions justify-end">
              <a
                href={`https://ipfs.io/ipfs/${asset.nftMetadata.tokenUri.split('ipfs://')[1]}`}
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                View NFT
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListSongs;
