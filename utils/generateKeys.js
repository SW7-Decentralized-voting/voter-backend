import ethers from 'ethers';

async function generateEthereumKeys(numKeys) {
  const keys = [];
  for (let i = 0; i < numKeys; i++) {
    const wallet = ethers.Wallet.createRandom();
    keys.push({
      address: wallet.address,
      privateKey: wallet.privateKey
    });
  }
  return keys;
}

export default generateEthereumKeys;