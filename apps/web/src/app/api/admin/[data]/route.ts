import type { Volo_Abp_Http_RemoteServiceErrorResponse } from "@ayasofyazilim/saas/AccountService";
import type {
  Volo_Abp_Identity_IdentityRoleCreateDto,
  Volo_Abp_Identity_IdentityRoleUpdateDto,
} from "@ayasofyazilim/saas/IdentityService";
import { ApiError } from "@ayasofyazilim/saas/IdentityService";
import type { NextRequest } from "next/server";
import {
  getAdministrationServiceClient,
  getIdentityServiceClient,
  getSaasServiceClient,
} from "src/lib";

type Clients = Record<string, any>;

const errorResponse = (message: string, status = 400) =>
  new Response(JSON.stringify({ message }), { status });

function isApiError(error: unknown): error is ApiError {
  if ((error as ApiError).name === "ApiError") {
    return true;
  }
  return error instanceof ApiError;
}

const clients: Clients = {
  role: async () => {
    const client = await getIdentityServiceClient();
    const role = client.role;
    return {
      get: async () => role.getApiIdentityRolesAll(),
      post: async (requestBody: Volo_Abp_Identity_IdentityRoleCreateDto) =>
        role.postApiIdentityRoles({ requestBody }),
      put: async ({
        id,
        requestBody,
      }: {
        id: string;
        requestBody: Volo_Abp_Identity_IdentityRoleUpdateDto;
      }) => role.putApiIdentityRolesById({ id, requestBody }),
      delete: async (id: string) => role.deleteApiIdentityRolesById({ id }),
    };
  },
  user: async (page: number, _filter: string) => {
    const client = await getIdentityServiceClient();
    const user = client.user;

    const f = JSON.parse(_filter || "{}");
    const filter = f?.filter;
    return {
      get: async () =>
        user.getApiIdentityUsers({
          maxResultCount: 10,
          skipCount: page * 10,
          filter,
        }),
      post: async (requestBody: any) =>
        user.postApiIdentityUsers({ requestBody }),
      put: async ({ id, requestBody }: { id: string; requestBody: any }) =>
        user.putApiIdentityUsersById({ id, requestBody }),
      delete: async (id: string) => user.deleteApiIdentityUsersById({ id }),
    };
  },
  edition: async () => {
    const client = await getSaasServiceClient();
    const edition = client.edition;
    return {
      get: async () => edition.getApiSaasEditionsAll(),
      post: async (requestBody: any) =>
        edition.postApiSaasEditions({ requestBody }),
      put: async ({ id, requestBody }: { id: string; requestBody: any }) =>
        edition.putApiSaasEditionsById({ id, requestBody }),
      delete: async (id: string) => edition.deleteApiSaasEditionsById({ id }),
    };
  },
  tenant: async (page: number, _filter: string) => {
    const client = await getSaasServiceClient();
    const tenant = client.tenant;

    const f = JSON.parse(_filter || "{}");
    const filter = f?.filter;
    return {
      get: async () =>
        tenant.getApiSaasTenants({
          maxResultCount: 10,
          skipCount: page * 10,
          filter,
        }),
      post: async (requestBody: any) =>
        tenant.postApiSaasTenants({ requestBody }),
      put: async ({ id, requestBody }: { id: string; requestBody: any }) =>
        tenant.putApiSaasTenantsById({ id, requestBody }),
      delete: async (id: string) => tenant.deleteApiSaasTenantsById({ id }),
    };
  },
  claimType: async (page: number, _filter: string) => {
    const client = await getIdentityServiceClient();
    const claimType = client.claimType;
    const f = JSON.parse(_filter || "{}");
    const filter = f?.filter;
    return {
      get: async () =>
        claimType.getApiIdentityClaimTypes({
          maxResultCount: 10,
          skipCount: page * 10,
          filter,
        }),
      post: async (requestBody: any) =>
        claimType.postApiIdentityClaimTypes({ requestBody }),
      put: async ({ id, requestBody }: { id: string; requestBody: any }) =>
        claimType.putApiIdentityClaimTypesById({ id, requestBody }),
      delete: async (id: string) =>
        claimType.deleteApiIdentityClaimTypesById({ id }),
    };
  },
  applications: async (page: number, _filter: string) => {
    const client = await getIdentityServiceClient();
    const applications = client.applications;
    const f = JSON.parse(_filter || "{}");
    const filter = f?.filter;
    return {
      get: async () =>
        applications.getApiOpeniddictApplications({
          maxResultCount: 10,
          skipCount: page * 10,
          filter,
        }),
      post: async (requestBody: any) =>
        applications.postApiOpeniddictApplications({ requestBody }),
      put: async ({ id, requestBody }: { id: string; requestBody: any }) =>
        applications.putApiOpeniddictApplicationsById({ id, requestBody }),
      delete: async (id: string) =>
        applications.deleteApiOpeniddictApplications({ id }),
    };
  },
  scopes: async (page: number, _filter: string) => {
    const client = await getIdentityServiceClient();
    const scopes = client.scopes;
    const f = JSON.parse(_filter || "{}");
    const filter = f?.filter;
    return {
      get: async () =>
        scopes.getApiOpeniddictScopes({
          maxResultCount: 10,
          skipCount: page * 10,
          filter,
        }),

      post: async (requestBody: any) =>
        scopes.postApiOpeniddictScopes({ requestBody }),
      put: async ({ id, requestBody }: { id: string; requestBody: any }) =>
        scopes.putApiOpeniddictScopesById({ id, requestBody }),
      delete: async (id: string) => scopes.deleteApiOpeniddictScopes({ id }),
    };
  },
  languages: async (page: number, _filter: string) => {
    const client = await getAdministrationServiceClient();
    const languages = client.languages;
    const f = JSON.parse(_filter || "{}");
    const filter = f?.filter;
    return {
      get: async () =>
        languages.getApiLanguageManagementLanguages({
          maxResultCount: 10,
          skipCount: page * 10,
          filter,
        }),
      post: async (requestBody: any) =>
        languages.postApiLanguageManagementLanguages({ requestBody }),
      put: async ({ id, requestBody }: { id: string; requestBody: any }) =>
        languages.putApiLanguageManagementLanguagesById({ id, requestBody }),
      delete: async (id: string) =>
        languages.deleteApiLanguageManagementLanguagesById({ id }),
    };
  },
  culture: async () => {
    const client = await getAdministrationServiceClient();
    const languages = client.languages;
    return {
      get: async () => languages.getApiLanguageManagementLanguagesCultureList(),
    };
  },
  language_set_default: async () => {
    const client = await getAdministrationServiceClient();
    const languages = client.languages;
    return {
      put: async ({ id }: { id: string }) => {
        const result =
          await languages.putApiLanguageManagementLanguagesByIdSetAsDefault({
            id,
          });
        if (result === undefined) {
          return "success";
        }
        return result;
      },
    };
  },
  securityLogs: async (page: number, filter: string) => {
    const client = await getIdentityServiceClient();
    const securityLogs = client.securityLog;

    const f = JSON.parse(filter || "{}");
    const userName = f?.userName;
    const clientId = f?.clientId;
    const identity = f?.identity;
    const applicationName = f?.applicationName;
    const correlationId = f?.correlationId;
    const startTime = f?.startTime;
    const endTime = f?.endTime;

    return {
      get: async () =>
        securityLogs.getApiIdentitySecurityLogs({
          maxResultCount: 10,
          skipCount: page * 10,
          userName,
          clientId,
          identity,
          applicationName,
          correlationId,
          startTime,
          endTime,
        }),
    };
  },

  auditLogs: async (page: number, filter: string) => {
    const client = await getAdministrationServiceClient();
    const auditLogs = client.auditLogs;

    const f = JSON.parse(filter || "{}");
    const userName = f?.userName;
    const url = f?.url;
    const clientIpAddress = f?.clientIpAddress;
    const applicationName = f?.applicationName;
    const correlationId = f?.correlationId;
    const startTime = f?.startTime;
    const endTime = f?.endTime;
    const httpMethod = f?.httpMethod;
    const maxExecutionDuration = f?.maxExecutionDuration;
    const minExecutionDuration = f?.minExecutionDuration;

    return {
      get: async () =>
        auditLogs.getApiAuditLoggingAuditLogs({
          maxResultCount: 10,
          skipCount: page * 10,
          startTime,
          endTime,
          url,
          userName,
          applicationName,
          clientIpAddress,
          correlationId,
          httpMethod,
          maxExecutionDuration,
          minExecutionDuration,
        }),
    };
  },

  textTemplates: async (page: number) => {
    const client = await getAdministrationServiceClient();
    const textTemplates = client.textTemplateDefinitions;
    return {
      get: async () =>
        textTemplates.getApiTextTemplateManagementTemplateDefinitions({
          maxResultCount: 10,
          skipCount: page * 10,
          //filter: filter,
        }),
    };
  },

  languageTexts: async (page: number, _filter: string) => {
    const client = await getAdministrationServiceClient();
    const languageTexts = client.languageTexts;
    const f = JSON.parse(_filter || "{}");
    const filter = f?.filter;
    return {
      get: async (baseCultureName = "en", targetCultureName = "tr") =>
        languageTexts.getApiLanguageManagementLanguageTexts({
          baseCultureName,
          targetCultureName,
          maxResultCount: 10,
          skipCount: page * 10,
          filter,
        }),
    };
  },

  organization: async () => {
    const client = await getIdentityServiceClient();
    const organization = client.organizationUnit;
    return {
      get: async () => organization.getApiIdentityOrganizationUnitsAll(),
      post: async (requestBody: any) =>
        organization.postApiIdentityOrganizationUnits({ requestBody }),
      put: async ({ id, requestBody }: { id: string; requestBody: any }) =>
        organization.putApiIdentityOrganizationUnitsById({ id, requestBody }),
      delete: async (id: string) =>
        organization.deleteApiIdentityOrganizationUnits({ id }),
    };
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { data: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page");
  const filter = searchParams.get("filter");
  if (!clients[params.data]) {
    // return status 404
    return errorResponse("Invalid data type");
  }
  const client = await clients[params.data](page, filter);
  try {
    const data = await client.get();
    return new Response(JSON.stringify(data));
  } catch (error: unknown) {
    if (isApiError(error)) {
      const body = error.body as Volo_Abp_Http_RemoteServiceErrorResponse;
      const message = body.error?.message || error.statusText;
      return errorResponse(message, error.status);
    }
    const errorText = `${(error as any)?.statusText} ${(error as any)?.status}`;
    return errorResponse(errorText, (error as any)?.status);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { data: string } }
) {
  if (!clients[params.data]) {
    return errorResponse("Invalid data type");
  }
  const client = await clients[params.data](request);
  const requestBody = await request.json();
  try {
    const roles = await client.post(requestBody);
    return new Response(JSON.stringify(roles));
  } catch (error: unknown) {
    if (isApiError(error)) {
      const body = error.body as Volo_Abp_Http_RemoteServiceErrorResponse;
      return errorResponse(
        body.error?.message || "Something went wrong",
        error.status
      );
    }
    return errorResponse("Something went wrong");
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { data: string } }
) {
  if (!clients[params.data]) {
    return errorResponse("Invalid data type");
  }
  let retVal = "something went wrong";
  const client = await clients[params.data](request);
  const id = await request.json();
  const deleteById = await client.delete(id);
  if (deleteById === undefined) retVal = "successfull";
  return new Response(JSON.stringify(retVal));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { data: string } }
) {
  if (!clients[params.data]) {
    return errorResponse("Invalid data type");
  }
  const client = await clients[params.data](request);
  const requestBody = await request.json();
  try {
    const roles = await client.put({
      id: requestBody.id,
      requestBody:
        requestBody.requestBody === undefined ? "" : requestBody.requestBody,
    });
    return new Response(JSON.stringify(roles));
  } catch (error: unknown) {
    if (isApiError(error)) {
      const body = error.body as Volo_Abp_Http_RemoteServiceErrorResponse;
      return errorResponse(
        body.error?.message || "Uknonw error occured on the server side",
        error.status
      );
    }
    return errorResponse("Uknonw error occured on the client/server side 1");
  }
}
