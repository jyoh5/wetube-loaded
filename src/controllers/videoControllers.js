// const fakeUser = {
//     username: "jyoh",
//     loggedIn: false,
// }


// const videos = [1,2,3,4,5,6,7,8,9,10];
    // const videos = [];
    const videos = [
        {
            title:"First video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 59,
            id: 1
        },
        {
            title:"Seconde video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 59,
            id: 2
        },
        {
            title:"Third video",
            rating: 5,
            comments: 2,
            createdAt: "2 minutes ago",
            views: 59,
            id: 3
        },
    ]

// export const trending = (req, res) => res.send("Home page Videos");
export const trending = (req, res) => res.render("home", {pageTitle : "Home", videos});
export const see = (req, res) => {
    const { id } = req.params;
    const video = videos[id - 1];
    res.render("watch", {pageTitle : `Watching ${video.title}`})
};
export const edit = (req, res) => res.render("edit", {pageTitle : "Edit"});
export const search = (req, res) => res.send("Search Videos");
export const upload = (req, res) => res.send("Upload Videos");
export const deleteVideo = (req, res) => res.send("Delete Videos");

