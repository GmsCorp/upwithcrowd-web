"use server";

import type {
  GetApiContractServiceMerchantsByIdContractsContractHeadersData,
  GetApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
  PostApiContractServiceMerchantsByIdContractsContractHeadersData,
  PostApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
} from "@ayasofyazilim/saas/ContractService";
import type {
  GetApiCrmServiceCustomsData,
  GetApiCrmServiceIndividualsData,
  GetApiCrmServiceMerchantsData,
  GetApiCrmServiceTaxOfficesData,
  PostApiCrmServiceCustomsByIdAffiliationsData,
  PostApiCrmServiceMerchantsByIdAffiliationsData,
  PostApiCrmServiceRefundPointsByIdAffiliationsData,
  PostApiCrmServiceTaxFreesByIdAffiliationsData,
  PostApiCrmServiceTaxOfficesByIdAffiliationsData,
  PutApiCrmServiceCustomsByIdEmailsByEmailIdData,
  PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceCustomsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
  PutApiCrmServiceMerchantsByIdData,
  PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameIdData,
  PutApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryIdData,
  PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData,
  PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceTaxFreesByIdEmailsByEmailIdData,
  PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData,
  PutApiCrmServiceTaxFreesByIdTelephonesByTelephoneIdData,
  PutApiCrmServiceTaxOfficesByIdEmailsByEmailIdData,
  PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData,
} from "@ayasofyazilim/saas/CRMService";
import type {
  GetApiExportValidationServiceExportValidationData,
  PostApiExportValidationServiceExportValidationData,
  PutApiExportValidationServiceExportValidationByIdData,
} from "@ayasofyazilim/saas/ExportValidationService";
import type {
  GetApiFinanceServiceBillingsData,
  PostApiFinanceServiceBillingsData,
  PutApiFinanceServiceBillingsByIdData,
} from "@ayasofyazilim/saas/FinanceService";
import type {
  GetApiIdentityClaimTypesData,
  GetApiIdentityRolesByIdClaimsData,
  GetApiIdentityRolesData,
  GetApiIdentityUsersByIdClaimsData,
  GetApiIdentityUsersData,
  PutApiIdentityRolesByIdClaimsData,
  PutApiIdentityRolesByIdMoveAllUsersData,
  PutApiIdentityUsersByIdChangePasswordData,
  PutApiIdentityUsersByIdClaimsData,
  PutApiIdentityUsersByIdTwoFactorByEnabledData,
  PutApiOpeniddictApplicationsByIdTokenLifetimeData,
} from "@ayasofyazilim/saas/IdentityService";
import type {
  GetApiLocationServiceCitiesData,
  GetApiLocationServiceCitiesGetListByRegionByRegionIdData,
  GetApiLocationServiceCountriesData,
  GetApiLocationServiceRegionsGetDefaultRegionIdByCountryIdData,
  GetApiLocationServiceRegionsGetListByCountryByCountryIdData,
} from "@ayasofyazilim/saas/LocationService";
import type {
  PutApiSaasEditionsByIdMoveAllTenantsData,
  PutApiSaasTenantsByIdSetPasswordData,
} from "@ayasofyazilim/saas/SaasService";
import type { GetApiTagServiceTagData } from "@ayasofyazilim/saas/TagService";
import type {
  GetApiTravellerServiceTravellersData,
  PostApiTravellerServiceTravellersData,
} from "@ayasofyazilim/saas/TravellerService";
import type { FilterColumnResult } from "@repo/ayasofyazilim-ui/molecules/tables/types";
import {
  getContractServiceClient,
  getCRMServiceClient,
  getExportValidationServiceClient,
  getFinanceServiceClient,
  getIdentityServiceClient,
  getLocationServiceClient,
  getSaasServiceClient,
  getTagServiceClient,
  getTravellersServiceClient,
  structuredError,
} from "src/lib";

export type ApiRequestTypes = keyof Awaited<ReturnType<typeof getApiRequests>>;
export type GetTableDataTypes = Exclude<
  ApiRequestTypes,
  "locations" | "editions" | "applications" | "tenants"
>;
export type DeleteTableDataTypes = Exclude<
  ApiRequestTypes,
  | "travellers"
  | "claims"
  | "roles"
  | "locations"
  | "users"
  | "tags"
  | "editions"
  | "applications"
  | "tenants"
