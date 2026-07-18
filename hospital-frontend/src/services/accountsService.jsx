import api from "./api";

// ================= INCOME =================
export const getAllIncome = async () => {
    const response = await api.get("/income");
    return response.data;
};

export const getIncomeById = async (id) => {
    const response = await api.get(`/income/${id}`);
    return response.data;
};

export const createIncome = async (income) => {
    const response = await api.post("/income", income);
    return response.data;
};

// ================= EXPENSE =================
export const getAllExpense = async () => {
    const response = await api.get("/expense");
    return response.data;
};

export const getExpenseById = async (id) => {
    const response = await api.get(`/expense/${id}`);
    return response.data;
};

export const createExpense = async (expense) => {
    const response = await api.post("/expense", expense);
    return response.data;
};

export const updateExpense = async (id, expense) => {
    const response = await api.put(`/expense/${id}`, expense);
    return response.data;
};

export const deleteExpense = async (id) => {
    const response = await api.delete(`/expense/${id}`);
    return response.data;
};

// ================= SALARY PAYMENTS =================
export const getAllSalaryPayments = async () => {
    const response = await api.get("/salarypayments");
    return response.data;
};

export const getSalaryPaymentById = async (id) => {
    const response = await api.get(`/salarypayments/${id}`);
    return response.data;
};

export const createSalaryPayment = async (payment) => {
    const response = await api.post("/salarypayments", payment);
    return response.data;
};

export const updateSalaryPayment = async (id, payment) => {
    const response = await api.put(`/salarypayments/${id}`, payment);
    return response.data;
};

export const deleteSalaryPayment = async (id) => {
    const response = await api.delete(`/salarypayments/${id}`);
    return response.data;
};

// ================= LEDGER (read-only) =================
export const getLedger = async () => {
    const response = await api.get("/ledger");
    return response.data;
};

export const getLedgerBalance = async () => {
    const response = await api.get("/ledger/balance");
    return response.data;
};

export const getLedgerSummary = async () => {
    const response = await api.get("/ledger/summary");
    return response.data;
};

// ================= ACCOUNTS DASHBOARD =================
export const getAccountsSummary = async () => {
    const response = await api.get("/accountsdashboard/summary");
    return response.data;
};

export const getAccountsMonthly = async () => {
    const response = await api.get("/accountsdashboard/monthly");
    return response.data;
};

export const getAccountsRecent = async () => {
    const response = await api.get("/accountsdashboard/recent");
    return response.data;
};

// Default export object so components using
// `import accountsService from "../services/accountsService"`
// work alongside the named exports above.
const accountsService = {
    getAllIncome,
    getIncomeById,
    createIncome,
    getAllExpense,
    getExpenseById,
    createExpense,
    updateExpense,
    deleteExpense,
    getAllSalaryPayments,
    getSalaryPaymentById,
    createSalaryPayment,
    updateSalaryPayment,
    deleteSalaryPayment,
    getLedger,
    getLedgerBalance,
    getLedgerSummary,
    getAccountsSummary,
    getAccountsMonthly,
    getAccountsRecent,
};

export default accountsService;
