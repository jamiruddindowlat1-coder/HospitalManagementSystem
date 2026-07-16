import api from "./api";

// GET ALL DEPARTMENTS
export const getDepartments = async () => {
    const response = await api.get("/departments");
    return response.data;
};

// CREATE DEPARTMENT
export const createDepartment = async (department) => {
    const response = await api.post(
        "/departments",
        department
    );
    return response.data;
};

// UPDATE DEPARTMENT
export const updateDepartment = async (id, department) => {
    const response = await api.put(
        `/departments/${id}`,
        {
            departmentId: id,
            departmentName: department.departmentName,
            description: department.description
        }
    );
    return response.data;
};

export const deleteDepartment = async (id) => {
    const response = await api.delete(
        `/departments/${id}`
    );
    return response.data;
};

// Default export object so components using
// `import departmentService from "../services/departmentService"`
// continue to work alongside the named exports above.
const departmentService = {
    getDepartments,
    getAllDepartments: getDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};

export default departmentService;