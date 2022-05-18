// In a notification or a console message, messages are glitched when using color codes (§)
// This utility class will add a space at the end every time a color code is used to fix this issue

export default function processSpecialCharacters(str: string): string {
  const specialCharactersCount = str.split('§').length - 1;
  return str + ' '.repeat(specialCharactersCount);
}
