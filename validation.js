export const validateDescription = (descrition) => 



    descrition &&
    typeof descrition === "string" &&
    descrition.length >= 5 &&
    descrition.length <= 50
