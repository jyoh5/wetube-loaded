import User from "../models/User";
import Video from "../models/Video";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
    const pageTitle = "Join";
    const { name, username, email, password, password2, location } = req.body;
    if (password !== password2) {
        return res.status(400).render("join", { pageTitle, errorMessage: "Password confirmation does not match." });
    }
    const exists = await User.exists({ $or: [{ username }, { email }] });
    if (exists) {
        return res.status(400).render("join", { pageTitle, errorMessage: "This username/email is already taken." });
    }
    try {
        await User.create({
            name, username, email, password, location
        });
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
    const pageTitle = "Login";
    const { username, password } = req.body;
    const user = await User.findOne({ username, socialOnly: false });
    if (!user) {
        return res.status(400).render("login", { pageTitle, errorMessage: "An account with this username does not exists." });
    }
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
        return res.status(400).render("login", { pageTitle, errorMessage: "Wrong password." });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
            method: "POST",
            headers: {
                Accept: "application/json"
            }
        })
    ).json();
    if ("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await (
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`
                }
            })
        ).json();
        const emailObj = emailData.find((email) => email.primary === true && email.verified === true);
        if (!emailObj) {
            // set notification
            return res.redirect("/login");
        }
        let user = await User.findOne({ email: emailObj.email });
        if (!user) {
            user = await User.create({
                name: userData.name,
                socialOnly: true,
                avatarUrl: userData.avatar_url,
                username: userData.login,
                email: emailObj.email,
                password: "",
                location: userData.location
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    } else {
        return res.redirect("/login");
    }
}


export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
}
export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
}
export const postEdit = async (req, res) => {
    const {
        session: { user: { _id, avatarUrl, email: sessionEmail, username: sessionUsername } },
        body: { name, email, username, location },
        file
    } = req;
    if (email !== sessionEmail || username !== sessionUsername) {
        const exists = await User.exists({ $or: [{ username }, { email }] });
        if (exists) {
            // to do: add error message
            return res.status(400).render("edit-profile", { pageTitle: "Edit Profile", errorMessage: "The email or username already exists." });
        }
    }
    const updatedUser = await User.findByIdAndUpdate(
        _id,
        { name, email, username, location, avatarUrl: file ? file.path : avatarUrl },
        { new: true }
    );
    req.session.user = updatedUser;
    // await User.findByIdAndUpdate(_id, { name, email, username, location });
    // req.session.user = {
    //     ...req.session.user, name, email, username, location,
    // }
    return res.redirect("/users/edit");
}

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
        return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "Change password" });
}
export const postChangePassword = async (req, res) => {
    const {
        session: { user: { _id } },
        body: { oldPassword, newPassword, newPasswordConfirmation }
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
        return res.status(400).render("users/change-password", { pageTitle: "Change password", errorMessage: "The current password is incorrect." });
    }
    if (newPassword !== newPasswordConfirmation) {
        return res.status(400).render("users/change-password", { pageTitle: "Change password", errorMessage: "The password does not match the confirmation." });
    }
    user.password = newPassword;
    await user.save();
    // send notification
    return res.redirect("/users/logout")
}
export const see = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id).populate("videos");
    console.log(user);
    if (!user) {
        return res.status(404).render("404", { pageTitle: "User not found." });
    }
    return res.render("users/profile", { pageTitle: user.name, user });
};
