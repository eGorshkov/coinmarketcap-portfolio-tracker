const production = !process.env.ROLLUP_WATCH;
const domain = production ? '.shkovegor.dev' : 'localhost';
export default function setCookie(cookies) {
  return (cookies += `; path=/; SameSite=None; domain=${domain}; secure`);
}
