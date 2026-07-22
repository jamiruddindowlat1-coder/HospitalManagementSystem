export const saveToken = (token)=>{
    localStorage.setItem(
        "token",
        token
    );
};

export const getToken = ()=>{
    return localStorage.getItem("token");
};

export const saveRefreshToken = (refreshToken)=>{
    localStorage.setItem(
        "refreshToken",
        refreshToken
    );
};

export const getRefreshToken = ()=>{
    return localStorage.getItem("refreshToken");
};

export const isAuthenticated = ()=>{
    return !!localStorage.getItem("token");
};

export const removeToken = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");
};

export const getRole = ()=>{
    return localStorage.getItem("role");
};

export const logout = ()=>{
    removeToken();
    window.location.href="/login";
};