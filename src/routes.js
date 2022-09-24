const express = require("express");
const routes = express();

const {
  validateBankPassword,
  validateAccountCreation,
  validateAccountUpdate,
  validateAccountDeletion,
  validateBalance,
  validateExtract
} = require("./middlewares/accounts");

const {
  showAccounts,
  createAccount,
  updateAccountData,
  deleteAccount,
  showBalance,
  showExtract
} = require("./controllers/accounts");

const {
  validateDeposit,
  validateWithdraw,
  validateTransfer
} = require("./middlewares/transactions");

const {
  makeADeposit,
  makeAWithdraw,
  makeATransfer
} = require("./controllers/transactions");

routes.get("/contas", validateBankPassword, showAccounts);
routes.post("/contas", validateAccountCreation, createAccount);
routes.put("/contas/:numeroConta/usuario", validateAccountUpdate, updateAccountData);
routes.delete("/contas/:numeroConta", validateAccountDeletion, deleteAccount);
routes.get("/contas/saldo", validateBalance, showBalance);
routes.get("/contas/extrato", validateExtract, showExtract);
routes.post("/transacoes/depositar", validateDeposit, makeADeposit);
routes.post("/transacoes/sacar", validateWithdraw, makeAWithdraw);
routes.post("/transacoes/transferir", validateTransfer, makeATransfer);

module.exports = routes;