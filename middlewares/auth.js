export const requireAuth = (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
        return res.redirect("/connexion");
    }
    next();
};
