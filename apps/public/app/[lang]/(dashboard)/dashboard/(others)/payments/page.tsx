import {getApiPaymentTransactionApi} from "@repo/actions/upwithcrowd/payment-transaction/action";
import {structuredError} from "@repo/utils/api";
import {isRedirectError} from "next/dist/client/components/redirect";
import EmptyPaymentsState from "../_components/empty-payments-state";
import PaymentsPage from "./client";

async function getApiRequests() {
  try {
    const requiredRequests = await Promise.all([getApiPaymentTransactionApi()]);
    const optionalRequests = await Promise.allSettled([]);
    return {requiredRequests, optionalRequests};
  } catch (error) {
    if (!isRedirectError(error)) {
      return structuredError(error);
    }
    throw error;
  }
}

export default async function Page() {
  const apiRequests = await getApiRequests();
  if ("message" in apiRequests) {
    return <EmptyPaymentsState />;
  }

  const [paymentsResponse] = apiRequests.requiredRequests;
  const payments = paymentsResponse.data;

  // Ödeme yoksa boş durumu göster
  if (payments.totalCount === 0) {
    return <EmptyPaymentsState />;
  }

  // İlk proje ID'sini al veya varsayılan değer kullan
  const firstProjectID = payments.items?.[0]?.id || "";
  const defaultAmount = 0;

  return <PaymentsPage amount={defaultAmount} payments={payments} projectID={firstProjectID} />;
}
