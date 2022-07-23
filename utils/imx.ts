export const imxEndpoint = process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ?
    'https://api.x.immutable.com' :
    'https://api.ropsten.x.immutable.com'