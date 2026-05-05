export function isValidUrlSlug(url: string) {
  const urlPattern =
    // eslint-disable-next-line max-len
    /^(https?:\/\/(localhost|[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}))\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/;
  return urlPattern.test(url);
}
