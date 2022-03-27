const COMPOUND_LIST = 'https://raw.githubusercontent.com/mar1/CoolSwap-interface/master/public/tokens.json';

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [COMPOUND_LIST];

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [COMPOUND_LIST];
