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
