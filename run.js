const { ethers } = require("ethers");
const fs = require("fs");
const config = require("./config");

async function main() {
  try {
    const privateKey = fs.readFileSync("wallet.txt", "utf-8").trim();

    const provider = new ethers.JsonRpcProvider(config.RPC_URL);
    const wallet = new ethers.Wallet(privateKey, provider);

    const abi = JSON.parse(fs.readFileSync("abi_teagov.json"));

    const contract = new ethers.Contract(
      config.CONTRACT_ADDRESS,
      abi,
      wallet
    );

    const txParams = {
      value: ethers.parseEther("1"), // 1 TEA
      gasLimit: config.GAS_LIMIT,
      gasPrice: ethers.parseUnits(config.GAS_PRICE_GWEI, "gwei")
    };

    console.log("🔄 Mengirim transaksi...");
    const tx = await contract.deposit(txParams);

    console.log(`⏳ Menunggu konfirmasi: ${tx.hash}`);
    const receipt = await tx.wait();

    console.log(`
    ========== TRANSAKSI BERHASIL ==========
    Status:      ✅ Success
    Hash:        ${receipt.hash}
    Block:       #${receipt.blockNumber}
    Gas Used:    ${receipt.gasUsed.toString()}
    From:        ${wallet.address}
    To:          ${config.CONTRACT_ADDRESS}
    Value:       1 TEA
    Txn Fee:     ${ethers.formatEther(receipt.fee)} TEA
    `);

  } catch (error) {
    console.error(`
    ========== ERROR ==========
    Pesan: ${error.shortMessage || error.message}
    `);
    process.exit(1);
  }
}

main();
