import { useQuery } from "react-query";
import { getMyWaitingQueue } from "../services/waitingQueueService";

export const useMyWaitingQueue = () => {
  return useQuery(
    ["myWaitingQueue"],
    getMyWaitingQueue
  );
};