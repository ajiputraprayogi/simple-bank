const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SimpleBankModule", (m) => {
  const bank = m.contract("SimpleBank");
  return { bank };
});
