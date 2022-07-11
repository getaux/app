const prettyHex = (str: string, len = 4) =>
  str && `${str.substring(0, len)}...${str.substring(str.length - len)}`

export default prettyHex