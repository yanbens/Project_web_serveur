import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import { getUserByEmail } from "./model/user.js";

const config = {
    usernameField: "email",
    passwordField: "password",
};

passport.use(
    new Strategy(config, async (email, password, done) => {
        try {
            const user = await getUserByEmail(email);

            if (!user) {
                return done(null, false, { erreur: "mauvais_utilisateur" });
            }

            const valide = await bcrypt.compare(password, user.password);

            if (!valide) {
                return done(null, false, { erreur: "mauvais_mot_de_passe" });
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
    try {
        const user = await getUserByEmail(email);
        done(null, user);
    } catch (error) {
        done(error);
    }
});
