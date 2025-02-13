import { useAtom } from 'jotai';
import { BalanceVersion, PlayerInfo, PlayerInfoVersion, UserAddress, UserBalance } from '../jotai';
import { SuiAddress, TransactionBlock } from '@mysten/sui.js';
import { LoadObelisk } from '../tool';
import { NETWORK, WORLD_ID } from '../chain/config';
import { useEffect } from 'react';
import { FaucetNetworkType } from '@0xobelisk/client';

const GameHeader = () => {
  const [playerInfo, setPlayerInfo] = useAtom(PlayerInfo);
  const [balanceVersion, setBalanceVersion] = useAtom(BalanceVersion);
  const [playerInfoVersion, setPlayerInfoVersion] = useAtom(PlayerInfoVersion);
  const [address] = useAtom(UserAddress);
  const [blance] = useAtom(UserBalance);

  const registerGame = async () => {
    const obelisk = await LoadObelisk();
    const tx = new TransactionBlock();
    const world = tx.pure(WORLD_ID);
    const params = [world];
    const new_tx = await obelisk.tx.player_system.register(tx, params, true);
    const response = await obelisk.signAndSendTxn(new_tx as TransactionBlock);
    if (response.effects.status.status == 'success') {
      setPlayerInfoVersion(playerInfoVersion + 1);
    }
  };

  const buyAField = async () => {
    const obelisk = await LoadObelisk();
    const tx = new TransactionBlock();
    const world = tx.pure(WORLD_ID);
    const params = [world];
    const new_tx = await obelisk.tx.field_system.buy_a_field(tx, params, true);
    const response = await obelisk.signAndSendTxn(new_tx as TransactionBlock);
    if (response.effects.status.status == 'success') {
      setPlayerInfoVersion(playerInfoVersion + 1);
    }
  };

  useEffect(() => {
    const fetchPlayerInfo = async () => {
      if (address == '') return;
      const obelisk = await LoadObelisk();
      const result = await obelisk.getEntity(WORLD_ID, 'player_info', address);
      if (result) {
        const [score, field, register] = result;
        console.log(field, field == 0);
        setPlayerInfo({
          score,
          field,
          register,
          refresh: 0,
        });
      }
    };
    fetchPlayerInfo();
  }, [address, setPlayerInfo, playerInfoVersion]);

  return (
    <p className="mt-2">
      {playerInfo.register ? (
        <>
          <span className="ml-3">Score: {playerInfo.score}</span>

          {playerInfo.field != 0 ? (
            <span className="ml-3">field: {playerInfo.field}</span>
          ) : (
            <button onClick={buyAField} className="btn btn-primary ml-5">
              Buy a field
            </button>
          )}
        </>
      ) : (
        <span className="ml-3" onClick={registerGame}>
          <button className="btn btn-info">Register Game</button>
        </span>
      )}
    </p>
  );
};

export default GameHeader;
