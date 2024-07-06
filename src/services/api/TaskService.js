import { postApi,  getApi } from "../configuration";

export const GetRelatedToMeTasks = async (userId) => getApi("TaskApi/GetRelatedToMeTasks?userId="+userId, {}, {});
export const GetTasksByCompanyId = async (companyId) => getApi("TaskApi/GetTasksByCompanyId?companyId="+companyId, {}, {});
export const SaveTask = async data =>  postApi("TaskApi/SaveTask", {}, data);
export const GetGroups = async (companyId) => getApi("TaskApi/GetGroups?companyId="+companyId, {}, {});
export const SaveTaskGroup = async data =>  postApi("TaskApi/SaveTaskGroup", {}, data);
export const TaskStatus = async () => getApi("TaskApi/GetTaskStatusList", {}, {});
export const GetTaskByGroup = async (groupId) => getApi("TaskApi/GetTasksByGroup?groupId="+groupId, {}, {});
export const deleteTask = async (taskId) => getApi("TaskApi/DeleteTask?id="+taskId, {}, {});
export const PriorityList = async () => getApi("TaskApi/GetPriorityList", {}, {});
export const SaveFile = async data =>  postApi("TaskApi/SaveTaskAttachment", {}, data);
export const GetTaskAttachments = async (taskId) => getApi("TaskApi/GetTaskAttachments?taskId="+taskId, {}, {});
export const EmployeeListCb = async () => getApi("TaskApi/GetEmployeeAsTextValue", {}, {});
export const GetAssignedToMeTasks = async (userId) => getApi("TaskApi/GetAssignedToMeTasks?userId="+userId, {}, {});
export const GetAllAssignTo = async (taskId) => getApi("TaskApi/GetAllAssignTo?taskId="+taskId, {}, {});






