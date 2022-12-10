import init from "../core/requests/init.json";
import ping from "../core/requests/ping.json";
import get from "../core/requests/get.json";
import {useState, useRef, useEffect, useCallback} from "react";
import { DataResponse, MessageData } from "../interfaces/Interfaces";
import { BASE_URL, INTERVAL } from "../core/constants";

interface MsgData {
  data: DataResponse[];
  sid: string;
}

const initialData: MsgData = {
  data: [],
  sid: "",
};

export const useSocket = () => {
  const [message, setMessage] = useState<MsgData>(initialData);
  const intervalId = useRef<null | NodeJS.Timer>(null);
  const initConnection = (ws: WebSocket) => ws.send(JSON.stringify(init));

  const keepConnection = (ws: WebSocket) => {
    intervalId.current = setInterval(
      () => ws.send(JSON.stringify(ping)),
      INTERVAL
    );
  };

  const addNewItem = useCallback((newItem: DataResponse) => {
    setMessage((prevState) => {
      return {
        ...prevState,
        data: [...prevState.data, { ...newItem }]
      };
    });
  }, [setMessage]);

  const updateItem = useCallback((item: DataResponse) => {
    setMessage((prevState) => {
      return {
        ...prevState,
        data: prevState.data.map((match) => {
          if (match._id === item._id) {
            return item;
          }

          return match;
        })
      };
    });
  }, [setMessage]);

  const removeItem = useCallback((removeableItem: DataResponse) => {
    const filteredData = message.data.filter((item) => item._id !== removeableItem._id);
    setMessage({
      ...message,
      data: filteredData
    });
  }, [message, setMessage]);

  const refreshData = useCallback((newData: DataResponse[]) => {
    newData.forEach((item) => {

      if (!item._remove) {
        const existIndex = message.data.findIndex((ms) => ms._id === item._id);
        if (existIndex > -1) {
          updateItem(item);
        } else {
          addNewItem(item);
        }
      } else {
        removeItem(item);
      }
    })
  }, [message, updateItem, removeItem, addNewItem]);

  const updateData = useCallback((msg: MessageData) => {
    if (msg.data) {
      refreshData(msg.data);
    }
  }, [refreshData]);

  useEffect(() => {
    const ws = new WebSocket(BASE_URL);

    ws.onopen = (event) => {
      initConnection(ws);
      keepConnection(ws);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      try {
        if (msg.rid === init.rid) {
          ws.send(JSON.stringify(get));
        }

        // if (msg.rid === get.rid) {
        //   console.log(msg, "rid === get rid");
        //   setData(msg.data.data);
        // }
        if (msg.data.data?.length) {
          updateData({
            data: msg.data.data,
            rid: msg.rid,
            sid: msg.sid,
          });
        } else if (msg.data?.length && msg.rid) {
          updateData({
            data: msg.data,
            rid: msg.rid
          })
        }
      } catch (e) {
        console.log(e);
      }
    };

    return () => {
      ws.close();
      clearInterval(intervalId.current as NodeJS.Timer);
    };
  }, [updateData]);

  console.log(message);

  return message.data;
};
