
const convertToSlug = (value: string) =>  {
  const trimmedString = value.trim();
  const hyphenatedString = trimmedString.replace(/\s+/g, '-');  //Replace all remaining whitespace characters with hyphens
  return hyphenatedString.toLowerCase(); 
}

export default convertToSlug;