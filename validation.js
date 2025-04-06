export const validateTaskData = ({ title, description, priorityId, statusId, due_date }) =>
    title &&
    typeof title === "string" &&
    title.length >= 3 &&
    title.length <= 50 &&
    
    description &&
    typeof description === "string" &&
    description.length >= 5 &&
    description.length <= 255 &&
    
    priorityId &&
    !isNaN(priorityId) &&
    
    statusId &&
    !isNaN(statusId) &&
    
    due_date &&
    !isNaN(Date.parse(due_date));

    // verifier si l'email est valide
export const isEmailValid = (email) =>
    email &&
    typeof email === "string" &&
    email.length >= 5 &&
    email.length <= 50 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// verifier si le password est valide
export const isPasswordValid = (password) =>
    password &&
    typeof password === "string" &&
    password.length >= 8 &&
    password.length <= 16;