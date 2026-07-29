import { useQuery } from "react-query";
import invoiceService from "../services/invoiceService";

export const useInvoice = (bookingId) =>
  useQuery(
    ["invoice", bookingId],
    () => invoiceService.getInvoice(bookingId),
    {
      enabled: !!bookingId,
    }
  );

export const useMyInvoices = () =>
  useQuery(
    "myInvoices",
    invoiceService.getMyInvoices
  );

export const useInstitutionInvoices = () =>
  useQuery(
    "institutionInvoices",
    invoiceService.getInstitutionInvoices
  );