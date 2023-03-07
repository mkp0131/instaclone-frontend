/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreateAccount
// ====================================================

export interface CreateAccount_createAccount {
  __typename: "MutationResponse";
  ok: boolean | null;
  error: string | null;
}

export interface CreateAccount {
  createAccount: CreateAccount_createAccount;
}

export interface CreateAccountVariables {
  firstName: string;
  username: string;
  email: string;
  password: string;
  lastName?: string | null;
}
