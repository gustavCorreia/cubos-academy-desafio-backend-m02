const { format } = require("date-fns");
const { accountExists } = require("../utils/functions");

let {
  contas: accounts,
  depositos: deposits,
  saques: withdraws,
  transferencias: transfers
} = require("../database/database");

const makeADeposit = (req, res) => {
  try {
    const {
      numero_conta: numberAccount,
      valor: amount
    } = req.body;
    let account = accountExists(numberAccount, accounts);
    account.saldo += amount;
    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const register = {
      numero_conta: Number(numberAccount),
      valor: amount,
      data: date
    };
    deposits.push(register);
    return res
      .status(201)
      .send();
  } catch (erro) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const makeAWithdraw = (req, res) => {
  try {
    const {
      numero_conta: numberAccount,
      valor: amount
    } = req.body;
    let account = accountExists(numberAccount, accounts);
    account.saldo -= amount;
    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const register = {
      numero_conta: Number(numberAccount),
      valor: amount,
      data: date
    };
    withdraws.push(register);
    return res
      .status(201)
      .send();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const makeATransfer = (req, res) => {
  try {
    const {
      numero_conta_origem: originAccountNumber,
      numero_conta_destino: destinationAccountNumber,
      valor: amount
    } = req.body;
    const originAccount = accountExists(originAccountNumber, accounts);
    const destinationAccount = accountExists(destinationAccountNumber, accounts);
    originAccount.saldo -= amount;
    destinationAccount.saldo += amount;
    const date = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const register = {
      numero_conta_origem: Number(originAccountNumber),
      numero_conta_destino: Number(destinationAccountNumber),
      valor: amount,
      data: date
    };
    transfers.push(register);
    return res
      .status(201)
      .send();
  } catch (erro) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

module.exports = {
  makeADeposit,
  makeAWithdraw,
  makeATransfer
};