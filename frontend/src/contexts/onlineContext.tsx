import React, { createContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";
import { RootState } from "store";
import { profileActions } from "store/slices/profile";
import { offlineQueueActions } from "store/slices/offlineQueue";
import { ActionNameTypes, ActionType } from "store/slices/offlineQueue";
import v1Api from "apis/v1";

interface Props {
  children: React.ReactNode;
}

export const OnlineContext = createContext<boolean>(navigator.onLine);

export const OnlineContextProvider: React.FC<Props> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  const [messageApi, contextHolder] = message.useMessage();
  const key = "offlineMessage";
  const openMessage = () => {
    messageApi.open({
      key,
      type: "warning",
      content: "You are currently offline editing mode",
      duration: 0
    });
  };

  const handleOnline = () => {
    setIsOnline(true);
  }
  const handleOffline = () => {
    setIsOnline(false);
    openMessage();
  }

  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);


  const dispatch = useDispatch();
  const offlineQueueState = useSelector((state: RootState) => state.offlineQueue);
  const actionsArray = [ ...offlineQueueState.actions ];

  const syncData = async (action: ActionType) => {
    switch (action.name) {
      case ActionNameTypes.UPDATE_BASIC_INFO:
        await v1Api.profile.updateOne(action.data.id!, action.data);
        break;
      case ActionNameTypes.ADD_EXPERIENCE:
        const response = await v1Api.experience.insertOne(action.data);
        dispatch(profileActions.addExperience(response?.data.data));
        break;
      case ActionNameTypes.UPDATE_EXPERIENCE_INFO:
        await v1Api.experience.updateOne(action.data.id!, action.data);
        break;
      case ActionNameTypes.DELETE_EXPERIENCE:
        await v1Api.experience.deleteOne(action.data.id);
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if (isOnline && actionsArray.length) {
      (async () => {
        messageApi.open({
          key,
          type: "loading",
          content: "Reconnecting and updating data",
          duration: 0,
        });
  
        while (actionsArray.length) {
          const action: ActionType = actionsArray[0];
          await syncData(action);
          
          actionsArray.shift();
        }
  
        messageApi.open({
          key,
          type: "success",
          content: "Information has been updated",
        });
        dispatch(offlineQueueActions.clear());
      })();
    }

    if (isOnline && !actionsArray.length) {
      messageApi.destroy(key);
    }
  }, [isOnline]);

  return (
    <>
      {contextHolder}
      <OnlineContext.Provider value={isOnline}>
        {children}
      </OnlineContext.Provider>
    </>
  );
};
