const notImplemented = (scope) => (_req, res) => {
  res.status(501).json({
    success: false,
    message: `${scope} is scaffolded only. Business logic is not implemented yet.`,
  });
};

export const getUserProfile = notImplemented("User profile fetch");
export const updateUserProfile = notImplemented("User profile update");
