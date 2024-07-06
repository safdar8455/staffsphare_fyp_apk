import {postApi,loginPostApi, deleteApi, getApi } from "../configuration";
//Login
export const Login = async data => loginPostApi("AttendanceAccountApi/Login", {}, data);

export const ChangePassword = async (userName, currentPassword, newPassword) => postApi("AttendanceProfileDetailsApi/ChangePassword/" +userName + "/" + currentPassword + "/" + newPassword,{},{},{});
export const GetUserClaim = async () => getApi("AttendanceProfileDetailsApi/GetUserClaims", {}, {});
export const ResetPassword = async data =>  postApi("AttendanceAccountApi/ResetPassword", {}, data);
export const updateDeviceIdentifier = async data =>  postApi("AttendanceProfileDetailsApi/updateDeviceIdentifier", {}, data);



