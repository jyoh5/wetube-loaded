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
        const videos = await Video.find({}).sort({createdAt:"desc"});
        return res.render("home", { pageTitle : "Home", videos });
    }catch(error){
        return res.status(400).render("server-error", {error});
    }
};
export const watch = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    return res.render("watch", {pageTitle : video.title, video });
}
export const getEdit = async(req, res) => {
    const { id } = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    return res.render("edit", {pageTitle : `Edit: ${video.title}`, video});
}
export const postEdit = async(req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({_id:id});
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    await Video.findByIdAndUpdate(id, {
        title, 
        description, 
        hashtags: Video.formatHashtags(hashtags)
    });
    return res.redirect(`/videos/${id}`);
}
export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle : "upload video"});
}
export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try{
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags)
        });
        // const dbVideo = await video.save(); // promise이기 때문에 await 사용
        return res.redirect("/");
    }catch(error){
        return res.status(400).render("upload", {pageTitle : "upload video", errorMessage: error._message});
    }
}

export const deletVideo = async (req, res) => {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
};

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if (keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            },
        });
    }
    return res.render("search", { pageTitle : "Search", videos });
}