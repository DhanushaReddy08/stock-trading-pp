const notImplemented = (scope) => (_req, res) => {
  res.status(501).json({
    success: false,
    message: `${scope} is scaffolded only. Business logic is not implemented yet.`,
  });
};

export const listTransactions = notImplemented("Transaction list");
export const depositFunds = notImplemented("Transaction deposit");
export const withdrawFunds = notImplemented("Transaction withdraw");
