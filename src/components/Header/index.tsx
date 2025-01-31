import { ChainId } from '@uniswap/sdk';
import React from 'react';
import { Text } from 'rebass';
//import { NavLink } from 'react-router-dom';
//import { darken } from 'polished';
import styled from 'styled-components';
//import { useTranslation } from 'react-i18next';

//import Logo from '../../assets/svg/logo.svg';
//import LogoDark from '../../assets/svg/logo_white.svg';
import { useActiveWeb3React } from '../../hooks';
import { useDarkModeManager } from '../../state/user/hooks';
import { useETHBalances } from '../../state/wallet/hooks';

import { LightCard } from '../Card';
import { Moon, Sun } from 'react-feather';
import Row, { RowFixed } from '../Row';
import Web3Status from '../Web3Status';
import { ethers } from 'ethers'
import { bananasAddress, bananasABI} from './conf.js'


import '../../style.css'

declare let window: any;

const HeaderFrame = styled.div`
  width: 100vw;
  margin: 0.8rem auto;
  padding: 0.8rem 1.6rem;
  z-index: 2;
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: 60px 1fr 120px;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    grid-template-columns: 60px 1fr;
  `};

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 0.5rem 1rem;
  `}
`;

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;
`;

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  ${({ theme }) => theme.mediaWidth.upToMedium`
   flex-direction: row-reverse;
    align-items: center;
  `};
`;

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRow = styled(RowFixed)`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `};
`;

const HeaderLinks = styled(Row)`
  width: auto;
  margin: 0 auto;
  padding: 0.3rem;
  justify-content: center;
  border-radius: 0.8rem;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;
  background-color: ${({ theme }) => theme.bg1};

  ${({ theme }) => theme.mediaWidth.upToLarge`
    margin: 0;
    margin-right: auto;
  `};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: fixed;
    bottom: 0;
    padding: .5rem;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 0;
    border-top: 1px solid ${({ theme }) => theme.bg3};
  `};
`;

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 0.8rem;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;

  :focus {
    border: 1px solid blue;
  }
`;

const HideSmall = styled.span`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const NetworkCard = styled(LightCard)`
  border-radius: 0.8rem;
  padding: 8px 12px;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`;

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`;

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
`;

const Icon = styled.div`
  transition: transform 0.3s ease;
  :hover {
    transform: scale(1.1);
  }
`;

//const activeClassName = 'ACTIVE';



export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg3};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.01) 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px, rgba(0, 0, 0, 0.04) 0px 16px 24px,
    rgba(0, 0, 0, 0.01) 0px 24px 32px;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg4};
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }
`;

const NETWORK_LABELS: { [chainId in ChainId]?: string } = {
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Goerli',
  [ChainId.KOVAN]: 'Kovan',
  [ChainId.MOONBEAM]: 'Moonbeam',
};

export default function Header() {
  const { account, chainId } = useActiveWeb3React();
  //const { t } = useTranslation();
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? ''];
  const [darkMode, toggleDarkMode] = useDarkModeManager();

  //const [isDark] = useDarkModeManager()
  async function fetchGLMB() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const signerAddress = await signer.getAddress()
    const bananasContract = new ethers.Contract(bananasAddress, bananasABI, provider);
    let tokens = await bananasContract.balanceOf(signerAddress)
    tokens = ethers.utils.formatUnits(tokens, 18)
    tokens = Number(tokens)
    let bansDiv = await window.document.getElementById("fetchGLMB")
   if (bansDiv) {
    bansDiv.innerText = `${tokens.toFixed(0)} 🍌`
   }
  }fetchGLMB();

  return (
    <HeaderFrame>
      <HeaderRow>
        <Title href="https://www.bananaswap.app">
        </Title>
      </HeaderRow>

      <HeaderLinks id="hlinks">

      </HeaderLinks>

      <HeaderControls>
        <HeaderElement>
        <HideSmall>
        <NetworkCard id="charts"><a id="chartslink" href="https://dexscreener.com/moonbeam/0x4f3d0bdca59c31126e4d69a4ed4fe67cbee97e6a" target="_blank">📊</a></NetworkCard> 
          </HideSmall>
          <HideSmall id="navbarel">
            {chainId && NETWORK_LABELS[chainId] && (
              <NetworkCard id="networkchain" title={NETWORK_LABELS[chainId]}>{NETWORK_LABELS[chainId]}</NetworkCard>
            )}
          </HideSmall>
          <AccountElement id="accountel" active={!!account} style={{ pointerEvents: 'auto' }}>
            {account && userEthBalance ? (
              <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                {userEthBalance?.toSignificant(4)} GLMR
              </BalanceText>
            ) : null}

            {account && userEthBalance ? (
              <BalanceText id="fetchGLMB" style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
              
              </BalanceText>
            ) : null}


            <Web3Status />
          </AccountElement>
        </HeaderElement>

      </HeaderControls>
      <Icon id="logo">
        <a href="https://www.bananaswap.app">
            <img src="./mainlogo.png" alt="logo" id="imglogo" />
            </a>
          </Icon>
    </HeaderFrame>
  );
}