>;
export type GetDetailTableDataTypes = Exclude<
  ApiRequestTypes,
  | "travellers"
  | "claims"
  | "roles"
  | "locations"
  | "users"
  | "tags"
  | "editions"
  | "billing"
  | "applications"
  | "tenants"
>;

export async function getApiRequests() {
  const crmClient = await getCRMServiceClient();
  const travellerClient = await getTravellersServiceClient();
  const contractsClient = await getContractServiceClient();
  const locationClient = await getLocationServiceClient();
  const identityClient = await getIdentityServiceClient();
  const saasClient = await getSaasServiceClient();
  const exportValidationClient = await getExportValidationServiceClient();
  const tagClient = await getTagServiceClient();
  const financeClient = await getFinanceServiceClient();
  const tableRequests = {
    merchants: {
      getDetail: async (id: string) =>
        (await crmClient.merchant.getApiCrmServiceMerchantsByIdDetail({ id }))
          .merchant,
      get: async (data: GetApiCrmServiceMerchantsData) =>
        await crmClient.merchant.getApiCrmServiceMerchants(data),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.merchant.getApiCrmServiceMerchantsByIdSubMerchants(
          data,
        ),
      getIndivuals: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.merchant.getApiCrmServiceMerchantsByIdAffiliations(
          data,
        ),
      deleteRow: async (id: string) =>
        await crmClient.merchant.deleteApiCrmServiceMerchantsByIdWithComponents(
          {
            id,
          },
        ),
      getBasicInformation: async (data: { id: string }) =>
        await crmClient.merchant.getApiCrmServiceMerchantsByIdBasicInformation(
          data,
        ),
      getAdresses: async (data: { id: string }) =>
        await crmClient.merchant.getApiCrmServiceMerchantsByIdAddresses(data),
      getContractHeadersByMerchantId: async (
        data: GetApiContractServiceMerchantsByIdContractsContractHeadersData,
      ) =>
        await contractsClient.contractsMerchant.getApiContractServiceMerchantsByIdContractsContractHeaders(
          data,
        ),
      postContractHeadersById: async (
        data: PostApiContractServiceMerchantsByIdContractsContractHeadersData,
      ) =>
        await contractsClient.contractsMerchant.postApiContractServiceMerchantsByIdContractsContractHeaders(
          data,
        ),
      getContractHeaderMissingStepsById: async (id: string) =>
        await contractsClient.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdGetMissingSteps(
          { id },
        ),
      getContractHeaderById: async (id: string) =>
        await contractsClient.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersById(
          { id },
        ),
      getContractHeaderContractSettingsByHeaderId: async (
        data: GetApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
      ) =>
        await contractsClient.contractsMerchant.getApiContractServiceMerchantsContractsContractHeadersByIdContractSettings(
          data,
        ),
      postContractHeaderContractSettingsByHeaderId: async (
        data: PostApiContractServiceMerchantsContractsContractHeadersByIdContractSettingsData,
      ) =>
        await contractsClient.contractsMerchant.postApiContractServiceMerchantsContractsContractHeadersByIdContractSettings(
          data,
        ),
      putMerchantBase: async (data: PutApiCrmServiceMerchantsByIdData) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsById({
          requestBody: data.requestBody,
          id: data.id,
        });
      },
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdAddressesByAddressId(
          data,
        );
      },

      putEmailAddress: async (
        data: PutApiCrmServiceMerchantsByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceMerchantsByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceMerchantsByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdOrganizationsByOrganizationId(
          data,
        );
      },
      putIndividualName: async (
        data: PutApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdIndividualByIndividualIdNameByNameId(
          data,
        );
      },
      putIndividualPersonalSummary: async (
        data: PutApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryIdData,
      ) => {
        return await crmClient.merchant.putApiCrmServiceMerchantsByIdIndividualByIndividualIdPersonalSummaryByPersonalSummaryId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceMerchantsByIdAffiliationsData,
      ) => {
        return await crmClient.merchant.postApiCrmServiceMerchantsByIdAffiliations(
          data,
        );
      },
    },
    "refund-points": {
      getDetail: async (id: string) =>
        await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdDetail({
          id,
        }),
      get: async (data: { maxResultCount: number; skipCount: number }) =>
        await crmClient.refundPoint.getApiCrmServiceRefundPoints(data),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdSubRefundPoints(
          data,
        ),
      getIndivuals: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.refundPoint.getApiCrmServiceRefundPointsByIdAffiliations(
          data,
        ),
      deleteRow: async (id: string) =>
        await crmClient.refundPoint.deleteApiCrmServiceRefundPointsByIdWithComponents(
          {
            id,
          },
        ),
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdAddressesByAddressId(
          data,
        );
      },
      putEmailAddress: async (
        data: PutApiCrmServiceRefundPointsByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceRefundPointsByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceRefundPointsByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.refundPoint.putApiCrmServiceRefundPointsByIdOrganizationsByOrganizationId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceRefundPointsByIdAffiliationsData,
      ) => {
        return await crmClient.refundPoint.postApiCrmServiceRefundPointsByIdAffiliations(
          data,
        );
      },
    },
    customs: {
      getDetail: async (id: string) =>
        await crmClient.customs.getApiCrmServiceCustomsByIdDetail({ id }),
      get: async (data: GetApiCrmServiceCustomsData) =>
        await crmClient.customs.getApiCrmServiceCustoms(data),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) => await crmClient.customs.getApiCrmServiceCustomsByIdSubCustoms(data),
      getIndivuals: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.customs.getApiCrmServiceCustomsByIdAffiliations(data),
      deleteRow: async (id: string) =>
        await crmClient.customs.deleteApiCrmServiceCustomsByIdWithComponents({
          id,
        }),
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.customs.putApiCrmServiceCustomsByIdAddressesByAddressId(
          data,
        );
      },
      putEmailAddress: async (
        data: PutApiCrmServiceCustomsByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.customs.putApiCrmServiceCustomsByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceCustomsByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.customs.putApiCrmServiceCustomsByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceCustomsByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.customs.putApiCrmServiceCustomsByIdOrganizationsByOrganizationId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceCustomsByIdAffiliationsData,
      ) => {
        return await crmClient.customs.postApiCrmServiceCustomsByIdAffiliations(
          data,
        );
      },
    },
    "tax-free": {
      getDetail: async (id: string) =>
        await crmClient.taxFree.getApiCrmServiceTaxFreesByIdDetail({ id }),
      get: async (data: { maxResultCount: number; skipCount: number }) =>
        await crmClient.taxFree.getApiCrmServiceTaxFrees(data),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.taxFree.getApiCrmServiceTaxFreesByIdSubTaxFree(data),
      getIndivuals: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.taxFree.getApiCrmServiceTaxFreesByIdAffiliations(data),

      deleteRow: async (id: string) =>
        await crmClient.taxFree.deleteApiCrmServiceTaxFreesByIdWithComponents({
          id,
        }),
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.taxFree.putApiCrmServiceTaxFreesByIdAddressesByAddressId(
          data,
        );
      },
      putEmailAddress: async (
        data: PutApiCrmServiceTaxFreesByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.taxFree.putApiCrmServiceTaxFreesByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceTaxFreesByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.taxFree.putApiCrmServiceTaxFreesByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceTaxFreesByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.taxFree.putApiCrmServiceTaxFreesByIdOrganizationsByOrganizationId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceTaxFreesByIdAffiliationsData,
      ) => {
        return await crmClient.taxFree.postApiCrmServiceTaxFreesByIdAffiliations(
          data,
        );
      },
    },
    "tax-offices": {
      getDetail: async (id: string) =>
        await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdDetail({ id }),
      get: async (data: GetApiCrmServiceTaxOfficesData = {}) =>
        await crmClient.taxOffice.getApiCrmServiceTaxOffices(data),
      getSubCompanies: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdSubTaxOffices(
          data,
        ),
      getIndivuals: async (data: {
        id: string;
        maxResultCount: number;
        skipCount: number;
      }) =>
        await crmClient.taxOffice.getApiCrmServiceTaxOfficesByIdAffiliations(
          data,
        ),
      deleteRow: async (id: string) =>
        await crmClient.taxOffice.deleteApiCrmServiceTaxOfficesByIdWithComponents(
          {
            id,
          },
        ),
      putAddress: async (
        data: PutApiCrmServiceMerchantsByIdAddressesByAddressIdData,
      ) => {
        return await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdAddressesByAddressId(
          data,
        );
      },
      putEmailAddress: async (
        data: PutApiCrmServiceTaxOfficesByIdEmailsByEmailIdData,
      ) => {
        return await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdEmailsByEmailId(
          data,
        );
      },
      putTelephone: async (
        data: PutApiCrmServiceTaxFreesByIdTelephonesByTelephoneIdData,
      ) => {
        return await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdTelephonesByTelephoneId(
          data,
        );
      },
      putOrganization: async (
        data: PutApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationIdData,
      ) => {
        return await crmClient.taxOffice.putApiCrmServiceTaxOfficesByIdOrganizationsByOrganizationId(
          data,
        );
      },
      postAffiliations: async (
        data: PostApiCrmServiceTaxOfficesByIdAffiliationsData,
      ) => {
        return await crmClient.taxOffice.postApiCrmServiceTaxOfficesByIdAffiliations(
          data,
        );
      },
    },
    individuals: {
      getDetail: async (id: string) =>
        await crmClient.individual.getApiCrmServiceIndividualsById({ id }),
      get: async (data: GetApiCrmServiceIndividualsData) =>
        await crmClient.individual.getApiCrmServiceIndividuals(data),
      deleteRow: async (id: string) =>
        await crmClient.taxOffice.deleteApiCrmServiceTaxOfficesByIdWithComponents(
          {
            id,
          },
        ),
      getAffiliationCode: async () =>
        await crmClient.affiliationCode.getApiCrmServiceAffiliationCodes(),
    },
    locations: {
      getCountries: async (data: GetApiLocationServiceCountriesData) =>
        await locationClient.country.getApiLocationServiceCountries(data),
      getRegionsByCountryId: async (
        data: GetApiLocationServiceRegionsGetListByCountryByCountryIdData,
      ) =>
        await locationClient.region.getApiLocationServiceRegionsGetListByCountryByCountryId(
          data,
        ),
      getDefaultRegionsByCountryId: async (
        data: GetApiLocationServiceRegionsGetDefaultRegionIdByCountryIdData,
      ) =>
        await locationClient.region.getApiLocationServiceRegionsGetDefaultRegionIdByCountryId(
          data,
        ),
      getCitiesByRegionId: async (
        data: GetApiLocationServiceCitiesGetListByRegionByRegionIdData,
      ) =>
        await locationClient.city.getApiLocationServiceCitiesGetListByRegionByRegionId(
          data,
        ),

      getCities: async (
        data: GetApiLocationServiceCitiesData, //this should be removed when the forms updated
      ) => await locationClient.city.getApiLocationServiceCities(data),
    },

    travellers: {
      get: async (data: GetApiTravellerServiceTravellersData) =>
        await travellerClient.traveller.getApiTravellerServiceTravellers(data),
      post: async (data: PostApiTravellerServiceTravellersData) =>
        await travellerClient.traveller.postApiTravellerServiceTravellers(data),
    },
    claims: {
      get: async (data: GetApiIdentityClaimTypesData) =>
        await identityClient.claimType.getApiIdentityClaimTypes(data),
    },
    roles: {
      get: async (data: GetApiIdentityRolesData) =>
        await identityClient.role.getApiIdentityRoles(data),
      getRoleClaims: async (data: GetApiIdentityRolesByIdClaimsData) =>
        await identityClient.role.getApiIdentityRolesByIdClaims(data),
      putRoleClaims: async (data: PutApiIdentityRolesByIdClaimsData) =>
        await identityClient.role.putApiIdentityRolesByIdClaims(data),
      getAllRoles: async () =>
        await identityClient.role.getApiIdentityRolesAll(),
      MoveAllUsers: async (data: PutApiIdentityRolesByIdMoveAllUsersData) =>
        await identityClient.role.putApiIdentityRolesByIdMoveAllUsers(data),
    },
    users: {
      get: async (data: GetApiIdentityUsersData) =>
        await identityClient.user.getApiIdentityUsers(data),
      getUserClaims: async (data: GetApiIdentityUsersByIdClaimsData) =>
        await identityClient.user.getApiIdentityUsersByIdClaims(data),
      putUserClaims: async (data: PutApiIdentityUsersByIdClaimsData) =>
        await identityClient.user.putApiIdentityUsersByIdClaims(data),
      "change-password": async (
        data: PutApiIdentityUsersByIdChangePasswordData,
      ) =>
        await identityClient.user.putApiIdentityUsersByIdChangePassword(data),
      "two-factor-enable": async (
        data: PutApiIdentityUsersByIdTwoFactorByEnabledData,
      ) =>
        await identityClient.user.putApiIdentityUsersByIdTwoFactorByEnabled(
          data,
        ),
    },
    tenants: {
      "set-password": async (data: PutApiSaasTenantsByIdSetPasswordData) =>
        await saasClient.tenant.putApiSaasTenantsByIdSetPassword(data),
    },
    editions: {
      getAllEditions: async () =>
        await saasClient.edition.getApiSaasEditionsAll(),
      moveAllTenants: async (data: PutApiSaasEditionsByIdMoveAllTenantsData) =>
        await saasClient.edition.putApiSaasEditionsByIdMoveAllTenants(data),
    },
    "export-validation": {
      get: async (data: GetApiExportValidationServiceExportValidationData) =>
        await exportValidationClient.exportValidation.getApiExportValidationServiceExportValidation(
          data,
        ),
      getDetail: async (id: string) =>
        await exportValidationClient.exportValidation.getApiExportValidationServiceExportValidationById(
          {
            id,
          },
        ),
      post: async (data: PostApiExportValidationServiceExportValidationData) =>
        await exportValidationClient.exportValidation.postApiExportValidationServiceExportValidation(
          data,
        ),
      put: async (
        data: PutApiExportValidationServiceExportValidationByIdData,
      ) =>
        await exportValidationClient.exportValidation.putApiExportValidationServiceExportValidationById(
          data,
        ),
      deleteRow: async (id: string) =>
        await exportValidationClient.exportValidation.deleteApiExportValidationServiceExportValidationById(
          {
            id,
          },
        ),
    },
    tags: {
      get: async (data: GetApiTagServiceTagData) =>
        await tagClient.tag.getApiTagServiceTag(data),
    },
    billing: {
      get: async (data: GetApiFinanceServiceBillingsData) =>
        await financeClient.billing.getApiFinanceServiceBillings(data),
      getDetail: async (id: string) =>
        await financeClient.billing.getApiFinanceServiceBillingsById({
          id,
        }),
      post: async (data: PostApiFinanceServiceBillingsData) =>
        await financeClient.billing.postApiFinanceServiceBillings(data),
      put: async (data: PutApiFinanceServiceBillingsByIdData) =>
        await financeClient.billing.putApiFinanceServiceBillingsById(data),
      deleteRow: async (id: string) =>
        await financeClient.billing.deleteApiFinanceServiceBillings({
          id,
        }),
    },
    applications: {
      putTokenLifetime: async (
        data: PutApiOpeniddictApplicationsByIdTokenLifetimeData,
      ) =>
        await identityClient.applications.putApiOpeniddictApplicationsByIdTokenLifetime(
          data,
        ),
    },
  };
  return tableRequests;
}
export async function getTableData(
  type: GetTableDataTypes,
  page = 0,
  maxResultCount = 10,
  filter?: FilterColumnResult,
) {
  try {
    const requests = await getApiRequests();
    const data = await requests[type].get({
      maxResultCount,
      skipCount: page * 10,
      ...filter,
    });
    return {
      type: "success",
      data,
      status: 200,
      message: "",
    };
  } catch (error) {
    return structuredError(error);
  }
}
export async function deleteTableRow(type: DeleteTableDataTypes, id: string) {
  try {
    const requests = await getApiRequests();
    return {
      type: "success",
      data: await requests[type].deleteRow(id),
      status: 200,
      message: "",
    };
  } catch (error) {
    return structuredError(error);
  }
}
export async function getTableDataDetail(
  type: GetDetailTableDataTypes,
  id: string,
) {
  try {
    const requests = await getApiRequests();
    return {
      type: "success",
      data: await requests[type].getDetail(id),
      status: 200,
      message: "",
    };
  } catch (error) {
    return structuredError(error);
  }
}
