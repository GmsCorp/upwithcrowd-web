"use server";

import type {
  GetApiProjectByIdUpdatePermissionData,
  GetApiProjectData,
} from "@ayasofyazilim/upwithcrowd-saas/UPWCService";
import {structuredResponse, structuredError, structuredSuccessResponse} from "@repo/utils/api";
import {getUpwithcrowd} from "@/utils/client";

export async function getProjectApi(data?: GetApiProjectData) {
  try {
    const client = await getUpwithcrowd();
    const dataResponse = await client.project.getApiProject(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}

export async function getPublicProjectDetailsFundingApi(id: string) {
  try {
    const client = await getUpwithcrowd();
    const dataResponse = await client.project.getApiProjectByIdFunding({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getProjectByIdMembersApi(id: string) {
  try {
    const client = await getUpwithcrowd();
    const dataResponse = await client.project.getApiProjectByIdMembers({id});
    return structuredResponse(dataResponse);
  } catch (error) {
    return structuredError(error);
  }
}

export async function getProjectByIdUpdatePermissionApi(data: GetApiProjectByIdUpdatePermissionData) {
  try {
    const client = await getUpwithcrowd();
    const dataResponse = await client.project.getApiProjectByIdUpdatePermission(data);
    return structuredSuccessResponse(dataResponse);
  } catch (error) {
    throw structuredError(error);
  }
}
