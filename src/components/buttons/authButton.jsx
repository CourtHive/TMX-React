import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import { env } from 'config/defaults';
import { context } from 'services/context';
import { coms } from 'services/communications/SocketIo/coms';
import { TMXPopoverMenu } from 'components/menus/TMXPopoverMenu';

import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import EraseIcon from '@material-ui/icons/PhonelinkErase';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { green, red } from '@material-ui/core/colors';

import { setUserAuth } from 'services/tournamentAuthorization';

import { tmxStore } from 'stores/tmxStore';

import { tournamentEngine } from 'tods-competition-factory';

export function AuthButton() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [menuData, setMenuData] = useState();
  const authState = useSelector((state) => state.tmx.authState);

  const { tournamentRecord } = tournamentEngine.getState();

  const checkSameOrg = () => {
    const organisationId = env.org?.ouid;
    const tournamentOrgId = tournamentRecord?.unifiedTournamentId?.organisation?.organisationId;
    const isSameOrg = !tournamentOrgId || tournamentOrgId === organisationId;
    return isSameOrg;
  };

  const sameOrg = checkSameOrg();
  const authorized = context.state.authorized;

  const menuItems = [
    {
      icon: <VerifiedUserIcon />,
      id: 'generateKey',
      text: t('phrases.generatekey'),
      ignore: !sameOrg && !authorized,
      onClick: authorizeUser,
      className: 'auth-key',
      intent: 'success'
    },
    {
      icon: <ThumbUpIcon />,
      id: 'authorizeAdmin',
      text: t('administrator'),
      ignore: !sameOrg,
      disabled: authorized,
      onClick: authorizeAdmin,
      className: 'auth-admin',
      intent: 'success'
    },
    {
      icon: <EraseIcon />,
      id: 'revokeAuth',
      text: t('revoke'),
      ignore: !authorized,
      onClick: revokeAuthorization,
      className: 'auth-revoke',
      intent: 'warning'
    }
  ];

  const showMenu = (evt) => {
    setMenuData({ anchor: evt.target, open: true });
  };

  function onClose() {
    setMenuData({ open: false });
  }
  const authIndicator = authState ? green[500] : red[500];

  if (!sameOrg) return null;
  return (
    <span>
      <TMXPopoverMenu {...menuData} menuItems={menuItems} closeMenu={onClose} />
      <VerifiedUserIcon style={{ color: authIndicator, paddingTop: '.4em' }} onClick={showMenu} />
    </span>
  );
  // style={{ color: authIndicator, transform: 'rotate(-20deg)', marginLeft: '1em' }}

  function revokeAuthorization() {
    dispatch({
      type: 'alert dialog',
      payload: {
        title: t('phrases.revokeauth'),
        cancel: true,
        ok: revokeIt
      }
    });

    function revokeIt() {
      const { unifiedTournamentId } = tournamentRecord;
      const { tournamentId } = unifiedTournamentId; // TODO: Remove; update CHCS
      coms.emitTmx({ action: 'revokeAuthorization', payload: { tournamentId, unifiedTournamentId } });
      setUserAuth({ authorized: false });
    }
  }
}

function authorizeUser() {
  const uidate = new Date().getTime();
  const { tournamentRecord } = tournamentEngine.getState();
  const { unifiedTournamentId } = tournamentRecord;
  const { tournamentId } = unifiedTournamentId; // TODO: Remove; update CHCS
  const key_uuid = uidate.toString(36).slice(-6).toUpperCase();

  const payload = {
    key_uuid,
    content: {
      onetime: true,
      directive: 'authorize',
      content: {
        tournamentId, // TODO: Remove; update CHCS
        unifiedTournamentId,
        referee_key: env.org && env.org.keys && env.org.keys.referee,
        tournament: JSON.stringify(tournamentRecord),
        send_auth: context.state.authorized
      }
    },
    checkAuth: { admin: context.state.admin }
  };

  console.log('authorize user');
  coms.emitTmx({ action: 'pushKey', payload }, displayKey);

  function displayKey() {
    tmxStore.dispatch({
      type: 'alert dialog',
      payload: {
        title: 'Authorization Key',
        content: key_uuid
      }
    });
  }
}

function authorizeAdmin() {
  const uidate = new Date().getTime();
  const { tournamentRecord } = tournamentEngine.getState();
  const { unifiedTournamentId } = tournamentRecord;
  const { tournamentId } = unifiedTournamentId; // TODO: Remove; update CHCS
  const key_uuid = uidate.toString(36).slice(-6).toUpperCase();
  const payload = {
    key_uuid,
    content: {
      onetime: true,
      directive: 'authorize',
      content: {
        tournamentId,
        unifiedTournamentId,
        tournament: JSON.stringify(tournamentRecord),
        send_auth: context.state.authorized
      }
    },
    checkAuth: { admin: context.state.admin }
  };

  coms.emitTmx({ action: 'pushKey', payload }, submitKey);

  function submitKey() {
    coms.sendKey(key_uuid);
  }
}
