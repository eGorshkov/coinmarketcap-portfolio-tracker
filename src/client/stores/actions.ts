import type { Active, Transaction } from '../../common/types';

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

export function getTransactions(activityId?: number) {
  const urlParams = activityId ? `?activityId=${activityId}` : '';
  return fetch(`https://localhost:5000/transactions${urlParams}`).then(
    (response: any) => response.json()
  );
}

export async function getActives() {
  return await fetch('https://localhost:5000/actives').then((response: any) =>
    response.json()
  );
}

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

export async function getActiveRisks() {
  return await fetch('https://localhost:5000/actives/get-risks').then(
    (response: any) => response.json()
  );
}
