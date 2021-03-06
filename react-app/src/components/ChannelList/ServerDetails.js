import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useHistory, Redirect } from "react-router-dom";
import * as serverActions from "../../store/servers";
import style from "./ChannelList.module.css";
import EditServer from "../EditServer";
import InvitePeople from "../InvitePeople";

const ServerDetails = () => {
  const { serverId } = useParams();
  const dispatch = useDispatch();
  const server = useSelector((state) => state.servers[serverId]);
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const [editServerModalActive, setEditServerModalActive] = useState(false);
  const [serverSettingsModal, setServerSettingsModal] = useState(false);
  const [inviteActive, setInviteActive] = useState(false);

  const serverSettingsMenu = document.getElementById(
    `serverSettingsMenu-${serverId}`
  );
  const serverMenuDropdown = document.getElementById("serverMenuDropdown");
  const serverMenuIcon = document.getElementById(`serverMenuIcon-${serverId}`);

  const inviteIcon = (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="M21.2727 2.72727H24V4.54545H21.2727V7.27273H19.4545V4.54545H16.7273V2.72727H19.4545V0H21.2727V2.72727ZM11.2727 10.9091C13.2773 10.9091 14.9091 9.27727 14.9091 7.27273C14.9091 5.26818 13.2773 3.63636 11.2727 3.63636C9.26818 3.63636 7.63636 5.26818 7.63636 7.27273C7.63636 9.27727 9.26818 10.9091 11.2727 10.9091ZM11.2727 11.8182C6.99 11.8182 4 14.0609 4 17.2727V18.1818H18.5455V17.2727C18.5455 14.0609 15.5555 11.8182 11.2727 11.8182Z"
      />
    </svg>
  );

  const editIcon = (
    <svg
      class="icon-LYJorE"
      aria-hidden="false"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <path
        clip-rule="evenodd"
        d="M19.2929 9.8299L19.9409 9.18278C21.353 7.77064 21.353 5.47197 19.9409 4.05892C18.5287 2.64678 16.2292 2.64678 14.817 4.05892L14.1699 4.70694L19.2929 9.8299ZM12.8962 5.97688L5.18469 13.6906L10.3085 18.813L18.0201 11.0992L12.8962 5.97688ZM4.11851 20.9704L8.75906 19.8112L4.18692 15.239L3.02678 19.8796C2.95028 20.1856 3.04028 20.5105 3.26349 20.7337C3.48669 20.9569 3.8116 21.046 4.11851 20.9704Z"
        fill="currentColor"
      ></path>
    </svg>
  );

  const disableServerIcon = (
    <svg
      class="icon-LYJorE"
      aria-hidden="false"
      width="18"
      height="18"
      viewBox="0 0 24 24"
    >
      <path d="M10.418 13L12.708 15.294L11.292 16.706L6.586 11.991L11.294 7.292L12.707 8.708L10.41 11H21.949C21.446 5.955 17.177 2 12 2C6.486 2 2 6.487 2 12C2 17.513 6.486 22 12 22C17.177 22 21.446 18.046 21.949 13H10.418Z"></path>
    </svg>
  );

  let invitePeople;
  let editServer;
  let deleteServer;
  let leaveServer;

  const dropdown = document.getElementById(`serverSettingsMenu-${serverId}`);
  dropdown?.focus();

  const invitePeopleLink = () => {
    setServerSettingsModal(false);
    setInviteActive(true);
  };

  const editServerBtn = () => {
    setEditServerModalActive(true);
  };

  const deleteServerBtn = () => {
    dispatch(serverActions.deleteServerThunk(+serverId))
      .then(() => dispatch(serverActions.getServersThunk()))
      .then(() => history.push("/servers/@me"));
  };

  const leaveServerBtn = () => {
    dispatch(serverActions.deleteMemberThunk(serverId))
      .then(() => dispatch(serverActions.getServersThunk()))
      .then(() => history.push("/servers/@me"));
  };

  if (+sessionUser?.id === +server?.owner_id) {
    invitePeople = (
      <div className={style.settingLink} onClick={invitePeopleLink}>
        <div className={style.inviteLink}>
          <p>Invite People</p>
          {inviteIcon}
        </div>
      </div>
    );

    editServer = (
      <div className={style.settingLink} onClick={editServerBtn}>
        <div className={style.stdServerLink}>
          <p>Edit Server</p>
          {editIcon}
        </div>
      </div>
    );

    deleteServer = (
      <div className={style.settingLink} onClick={deleteServerBtn}>
        <div className={style.disableOption}>
          <p>Delete Server</p>
          {disableServerIcon}
        </div>
      </div>
    );
  } else {
    leaveServer = (
      <div className={style.settingLink}>
        <div className={style.disableOption} onClick={leaveServerBtn}>
          <p>Leave Server</p>
          {disableServerIcon}
        </div>
      </div>
    );
  }

  const handleServerMenuDropdown = () => {
    if (serverSettingsModal === true) {
      setServerSettingsModal(false);
    } else {
      setServerSettingsModal(true);
    }
  };

  function editServerFunc() {
    return (
      <>
        {serverSettingsModal && (
          <>
            <div
              className={style.channelModalBackground}
              onClick={() => setEditServerModalActive(false)}
            ></div>
            <div id="channelModal" className={style.channelModalContainer}>
              <div className={style.channelModalWrapper}>
                <div className={style.newChannelModalHeading}>
                  <h2>Edit Server</h2>
                </div>
                <EditServer
                  setEditServerModalActive={setEditServerModalActive}
                  setServerSettingsModal={setServerSettingsModal}
                />
                <div
                  className={style.channelsCloseModal}
                  onClick={() => setEditServerModalActive(false)}
                >
                  <svg
                    className={style.channelsCloseX}
                    aria-hidden="false"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <>
      {inviteActive && <InvitePeople setInviteActive={setInviteActive} />}
      <div className={style.serverDetailsWrapper}>
        {editServerModalActive && editServerFunc()}
        <div
          id={`serverMenuDropdown-${serverId}`}
          className={style.serverMenuDropdown}
          onClick={handleServerMenuDropdown}
        >
          <p>{server?.name}</p>
          <i id={`serverMenuIcon-${serverId}`} className={style.iconOpen}></i>
        </div>
        {serverSettingsModal && (
          <div
            id={`serverSettingsMenu-${serverId}`}
            className={style.serverSettingsMenu}
            onBlur={(e) => setServerSettingsModal(false)}
          >
            {invitePeople}
            {editServer}
            {deleteServer}
            {leaveServer}
          </div>
        )}
      </div>
    </>
  );
};

export default ServerDetails;
