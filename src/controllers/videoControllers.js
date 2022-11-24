import Video from "../models/Video"


// const fakeUser = {
//     username: "jyoh",
//     loggedIn: false,
// }


// const videos = [1,2,3,4,5,6,7,8,9,10];
    // const videos = [];

// export const trending = (req, res) => res.send("Home page Videos");
export const home = (req, res) => {
    Video.find({}, (error, videos) => {
        console.log("errors", error);
        console.log("videos", videos);
        return res.render("home", { pageTitle : "Home", videos })
    });
};
export const watch = (req, res) => {
    const { id } = req.params;
    return res.render("watch", {pageTitle : `Watching` })
};
export const editGet = (req, res) => {
    const { id } = req.params;
    return res.render("edit", {pageTitle : `Editing`});
}
export const editPost = (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
}
export const uploadGet = (req, res) => {
    return res.render("upload", {pageTitle : "upload video"});
}
export const uploadPost = (req, res) => {
    const { title } = req.body;
    return res.redirect("/");
}

