import {postApi,loginPostApi, deleteApi, getApi } from "../configuration";

export const CheckIn = async data =>  postApi("EmployeeAttendanceApi/CheckIn", {}, data);
export const CheckOut = async data =>  postApi("EmployeeAttendanceApi/CheckOut", {}, data);
export const CheckPoint = async data =>  postApi("EmployeeAttendanceApi/CheckPoint", {}, data);

export const GetAttendanceFeed = async () => getApi("EmployeeAttendanceApi/GetAttendanceFeed", {}, {});

export const GetMyTodayAttendance = async () => getApi("EmployeeAttendanceApi/GetMyTodayAttendance", {}, {});
export const GetMovementDetails = async () => getApi("EmployeeAttendanceApi/GetMovementDetails", {}, {});

export const GetMyTodayAttendanceadmin = async (userId) => getApi("EmployeeAttendanceApi/GetMyTodayAttendancedetail?userId="+userId, {}, {});
export const GetMovementDetailsadmin = async (userId) => getApi("EmployeeAttendanceApi/GetMovementDetailsinAtand?userId="+userId, {}, {});

export const GetMovementDetailsAll = async () => getApi("EmployeeAttendanceApi/GetMovementDetailsAll", {}, {});

export const GetAllEmployeeAttendanceWithMonth = async ( month,year) => getApi("EmployeeAttendanceApi/GetAllEmployeeAttendanceWithMonth?month="+month+"&year="+year, {}, {});
export const GetEmpInfoByUserId = async (userId,date) => getApi("EmployeeApi/GetEmpInfo?userId="+userId+"&date="+date, {}, {});
export const GetMonthlyAttendanceDetails = async ( userId,year,month) => getApi("EmployeeAttendanceApi/GetMonthlyAttendanceDetails?userId="+userId+"&year="+year+"&month="+month, {}, {});
export const GetAll = async () => getApi("EmployeeAttendanceApi/GetAll", {}, {});
export const GetUserId = async (empCode) => getApi("EmployeeAttendanceApi/GetUserId?empCode="+empCode, {}, {});

export const GetMyTodayAttendanceQRcode = async (UserId) => getApi("EmployeeAttendanceApi/GetMyTodayAttendanceQRcode?UserId="+UserId, {}, {});
export const GetMovementDetailsQRcode = async (UserId) => getApi("EmployeeAttendanceApi/GetMovementDetailsQRcode?UserId="+UserId, {}, {});


