import React from 'react'

//import { Contract } from 'web3-eth-contract'

//import {Button} from '../../../components/Button'
import { ButtonPrimary } from '../../../components/Button'
import { Text } from 'rebass'
import { farmAddress, farmABI} from '../conf.js'
import { ethers } from 'ethers'

declare let window: any;

/*
import useAllowance from '../../../hooks/useAllowance'
import useApprove from '../../../hooks/useApprove'
import useModal from '../../../hooks/useModal'
import useStake from '../../../hooks/useStake'
import useStakedBalance from '../../../hooks/useStakedBalance'
import useTokenBalance from '../../../hooks/useTokenBalance'
import useUnstake from '../../../hooks/useUnstake'

import { getDisplayBalance } from '../../../utils/formatBalance'

import DepositModal from './DepositModal'
import WithdrawModal from './WithdrawModal'
*/
//import imageUniswap from '../../../assets/img/logo-uniswap.svg'

interface StakeProps {
}


const Stake: React.FC<StakeProps> = ({ }) => {

async function unstake() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner()
  const signerAddress = await signer.getAddress()
  const farmContract = new ethers.Contract(farmAddress, farmABI, signer);
  const deposited = await farmContract.deposited("0", signerAddress)
  const withdraw = await farmContract.withdraw("0", deposited)
  console.log(withdraw)
}

async function fetchRewards() {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner()
  const signerAddress = await signer.getAddress()
  const farmContract = new ethers.Contract(farmAddress, farmABI, provider);
  let pending = await farmContract.pending("0", signerAddress)
  pending = ethers.utils.formatUnits(pending, 18)
  console.log(pending)
  let rewardsToReplace = window.document.getElementById('rewards-to-claim')
  rewardsToReplace.innerText = `${Number(pending).toFixed(4)} 🍌 to claim`

  let stakedBAN = await farmContract.userInfo("0", signerAddress)
  stakedBAN = ethers.utils.formatUnits(stakedBAN.amount, 18)
  console.log(stakedBAN)
  let stakedToReplace = window.document.getElementById('ban-staked')
  stakedToReplace.innerText = `${stakedBAN} 🍌 currently staked`

}
fetchRewards()


  return (
    <>
<ButtonPrimary id="unstake" onClick={unstake}>
<Text fontWeight={500} fontSize={20}>
  Unstake your LP tokens
</Text>
</ButtonPrimary>
      <Text fontWeight={500} fontSize={20}>
        <Text id="rewards-to-claim"></Text> 
      </Text>



<Text fontWeight={500} fontSize={20}>
        <Text id="ban-staked"></Text> 
      </Text>
</>
            )
}
export default Stake