'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

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
  id: string;
  metadataUri: string;
  nftTokenUri: string;
  metadataJson: {
    title: string;
    description: string;
    watermarkImg?: string;
  };
}

const API_BASE_URL = 'https://api.storyprotocol.net';

const ListSongs: React.FC = () => {
  const [assets, setAssets] = useState<IPAsset[]>([]);
  const [metadata, setMetadata] = useState<{ [key: string]: IPAssetMetadata }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
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
        setAssets(data.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (assets.length > 0) {
      assets.forEach((asset) => {
        axios
          .get(`${API_BASE_URL}/api/v1/assets/${asset.id}/metadata`, {
            headers: {
              'X-Api-Key': '4CWuPKSRTTxC7WvjPNsaZlAqJmrGL7OhNniUrZawdu8',
              'X-Chain': '1513',
            },
          })
          .then(({ data }) => {
            setMetadata((prev) => ({ ...prev, [asset.id]: data }));
            return axios.get(`https://ipfs.io/ipfs/${data.metadataUri.split('ipfs://')[1]}`);
          })
          .then(({ data }) => {
            setMetadata((prev) => ({
              ...prev,
              [asset.id]: {
                ...prev[asset.id],
                metadataJson: {
                  title: data.title || asset.nftMetadata.name,
                  description: data.description || 'No description available',
                  watermarkImg: data.watermarkImg || asset.nftMetadata.imageUrl,
                },
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
              src={metadata[asset.id]?.metadataJson.watermarkImg || 'https://via.placeholder.com/150'}
              alt={metadata[asset.id]?.metadataJson.title || 'Image not available'}
              className="w-full h-48 object-cover"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{metadata[asset.id]?.metadataJson.title}</h2>
            <p>{metadata[asset.id]?.metadataJson.description}</p>
            <div className="card-actions justify-end">
              <Link 
                href={{
                  pathname: `/song/${asset.id}`,
                  query: { 
                    metadata: JSON.stringify(metadata[asset.id]),
                    nftMetadata: JSON.stringify(asset.nftMetadata)
                  }
                }}
                className="btn btn-primary"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ListSongs;