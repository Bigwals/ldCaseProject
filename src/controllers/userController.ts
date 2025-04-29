import { Request, Response } from "express";
import * as userModel from "../models/userModel";
import * as deviceModel from "../models/deviceModel";
import * as authService from "../services/authService";
import { sendOtpEMail } from "../services/mailService";
import { generateOTP } from "../utils/otpGenerator";
import { Messages } from "../constants/messages";
import { HttpStatus } from "../constants/status";

export const createUser = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { fullName, email, password, phone, address } = req.body;
    // return res.json(req.body);
    const hashedPassword = await authService.hashPassword(password);
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 2 * 60 * 1000).toISOString(); // 2 minutes from now
    // return res.json(expiresAt);

    const newUser = await userModel.createUser(
      fullName,
      email,
      hashedPassword,
      phone,
      address,
      otp,
      expiresAt
    );

    // Send OTP email
    await sendOtpEMail(email, fullName, otp);

    res.status(HttpStatus.CREATED).json({
      user: newUser,
      message: Messages.AUTH.REGISTER_SUCCESS,
    });
  } catch (err: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<any> => {
  const { email, otp } = req.body;

  const savedOtp = await userModel.getOTP(email);
  if (!savedOtp) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: Messages.USER.NOT_FOUND });
  }

  // return res.json(savedOtp);

  if (savedOtp.otp !== otp) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: Messages.AUTH.INVALID_OTP });
  }

  if (new Date(savedOtp.expires_at) < new Date()) {
    return res
      .status(HttpStatus.BAD_REQUEST)
      .json({ message: Messages.AUTH.OTP_EXPIRED });
  }

  await userModel.deleteOTP(email);
  return res.status(HttpStatus.OK).json({
    userId: savedOtp.email,
    message: Messages.AUTH.EMAIL_VERIFIED_SUCCESS,
  });
};

export const createProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, role, firmName, firmAddress, jobTitle } = req.body;
    const file = req.file;

    if (!file) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: "Document file is required" });
      return;
    }

    const filePath = `${req.file?.filename}`;

    const user = await userModel.findUserByEmail(email);

    if (!user) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: Messages.USER.NOT_FOUND,
      });
    }

    // Save profile data + filePath to DB here
    const createdUser = await userModel.createProfile(
      email,
      jobTitle,
      role,
      firmName,
      firmAddress,
      filePath
    );

    res.status(HttpStatus.CREATED).json({
      message: Messages.USER.PROFILE_CREATED_SUCCESS,
      // data: { role, firmName, firmAddress, jobTitle, document: filePath },
      data: { createdUser },
    });
  } catch (err: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, deviceId, deviceType } = req.body;
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: Messages.USER.NOT_FOUND });
      return;
    }

    const isMatch = await authService.comparePasswords(password, user.password);
    if (!isMatch) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: Messages.AUTH.INVALID_CREDENTIALS });
      return;
    }

    if (user.otp !== 0) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: Messages.AUTH.ACCOUNT_NOT_VERIFIED });
    }

    await deviceModel.createDeviceId(user.id, deviceId, deviceType);

    const token = authService.generateToken({ userId: user.id });
    res.json({ message: Messages.AUTH.LOGIN_SUCCESS, user, token });
  } catch (err: any) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
  }
};
