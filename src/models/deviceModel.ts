import knex from "../config/db";
import { User, Device } from "../types/user";

export const createDeviceId = async (
  userId: number,
  deviceId: string,
  deviceType: string
): Promise<Device> => {
  const [insertedId] = await knex("devices").insert({
    userId,
    deviceId,
    deviceType,
  });

  return {
    id: insertedId,
    userId,
    deviceId,
    deviceType,
  };
};
