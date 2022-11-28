import Video from "../models/Video"


// const fakeUser = {
//     username: "jyoh",
//     loggedIn: false,
// }


// const videos = [1,2,3,4,5,6,7,8,9,10];
    // const videos = [];

// export const trending = (req, res) => res.send("Home page Videos");
export const home = async(req, res) => {
    try{
        const videos = await Video.find({});
        return res.render("home", { pageTitle : "Home", videos });
    }catch(error){
        return res.render("server-error", {error});
    }
};
export const watch = (req, res) => {
    const { id } = req.params;
    return res.render("watch", {pageTitle : `Watching` });
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
export const uploadPost = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try{
        await Video.create({
            title,
            description,
            hashtag: hashtags.split(",").map(word => `#${word}`),
        });
        // const dbVideo = await video.save(); // promise이기 때문에 await 사용
        return res.redirect("/");
    }catch(error){
        return res.render("upload", {pageTitle : "upload video", errorMessage: error._message});
    }
}

