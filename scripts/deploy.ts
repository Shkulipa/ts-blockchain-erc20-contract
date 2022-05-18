import fs from "fs";
import path from "path";
import hre from "hardhat";
import { DevCoin } from "../typechain";

const ethers = hre.ethers;

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deployer: ", deployer.address);

  const DevCoinFactory = await ethers.getContractFactory("DevCoin");
  const devCoin = await DevCoinFactory.deploy();
  await devCoin.deployed();

  console.log("DevCoin deployed to:", devCoin.address);

  saveFrontendFiles({
    DevCoin: devCoin,
  });
}

function saveFrontendFiles(contracts: { DevCoin: DevCoin }): void {
  const contractsDir = path.join(__dirname, "/../..", "/client/contracts");
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  Object.entries(contracts).forEach((contractItem) => {
    const [name, contract] = contractItem;

    if (contract) {
      fs.writeFileSync(
        path.join(contractsDir, "/", name + "-contract-address.json"),
        JSON.stringify({ [name]: contract.address }, undefined, 2) // here address of contract
      );
    }

    const ContractArtifact = hre.artifacts.readArtifactSync(name);

    fs.writeFileSync(
      path.join(contractsDir, "/", name + ".json"),
      JSON.stringify(ContractArtifact, null, 2) // here abi of contract
    );
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
