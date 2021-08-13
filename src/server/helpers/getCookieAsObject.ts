export default function getCookieAsObject(cookieString?: string): any {
  if (!cookieString) {
    return {};
  }
  return cookieString.split(/;[\s]+/).reduce((acc, x) => {
    let [k, v] = x.split('=');
    return { ...acc, [k]: v };
  }, {});
}
