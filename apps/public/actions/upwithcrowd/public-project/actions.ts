"use server";

import type {GetApiPublicProjectProjectListData} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import {structuredError, structuredResponse} from "@repo/utils/api";
import {getUpwithcrowd} from "@/utils/client";

export async function getPublicProjectsApi(data?: GetApiPublicProjectProjectListData) {
  try {
    const client = await getUpwithcrowd();
    const dataResponse = await client.publicProject.getApiPublicProjectProjectList({...data, maxResultCount: 999});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getPublicProjectDetailByIdApi(id: string) {
  try {
    const client = await getUpwithcrowd();
    const dataResponse = await client.publicProject.getApiPublicProjectProjectDetailById({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getPublicProjectByIdMembersApi(id: string) {
  try {
    const client = await getUpwithcrowd();
    const dataResponse = await client.publicProject.getApiPublicProjectByIdMembers({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}
