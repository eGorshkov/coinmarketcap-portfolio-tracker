import { xlink_attr } from 'svelte/internal';
import type {
  Active,
  Feature,
  Portfolio,
  Transaction,
  User,
} from '../../common/types';

//#region TRANSACTIONS
export async function postTransaction(transaction: Transaction) {
  return fetch('/api/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}

export async function putTransaction(transaction: Transaction) {
  return fetch('/api/transactions', {
    method: 'PUT',
    body: JSON.stringify(transaction),
  });
}

export async function deleteTransaction(transaction: Transaction) {
  return fetch('/api/transactions', {
    method: 'DELETE',
    body: JSON.stringify(transaction),
  });
}

export function getTransactions(cfg?: {
  activityId?: number;
  portfolioId?: number;
}): Promise<Transaction[]> {
  let urlParams = cfg
    ? Object.keys(cfg)
        .map((key) => cfg[key] && `${key}=${cfg[key]}`)
        .filter(Boolean)
        .join('&')
    : '';

  return fetch(`api/transactions${urlParams && '?' + urlParams}`)
    .then((response: any) => response.json())
    .then((transactions) =>
      transactions.map((x) => ({
        ...x,
        date: new Date(x.date),
      }))
    );
}

//#endregion

//#region ACTIVES
export async function getActives(
  portfolioId?: number | null
): Promise<Active[]> {
  let urlParams = '';
  portfolioId && (urlParams += `?portfolioId=${portfolioId}`);
  return await fetch(`/api/actives${urlParams}`).then((response: any) =>
    response.json()
  );
}

export async function getActiveRisks() {
  return await fetch('/api/actives/get-risks').then((response: any) =>
    response.json()
  );
}

//#endregion

//#region RISKS
export async function getRisks() {
  return await fetch('/api/risks').then((response: any) => response.json());
}

export async function postRisks(data) {
  return await fetch('/api/risks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
//#endregion

//#region PORTFOLIOS
export async function getPortfolios(): Promise<Portfolio[]> {
  return await fetch('/api/portfolios').then((response: any) =>
    response.json()
  );
}

export async function postPortfolios(data) {
  return await fetch('/api/portfolios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function putPortfolios(portfolio: Portfolio) {
  return fetch('/api/portfolios', {
    method: 'PUT',
    body: JSON.stringify(portfolio),
  });
}

export async function deletePortfolios(portfolio: Portfolio) {
  return fetch('/api/portfolios', {
    method: 'DELETE',
    body: JSON.stringify(portfolio),
  });
}

//#endregion

//#region USERS
export async function loginUser(props: {
  login: string;
  password: string;
}): Promise<any> {
  return await fetch('/api/users/login', {
    method: 'POST',
    body: JSON.stringify(props),
  }).then((response) => response.json());
}

export async function logoutUser(): Promise<any> {
  return await fetch('/api/users/logout');
}

export async function getUserData(): Promise<any> {
  return await fetch('/api/users/info').then((response) => response.json());
}

export async function getUsers(): Promise<any> {
  return await fetch('/api/users').then((response) => response.json());
}

//#endregion

//#region FEATURES
export async function getFeatures() {
  return await fetch('/api/features').then((response) => response.json());
}

export async function postFeatures(data) {
  return await fetch('/api/features', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function putFeatures(portfolio: Feature) {
  return fetch('/api/features', {
    method: 'PUT',
    body: JSON.stringify(portfolio),
  });
}

export async function deleteFeatures(portfolio: Feature) {
  return fetch('/api/features', {
    method: 'DELETE',
    body: JSON.stringify(portfolio),
  });
}
//#endregion
