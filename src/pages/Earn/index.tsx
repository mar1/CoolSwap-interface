import { Currency, ETHER, JSBI, TokenAmount, Token, ChainId } from '@uniswap/sdk';
import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'react-feather';
import { Text } from 'rebass';
import { ButtonDropdownLight } from '../../components/Button';
import { LightCard } from '../../components/Card';
import { AutoColumn, ColumnCenter } from '../../components/Column';
import CurrencyLogo from '../../components/CurrencyLogo';
import { EarnTabs } from '../../components/NavigationTabs';
import { MinimalPositionCard } from '../../components/PositionCard';
import Row from '../../components/Row';
import CurrencySearchModal from '../../components/SearchModal/CurrencySearchModal';
import { PairState, usePair } from '../../data/Reserves';
import { useActiveWeb3React } from '../../hooks';
import { usePairAdder } from '../../state/user/hooks';
import { useTokenBalance } from '../../state/wallet/hooks';
import { StyledInternalLink } from '../../theme';
import { currencyId } from '../../utils/currencyId';
import AppBody from '../AppBody';
import { Dots } from '../Pool/styleds';
import { BlueCard } from '../../components/Card';
import { TYPE } from '../../theme';
import { ethers } from 'ethers'
import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { lpAddress, lpABI} from './conf.js'

declare let window: any;

enum Fields {
  TOKEN0 = 0,
  TOKEN1 = 1,
}

export default function Earn() {
  const { account } = useActiveWeb3React();
  let LP = new Token(ChainId.MOONBEAM, '0x4f3D0bDcA59c31126E4D69A4Ed4Fe67CbEe97e6a', 18, 'BAN', 'Bananaswap')


  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [activeField, setActiveField] = useState<number>(Fields.TOKEN1);

  const [currency0, setCurrency0] = useState<Currency | null>(LP);
  const [currency1, setCurrency1] = useState<Currency | null>(null);

  const [pairState, pair] = usePair(currency0 ?? undefined, currency1 ?? undefined);
  const addPair = usePairAdder();
  useEffect(() => {
    if (pair) {
      addPair(pair);
    }
  }, [pair, addPair]);

  const validPairNoLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(
      pairState === PairState.EXISTS &&
        pair &&
        JSBI.equal(pair.reserve0.raw, JSBI.BigInt(0)) &&
        JSBI.equal(pair.reserve1.raw, JSBI.BigInt(0))
    );

  const position: TokenAmount | undefined = useTokenBalance(account ?? undefined, pair?.liquidityToken);
  const hasPosition = Boolean(position && JSBI.greaterThan(position.raw, JSBI.BigInt(0)));

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      if (activeField === Fields.TOKEN0) {
        setCurrency0(currency);
      } else {
        setCurrency1(currency);
      }
    },
    [activeField]
  );

  const handleSearchDismiss = useCallback(() => {
    setShowSearch(false);
  }, [setShowSearch]);

  
const Tabs = styled.div`
${({ theme }) => theme.flexRowNoWrap}
align-items: center;
border-radius: 3rem;
justify-content: space-evenly;
`;

const activeClassName = 'ACTIVE';

const StyledNavLink = styled(NavLink).attrs({
activeClassName,
})`
${({ theme }) => theme.flexRowNoWrap}
align-items: center;
justify-content: center;
height: 3rem;
border-radius: 3rem;
outline: none;
cursor: pointer;
text-decoration: none;
color: ${({ theme }) => theme.text3};
font-size: 20px;

&.${activeClassName} {
  border-radius: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.text1};
}

:hover,
:focus {
  color: ${({ theme }) => theme.text1};
}
`;

const ActiveText = styled.div`
font-weight: 500;
font-size: 20px;
`;

const StyledArrowLeft = styled(ArrowLeft)`
color: ${({ theme }) => theme.text1};
`;


  const prerequisiteMessage = (
    <LightCard padding="45px 10px">
      <Text textAlign="center">
        {!account ? 'Connect to a wallet to stake' : 'Select a token.'}
      </Text>
    </LightCard>
  );

    async function fetch() {


      let BANAmountd = window.document.querySelector("#test > div")
      if (BANAmountd) {
      BANAmountd.innerHTML = `<img src="https://bananaswap.vercel.app/bananascoin.png" width='34px;'></img><span style="padding-left: 0.3rem;">BANANAS LP</span><p id="tokenholded"></p>`
    }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner()
      const signerAddress = await signer.getAddress()
      const lpContract = new ethers.Contract(lpAddress, lpABI, provider);
      let balance = await lpContract.balanceOf(signerAddress);
      balance = ethers.utils.formatUnits(balance, 18)
      balance = Number(balance).toFixed(4)
      let tokd = window.document.getElementById('tokenholded')
      if (tokd) {
      tokd.innerText = balance
      }
    }fetch();

    function staking() {
      alert('staking')
    }

    function unstaking() {
      alert('unstaking')
    }

    const { t } = useTranslation();
  return (
    <AppBody>
      <EarnTabs active={'earn'}  />
      <Tabs style={{ marginBottom: '20px' }}>
      <StyledNavLink id={`earn-nav-link`} to={'/swap'}>
          {t('swap')}
        </StyledNavLink>
        <StyledNavLink
          id={`pool-nav-link`}
          to={'/pool'}
          isActive={(match, { pathname }) =>
            Boolean(match) ||
            pathname.startsWith('/add') ||
            pathname.startsWith('/remove') ||
            pathname.startsWith('/create') ||
            pathname.startsWith('/find')
          }
        >
          {t('pool')}
        </StyledNavLink>
        <StyledNavLink id={`earn-nav-link`} to={'/earn'}>
        {t('earn')}
      </StyledNavLink>
          </Tabs>
      <AutoColumn style={{ padding: '1rem' }} gap="md">
      <img src="https://bananaswap.vercel.app/bananascoin.png" width='150px' id='coinlogo'></img>
        <BlueCard>
          <AutoColumn gap="10px">
            <TYPE.link fontWeight={400} color={'primaryText1'}>
            <Text textAlign="center" id="text">Stake your LP tokens to get extra $BANANAS rewards !</Text>
            </TYPE.link>
          </AutoColumn>
        </BlueCard>
        <ButtonDropdownLight id="test"
          onClick={() => {
            setShowSearch(false);
            
          }}
        >
          {currency0 ? (
            <Row id="rod">
              <CurrencyLogo currency={LP} />
              <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
                {currency0.symbol}
              </Text>
            </Row>
          ) : (
            <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
              Select a Token
            </Text>
          )}
        </ButtonDropdownLight>

        <ColumnCenter>
        <Text fontWeight={500} fontSize={20} marginLeft={'12px'}>
              2 Transactions to validate
            </Text>
        </ColumnCenter>


</AutoColumn>
      <CurrencySearchModal
        isOpen={false}
        onCurrencySelect={handleCurrencySelect}
        onDismiss={handleSearchDismiss}
        showCommonBases
        selectedCurrency={LP}
      />
      <ButtonPrimary id="stake" onClick={staking}>
<Text fontWeight={500} fontSize={20}>
  Stake your LP tokens
</Text>
</ButtonPrimary>
      <Text fontWeight={500} fontSize={20}>
        <Text id="rewards-to-claim"></Text> 
      </Text>



<Text fontWeight={500} fontSize={20}>
        <Text id="ban-staked"></Text> 
      </Text>

      <ButtonSecondary id="unstake" onClick={unstaking}>
<Text fontWeight={500} fontSize={20}>
  Unstake your LP tokens <br></br> Claim 🍌
</Text>
</ButtonSecondary>
    </AppBody>
  );
          }