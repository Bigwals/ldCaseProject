// src/models/userModel.ts

import knex from "../config/db";
import { User } from "../types/user";

export const createUser = async (
  fullName: string,
  email: string,
  password: string,
  phone: string,
  address: string,
  otp: number,
  expiresAt: string
): Promise<User> => {
  const [insertedId] = await knex("users").insert({
    fullName,
    email,
    password,
    phone,
    address,
    otp,
    expiresAt,
  });

  return {
    id: insertedId,
    fullName,
    email,
    password,
    phone,
    address,
    otp,
    expiresAt,
  };
};

export const createProfile = async (
  email: string,
  jobTitle: string,
  role: string,
  firmName: string,
  firmAddress: string,
  document: string
) => {
  await knex("users")
    .where({ email })
    .update({ jobTitle, role, firmName, firmAddress, document });
    
  const user = await knex<User>("users").where({ email }).first();

  return user || null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = await knex<User>("users").where({ email }).first();
  return user || null;
};

export const getOTP = async (email: string) => {
  return knex("users").where({ email }).orderBy("created_at", "desc").first();
};

export const deleteOTP = async (email: string) => {
  return knex("users").where({ email }).update({ otp: null, expiresAt: null });
};
