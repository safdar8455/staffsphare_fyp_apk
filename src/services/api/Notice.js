import {postApi,loginPostApi, deleteApi, getApi } from "../configuration";
export const SaveNotice = async data =>  postApi("NoticeApi/Save", {}, data);
export const getNotice = async () => getApi("NoticeApi/GetAll", {}, {});
export const getNoticedetail = async (id) => getApi("NoticeApi/Get?id="+id, {}, {});

