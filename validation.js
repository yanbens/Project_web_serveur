 export const validateDescription = (descrition) => {


return (
    descrition &&
    typeof descrition === "string" &&
    descrition.length >= 5 &&
    descrition.length <= 50
);
};;