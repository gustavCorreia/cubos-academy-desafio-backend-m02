let {
  contas: accounts,
  depositos: deposits,
  saques: withdraws,
  transferencias: transfers
} = require("../database/database");

let contadorConta = 1;

const { accountExists } = require("../utils/functions");

const showAccounts = (req, res) => {
  try {
    res
      .status(200)
      .json(accounts);
  } catch (erro) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const createAccount = (req, res) => {
  try {
    const {
      nome,
      email,
      cpf,
      data_nascimento,
      telefone,
      senha
    } = req.body;
    const newAccount = {
      numero: contadorConta++,
      saldo: 0,
      usuario: {
        nome,
        email,
        cpf,
        data_nascimento,
        telefone,
        senha
      }
    };
    accounts.push(newAccount);
    return res
      .status(201)
      .send();
  } catch (erro) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const updateAccountData = (req, res) => {
  try {
    const { numeroConta: numberAccount } = req.params;
    const {
      nome,
      email,
      cpf,
      data_nascimento,
      telefone,
      senha
    } = req.body;
    let accountForUpdate = accounts.find(
      account => account.numero === Number(numberAccount)
    );
    accountForUpdate.usuario = {
      nome,
      email,
      cpf,
      data_nascimento,
      telefone,
      senha
    };
    return res
      .status(201)
      .send();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const deleteAccount = (req, res) => {
  try {
    const { numeroConta: numberAccount } = req.params;
    accounts = accounts.filter(
      account => account.numero !== Number(numberAccount)
    );
    return res
      .status(200)
      .send();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const showBalance = (req, res) => {
  try {
    const { numero_conta: numberAccount } = req.query;
    const account = accountExists(numberAccount, accounts);
    return res
      .status(200)
      .json({ saldo: account.saldo });
  } catch (error) {
    return res
      .status(500)
      .json(error);
  }
};

const showExtract = (req, res) => {
  try {
    let { numero_conta: numberAccount } = req.query;
    numberAccount = Number(numberAccount);
    const depositsInThisAccount = deposits.filter(
      deposit => deposit.numero_conta === numberAccount);
    const withdrawsInThisAccount = withdraws.filter(
      withdraw => withdraw.numero_conta === numberAccount
    );
    const transfersSentFromThisAccount = transfers.filter(
      transfer => transfer.numero_conta_origem === numberAccount
    );
    const transfersReceivedFromThisAccount = transfers.filter(
      transfer => transfer.numero_conta_destino === numberAccount
    );
    const extract = {
      depositos: depositsInThisAccount,
      saques: withdrawsInThisAccount,
      transferenciasEnviadas: transfersSentFromThisAccount,
      transferenciasRecebidas: transfersReceivedFromThisAccount
    };
    return res
      .status(200)
      .json(extract);
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

module.exports = {
  showAccounts,
  createAccount,
  updateAccountData,
  deleteAccount,
  showBalance,
  showExtract
};