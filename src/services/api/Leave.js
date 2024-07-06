import { postApi, getApi } from "../configuration/index";

export const createLeave = async data => postApi("LeaveApi/CreateLeave", {}, data);
export const acceptrequest = async data => postApi("LeaveApi/UpdateLeaveStatus", {}, data);


export const GetLeaevList = async () => getApi("LeaveApi/GetLeaveByCompanyId", {}, {});
export const GetUserLeaves = async (userId) => getApi("LeaveApi/GetUserLeaves?&userId=" + userId, {}, {});

//export const LeaveApproved = async (id, userId) => getApi("LeaveApi/Approved?id=" + id + "&userId=" + userId, {}, {});
export const LeaveRejected = async (id) => getApi("LeaveApi/Rejected?id=" + id, {}, {});
export const leaveCorrection = async (id) => getApi("LeaveApi/Correction?id=" + id, {}, {});
export const LeaveApproved = async (id) => getApi("LeaveApi/Approved?id=" + id, {}, {});



//user api 

export const GetUserPendingLeaves = async (userId) => getApi("LeaveApi/GetUserPendingLeaves?&userId=" + userId, {}, {});

export const GetLeaveStatusList = async () => getApi("LeaveApi/GetLeaveTypeList", {}, {});
//export const LeaveApproved = async data => postApi("LeaveApi/ApproveOrRejectLeave", {}, data);
