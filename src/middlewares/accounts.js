let {
  contas: accounts,
  banco
} = require("../database/database");

const {
  cpfAlreadyInUse,
  emailAlreadyInUse,
  accountExists,
  invalidData,
  validateRequest
} = require("../utils/functions");

const validateBankPassword = (req, res, next) => {
  try {
    const { senha_banco: password } = req.query;
    if (!password) {
      return res
        .status(400)
        .json({ erro: "A senha precisa ser informada." });
    }
    if (password !== banco.senha) {
      return res
        .status(400)
        .json({ erro: "A senha está incorreta." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const validateAccountCreation = (req, res, next) => {
  try {
    const { email, cpf } = req.body;
    if (invalidData(req)) {
      return res
        .status(400)
        .json({ erro: "Todos os dados devem ser preenchidos." });
    }
    if (cpfAlreadyInUse(cpf, accounts)) {
      return res
        .status(400)
        .json({ erro: "O CPF já está em uso." });
    }
    if (emailAlreadyInUse(email, accounts)) {
      return res
        .status(400)
        .json({ erro: "O Email já está em uso." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const validateAccountUpdate = (req, res, next) => {
  try {
    const { numeroConta: numberAccount } = req.params;
    const { email, cpf } = req.body;
    if (!accountExists(numberAccount, accounts)) {
      return res
        .status(400)
        .json({ erro: "A conta informada não existe." });
    }
    if (invalidData(req)) {
      return res
        .status(400)
        .json({ erro: "Todos os dados devem ser preenchidos." });
    }
    const accountsForVerification = accounts.filter(account => {
      return account.numero !== Number(numberAccount);
    });
    if (cpfAlreadyInUse(cpf, accountsForVerification)) {
      return res
        .status(400)
        .json({ erro: "O CPF já está em uso." });
    }
    if (emailAlreadyInUse(email, accountsForVerification)) {
      return res
        .status(400)
        .json({ erro: "O Email já está em uso." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const validateAccountDeletion = (req, res, next) => {
  try {
    const { numeroConta: numberAccount } = req.params;
    const account = accountExists(numberAccount, accounts);
    if (!account) {
      return res
        .status(400)
        .json({ erro: "A conta informada não existe." });
    }
    if (account.saldo > 0) {
      return res
        .status(400)
        .json({ erro: "A conta só pode ser excluída se o saldo for zero." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const validateBalance = (req, res, next) => {
  try {
    const invalidRequest = validateRequest(req, res, accounts);
    if (invalidRequest) {
      return invalidRequest;
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const validateExtract = (req, res, next) => {
  try {
    const invalidRequest = validateRequest(req, res, accounts);
    if (invalidRequest) {
      return invalidRequest;
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

module.exports = {
  validateBankPassword,
  validateAccountCreation,
  validateAccountUpdate,
  validateAccountDeletion,
  validateBalance,
  validateExtract
};