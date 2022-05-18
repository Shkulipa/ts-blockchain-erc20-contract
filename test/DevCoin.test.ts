import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import { DevCoin } from "../typechain";

describe("DevCoin", function () {
  let deployer: SignerWithAddress;
  let contract: DevCoin;
  const totalSupply = 1000;

  beforeEach(async function () {
    [deployer] = await ethers.getSigners();

    const DevCoin = await ethers.getContractFactory("DevCoin", deployer);
    contract = await DevCoin.deploy();
    await contract.deployed();
  });

  async function _parceTokens(balanceBigN: BigNumber): Promise<number> {
    const balanceNumber = Number(balanceBigN.toString());

    const tokenDecimals = await contract.decimals();
    return balanceNumber / Math.pow(10, tokenDecimals);
  }

  describe("init contract", function () {
    it("should be deployed", function () {
      return expect(contract.address).to.be.properAddress;
    });
  });

  describe("total supply", function () {
    it("deployer should get minet tokens", async function () {
      const getBalanceContract = await contract.totalSupply();
      const parseBalance = await _parceTokens(getBalanceContract);

      return expect(parseBalance).to.be.eq(totalSupply);
    });
  });

  describe("Get Coin", function () {
    it("deployer should get minet tokens", async function () {
      const getBalanceDeployer = await contract.balanceOf(deployer.address);
      const parseBalanceDeployer = await _parceTokens(getBalanceDeployer);
      return expect(parseBalanceDeployer).to.be.eq(totalSupply);
    });
  });
});
