let { contas: accounts } = require("../database/database");
const { accountExists } = require("../utils/functions");

const validateDeposit = (req, res, next) => {
  try {
    const {
      numero_conta: numberAccount,
      valor: amount
    } = req.body;
    if (!numberAccount || !amount) {
      return res
        .status(400)
        .json({ erro: "O número da conta e o valor devem ser informados." });
    }
    const account = accountExists(numberAccount, accounts);
    if (!account) {
      return res
        .status(400)
        .json({ erro: "Conta informada não existe." });
    }
    if (amount <= 0) {
      return res
        .status(400)
        .json({ erro: "São permitidos depósitos de valores maiores que zero." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const validateWithdraw = (req, res, next) => {
  try {
    const {
      numero_conta: numberAccount,
      valor: amount,
      senha: accountPassword
    } = req.body;
    if (!numberAccount || !amount || !accountPassword) {
      return res
        .status(400)
        .json({ erro: "O número da conta, o valor e a senha devem ser informados." });
    }
    const account = accountExists(numberAccount, accounts);
    if (!account) {
      return res
        .status(400)
        .json({ erro: "Conta informada não existe." });
    }
    if (accountPassword !== account.usuario.senha) {
      return res
        .status(400)
        .json({ erro: "A senha informada está incorreta." });
    }
    if (amount <= 0) {
      return res
        .status(400)
        .json({ erro: "São permitidos apenas saques de valores maiores que zero." });
    }
    if (amount > account.saldo) {
      return res
        .status(400)
        .json({ erro: "O saque não pode ser superior ao saldo da conta." });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

const validateTransfer = (req, res, next) => {
  try {
    const {
      numero_conta_origem: originAccountNumber,
      numero_conta_destino: destinationAccountNumber,
      valor: amount,
      senha: accountPassword
    } = req.body;
    if (!originAccountNumber || !destinationAccountNumber || !amount || !accountPassword) {
      return res
        .status(400)
        .json({
          erro: "O número da conta de origem, o número da conta de destino, o valor e a senha devem ser informados."
        });
    }
    const originAccount = accountExists(originAccountNumber, accounts);
    const destinationAccount = accountExists(destinationAccountNumber, accounts);
    if (!originAccount) {
      return res
        .status(400)
        .json({ erro: "Conta de origem informada não existe." });
    }
    if (!destinationAccount) {
      return res
        .status(400)
        .json({ erro: "Conta de destino informada não existe." });
    }
    if (accountPassword !== originAccount.usuario.senha) {
      return res
        .status(400)
        .json({ erro: "A senha da conta de origem informada está incorreta." });
    }
    if (amount <= 0) {
      return res
        .status(400)
        .json({
          erro: "São permitidos apenas transferências de valores maiores que zero."
        });
    }
    if (amount > originAccount.saldo) {
      return res
        .status(400)
        .json({
          erro: "A transferência não pode ser superior ao saldo da conta de origem."
        });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ erro: "Erro do sistema." });
  }
};

module.exports = {
  validateDeposit,
  validateWithdraw,
  validateTransfer
};