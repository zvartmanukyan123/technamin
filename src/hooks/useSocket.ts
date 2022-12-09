import init from "../core/requests/init.json";
import ping from "../core/requests/ping.json";
import get from "../core/requests/get.json";
import { useState, useRef, useEffect } from 'react';
import { DataResponse, MessageData } from "../interfaces/Interfaces";
import { BASE_URL, INTERVAL } from "../core/constants";

export const useSocket = () => {
  const [data, setData] = useState<DataResponse[]>([]);
  const intervalId = useRef<null | NodeJS.Timer>(null);
  const initConnection = (ws: WebSocket) => ws.send(JSON.stringify(init));

  const keepConnection = (ws: WebSocket) => {
    intervalId.current = setInterval(
      () => ws.send(JSON.stringify(ping)),
      INTERVAL
    );
  };

  const addNewItem = (newItem: DataResponse) => {
    console.log("new item", newItem);
    setData((prevState) => {
      return [...prevState, { ...newItem }];
    });
  };

  const removeItem = (removeableItem: DataResponse) => {
    console.log("msg remove", removeableItem);
    const filteredData = data.filter((item) => item._id !== removeableItem._id);
    setData(filteredData);
  };
  const refreshData = (newData: DataResponse) => {
    const updateableDataIndex = data.findIndex(
      (item) => item._id === newData._id
    );
    console.log("updated", newData);
    setData((prevState) => {
      prevState[updateableDataIndex] = newData;
      return [...prevState];
    });
  };

  const updateData = (msg: MessageData) => {
    if (!msg.sid) {
      if (msg.data._new) {
        addNewItem(msg.data);
      }
      if (msg.data._remove) {
        removeItem(msg.data);
      }
    } else {
      refreshData(msg.data);
    }
  };

  useEffect(() => {
    const ws = new WebSocket(BASE_URL);

    ws.onopen = (event) => {
      initConnection(ws);
      keepConnection(ws);
    };

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      console.log(msg, "event message");
      try {
        if (msg.rid === init.rid) {
          ws.send(JSON.stringify(get));
        }

        // if (msg.rid === get.rid) {
        //   console.log(msg, "rid === get rid");
        //   setData(msg.data.data);
        // }
        updateData(msg);
      } catch (e) {
        console.log(e);
      }
    };

    return () => {
      ws.close();
      clearInterval(intervalId.current as NodeJS.Timer);
    };
  }, []);

  return data;
};
