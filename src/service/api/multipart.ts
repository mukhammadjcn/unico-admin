import { CreateFunc, EditFunc } from "../config/multipart";

export const ChangeUserPhotoConfig = (data: any) => {
  return CreateFunc(`/users/change_photo/`, data);
};
export const AddAccessUserConfig = (id: string, data: any) => {
  return CreateFunc(`admin/createAccessUser?testRuleId=${id}`, data);
};
export const AddLanguageApplicationConfig = (data: any) => {
  return CreateFunc(
    `/services/foreign-language-certificate/add_new_application/`,
    data
  );
};
export const UpdateLanguageApplicationConfig = (id: string, data: any) => {
  return EditFunc(
    `/portfolios/foreign-language-certificates/${id}/`,
    data,
    "PATCH"
  );
};
