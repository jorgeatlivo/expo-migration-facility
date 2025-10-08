export enum AuthStackRoutes {
  SignIn = 'SignIn',
  VerifyMFA = 'VerifyMFA',
  ForgotPassword = 'ForgotPassword',
}

export type AuthenticationStackParamslist = {
  [AuthStackRoutes.VerifyMFA]: {
    email: string;
    password: string;
  };
  [AuthStackRoutes.SignIn]: undefined;
  [AuthStackRoutes.ForgotPassword]: undefined;
};
