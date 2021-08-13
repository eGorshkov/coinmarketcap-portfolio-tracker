import type { Active, Portfolio, Transaction, User } from '../../common/types';

//#region TRANSACTIONS
export async function postTransaction(transaction: Transaction) {
  return fetch('https://localhost:5000/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
}

export async function putTransaction(transaction: Transaction) {
  return fetch('https://localhost:5000/transactions', {
    method: 'PUT',
    body: JSON.stringify(transaction),
  });
}

export async function deleteTransaction(transaction: Transaction) {
  return fetch('https://localhost:5000/transactions', {
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
  console.log('urlParams', urlParams);

  return fetch(
    `https://localhost:5000/transactions${urlParams && '?' + urlParams}`
  )
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
  console.log('urlParams', urlParams);
  return await fetch(`https://localhost:5000/actives${urlParams}`).then(
    (response: any) => response.json()
  );
}

export async function getActiveRisks() {
  return await fetch('https://localhost:5000/actives/get-risks').then(
    (response: any) => response.json()
  );
}

//#endregion

//#region RISKS
export async function getRisks() {
  return await fetch('https://localhost:5000/risks').then((response: any) =>
    response.json()
  );
}

export async function postRisks(data) {
  return await fetch('https://localhost:5000/risks', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
//#endregion

//#region PORTFOLIOS
export async function getPortfolios(): Promise<Portfolio[]> {
  return await fetch('https://localhost:5000/portfolios').then(
    (response: any) => response.json()
  );
}

export async function postPortfolios(data) {
  return await fetch('https://localhost:5000/portfolios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function putPortfolios(portfolio: Portfolio) {
  return fetch('https://localhost:5000/portfolios', {
    method: 'PUT',
    body: JSON.stringify(portfolio),
  });
}

export async function deletePortfolios(portfolio: Portfolio) {
  return fetch('https://localhost:5000/portfolios', {
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
  return await fetch('https://localhost:5000/users/login', {
    method: 'POST',
    body: JSON.stringify(props),
  }).then((response) => response.json());
}

export async function logoutUser(): Promise<any> {
  return await fetch('https://localhost:5000/users/logout');
}

export async function getUserData(): Promise<any> {
  return await fetch('https://localhost:5000/users/info').then((response) =>
    response.json()
  );
}

export async function getUsers(): Promise<any> {
  return await fetch('https://localhost:5000/users').then((response) =>
    response.json()
  );
}

//#endregion
