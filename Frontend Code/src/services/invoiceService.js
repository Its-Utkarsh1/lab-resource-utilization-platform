import api from "./api";

const invoiceService = {
  getInvoice: async (bookingId) => {
    const { data } = await api.get(`/invoices/${bookingId}`);
    return data;
  },

  getMyInvoices: async () => {
    const { data } = await api.get("/invoices/my");
    return data;
  },

  getInstitutionInvoices: async () => {
    const { data } = await api.get("/invoices/institution");
    return data;
  },
};

export default invoiceService;