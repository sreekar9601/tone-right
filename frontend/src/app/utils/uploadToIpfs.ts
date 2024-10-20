'use server';
import pinataSDK from '@pinata/sdk';

export async function uploadJSONToIPFS(jsonMetadata: any): Promise<string> {
    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })
    const { IpfsHash } = await pinata.pinJSONToIPFS(jsonMetadata)
    return IpfsHash
}

export async function uploadFileToIPFS(file: File): Promise<string> {
    const form = new FormData();
    form.append('file', file);
    const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT })

    const options = {
        pinataMetadata: {
            name: file.name, // Use the file name or any custom name you prefer
        },
        pinataOptions: {
            cidVersion: 0 as 0 | 1, // Explicitly specify the type as 0 | 1
        },
    };

    const { IpfsHash } = await pinata.pinFileToIPFS(form, options);
    return IpfsHash; // This returns the IPFS hash of the uploaded file
}