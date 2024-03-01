import { v4 as uuidv4 } from "uuid";

export const createUUID = async (): Promise<string> => {
  try {
    const uuid = await uuidv4();
    return uuid;
  } catch (error: any) {
    return error.message || error.stack || error;
  }
};
