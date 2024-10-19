import { http } from 'viem';
import { Account, privateKeyToAccount, Address } from 'viem/accounts';
import { StoryClient, StoryConfig, PIL_TYPE, RegisterIpAndAttachPilTermsResponse, AddressZero } from "@story-protocol/core-sdk";
import { uploadJSONToIPFS } from '../utils/uploadToIpfs'
import { createHash } from 'crypto'
import { mintNFT } from './mintNewNFT';
const privateKey: Address = `0x${process.env.WALLET_PRIVATE_KEY}`;
const account: Account = privateKeyToAccount(privateKey);

const main = async function(){const config: StoryConfig = {
  transport: http(process.env.RPC_PROVIDER_URL),
  account: account, // the account object from above
  chainId: 'iliad'
};
const client = StoryClient.newClient(config);

const ipMetadata = client.ipAsset.generateIpMetadata({
  title:"Neer - Mere Paas",
  description:"This is my first song",
  attributes:[
    {key:'Song Type', value: 'Single'}
  ]
})

const nftMetadata = {
  name: 'Test NFT',
  description: 'This is a test NFT',
  image: 'https://picsum.photos/200',
}

const ipIpfsHash = await uploadJSONToIPFS(ipMetadata)
const ipHash = createHash('sha256').update(JSON.stringify(ipMetadata)).digest('hex')
const nftIpfsHash = await uploadJSONToIPFS(nftMetadata)
const nftHash = createHash('sha256').update(JSON.stringify(nftMetadata)).digest('hex')

const tokenId = await mintNFT(account.address, `https://ipfs.io/ipfs/${nftIpfsHash}`)
const response: RegisterIpAndAttachPilTermsResponse = await client.ipAsset.registerIpAndAttachPilTerms({
  nftContract: '0x9aa4bc352f2f285640065c2e6e57f0f0ca33e4ad',
  tokenId:tokenId,
  pilType: PIL_TYPE.NON_COMMERCIAL_REMIX,
  mintingFee: 0, // empty - doesn't apply
  currency: AddressZero, // empty - doesn't apply
  ipMetadata: {
    ipMetadataURI: `https://ipfs.io/ipfs/${ipIpfsHash}`,
    ipMetadataHash: `0x${ipHash}`,
    nftMetadataURI: `https://ipfs.io/ipfs/${nftIpfsHash}`,
    nftMetadataHash: `0x${nftHash}`,
  },
  txOptions: { waitForTransaction: true },
  

})
console.log(`Root IPA created at transaction hash ${response.txHash}, IPA ID: ${response.ipId}`)
console.log(`View on the explorer: https://explorer.story.foundation/ipa/${response.ipId}`) 
}
