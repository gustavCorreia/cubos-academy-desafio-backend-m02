const accountNumber = (req) => {
  return Number(req.params.numeroConta);
};

const cpfAlreadyInUse = (cpf, accounts) => {
  return accounts.find(
    account => account.usuario.cpf === cpf
  );
};

const emailAlreadyInUse = (email, accounts) => {
  return accounts.find(
    account => account.usuario.email === email
  );
};

const accountExists = (accountNumber, accounts) => {
  return accounts.find(
    account => account.numero === Number(accountNumber)
  );
};

const invalidData = (req) => {
  const {
    nome,
    email,
    cpf,
    data_nascimento,
    telefone,
    senha
  } = req.body;

  if (!nome || !email || !cpf || !data_nascimento || !telefone || !senha) {
    return true;
  }
};

const validateRequest = (req, res, accounts) => {
  const {
    numero_conta: numberAccount,
    senha: accountPassword
  } = req.query;
  if (!numberAccount) {
    return res
      .status(400)
      .json({ erro: "O número da conta deve ser informado." });
  }
  if (!accountPassword) {
    return res
      .status(400)
      .json({ erro: "A senha da conta deve ser informada." });
  }
  const account = accounts.find(
    account => account.numero === Number(numberAccount)
  );
  if (!account) {
    return res
      .status(400)
      .json({ erro: "A conta informada não existe." });
  }
  if (accountPassword !== account.usuario.senha) {
    return res
      .status(400)
      .json({ erro: "A senha da conta informada está incorreta." });
  }
};

module.exports = {
  accountNumber,
  cpfAlreadyInUse,
  emailAlreadyInUse,
  accountExists,
  invalidData,
  validateRequest
};